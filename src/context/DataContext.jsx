import React, { createContext, useContext, useMemo, useState, useCallback, useEffect, useRef } from 'react';
import seed, { EVAL_WEIGHTS, ACADEMIC_YEAR, SEMESTER } from '../data/seed';
import { dataSourceLabel, isSupabaseConfigured } from '../services/supabase';
import * as trainersApi from '../services/trainersApi';
import * as traineesApi from '../services/traineesApi';
import * as usersApi from '../services/usersApi';
import * as auditApi from '../services/auditApi';
import { selectAll, insertRow, updateRow, deleteRow, subscribeTable } from '../services/db';


const DataContext = createContext(null);

const clone = (v) => JSON.parse(JSON.stringify(v));
const TODAY = '2026-06-17';

// True when a live Supabase backend is configured. Drives every mutation's
// local-vs-remote branch. When false the app runs fully on the seed dataset.
const LIVE = isSupabaseConfigured;

// In live mode every dataset hydrates from Supabase, so initial state is empty —
// the app never shows mock data when connected. Offline, it boots on the seed.
const initData = (arr) => (LIVE ? [] : clone(arr));

// Client-supplied ids keep seed + live data identically shaped and let derived
// joins (schedules.trainerId === t.id, etc.) keep working. Random tail avoids
// double-click collisions.
const genId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

// Shallow field diff for the audit trail: { field: { from, to } }.
const diffFields = (before, patch) => {
  const changes = {};
  Object.keys(patch || {}).forEach((k) => {
    if (!before || before[k] !== patch[k]) changes[k] = { from: before ? before[k] : undefined, to: patch[k] };
  });
  return changes;
};

export function DataProvider({ children }) {
  const [departments, setDepartments] = useState(() => initData(seed.departments));
  const [centers, setCenters] = useState(() => initData(seed.centers));
  const [rooms, setRooms] = useState(() => initData(seed.rooms));
  const [courses, setCourses] = useState(() => initData(seed.courses));
  const [trainers, setTrainers] = useState(() => initData(seed.trainers));

  const [users, setUsers] = useState(() => initData(seed.users));
  const [trainees, setTrainees] = useState(() => initData(seed.trainees));
  const [schedules, setSchedules] = useState(() => initData(seed.schedules));
  const [examApprovals, setExamApprovals] = useState(() => initData(seed.examApprovals));
  const [complaints, setComplaints] = useState(() => initData(seed.complaints));
  const [webinars, setWebinars] = useState(() => initData(seed.webinars));

  // Trainer-submitted datasets — stateful so submissions appear live for admins.
  const [attendanceRecords, setAttendanceRecords] = useState(() => initData(seed.attendanceRecords));
  const [courseCoverage, setCourseCoverage] = useState(() => initData(seed.courseCoverage));
  const [coopFollowups, setCoopFollowups] = useState(() => initData(seed.coopFollowups));
  const [skillGapTraining, setSkillGapTraining] = useState(() => initData(seed.skillGapTraining));

  const [assessmentResults, setAssessmentResults] = useState(() => initData(seed.assessmentResults));
  const [cocRegistrations, setCocRegistrations] = useState(() => initData(seed.cocRegistrations));
  const [trainerEvaluations, setTrainerEvaluations] = useState(() => initData(seed.trainerEvaluations));

  // ---- Live-sync state -----------------------------------------------------
  const [dataReady, setDataReady] = useState(!LIVE);
  const [auditLog, setAuditLog] = useState([]);

  // Refs mirror the latest arrays so mutation callbacks can snapshot for
  // rollback / dedupe without listing the arrays in their dependency lists
  // (keeps the callbacks stable for the many consumers across the app).
  const trainersRef = useRef(trainers);
  const traineesRef = useRef(trainees);
  useEffect(() => { trainersRef.current = trainers; }, [trainers]);
  useEffect(() => { traineesRef.current = trainees; }, [trainees]);

  // Logged-in user (set from App on login) — used as the audit actor.
  const [currentUser, setCurrentUserState] = useState(null);
  const currentUserRef = useRef(null);
  const setCurrentUser = useCallback((u) => { currentUserRef.current = u; setCurrentUserState(u); }, []);

  // ---- Lookup helpers -------------------------------------------------------
  const deptName = useCallback((id) => departments.find((d) => d.id === id)?.name || '—', [departments]);
  const centerName = useCallback((id) => centers.find((c) => c.id === id)?.name || '—', [centers]);
  const roomName = useCallback((id) => rooms.find((r) => r.id === id)?.roomNumber || '—', [rooms]);
  const trainerName = useCallback((id) => trainers.find((t) => t.id === id)?.name || '—', [trainers]);
  const trainerByUserId = useCallback((userId) => trainers.find((t) => t.userId === userId), [trainers]);
  const courseTitle = useCallback((id) => courses.find((c) => c.id === id)?.unitTitle || '—', [courses]);
  const courseById = useCallback((id) => courses.find((c) => c.id === id), [courses]);
  const scheduleById = useCallback((id) => schedules.find((s) => s.id === id), [schedules]);

  // ---- Admin notification feed (also used as toast feedback) ---------------
  const [notifications, setNotifications] = useState([]);
  const notify = useCallback((text, type = 'info') => {
    setNotifications((prev) => [{ id: `N-${Date.now()}-${prev.length}`, text, type, time: 'just now', read: false }, ...prev]);
  }, []);
  const markNotificationsRead = useCallback(() =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))), []);

  // ---- Audit trail ----------------------------------------------------------
  const logAudit = useCallback((entity, entityId, action, changes) => {
    const actor = currentUserRef.current?.username || currentUserRef.current?.name || 'system';
    const entry = { id: genId('AUD'), entity, entityId, action, actor, changes, createdAt: TODAY };
    setAuditLog((prev) => [entry, ...prev]);
    if (LIVE) auditApi.insert(entry);
  }, []);

  const auditFor = useCallback(async (entity, entityId) => {
    if (LIVE) {
      const rows = await auditApi.listFor(entity, entityId);
      if (rows) return rows;
    }
    return auditLog.filter((a) => a.entity === entity && a.entityId === entityId);
  }, [auditLog]);

  const listAllAudits = useCallback(async () => {
    if (LIVE) {
      const rows = await auditApi.listAll();
      if (rows) return rows;
    }
    return auditLog;
  }, [auditLog]);

  const updateUserPassword = useCallback(async (userId, currentPassword, newPassword) => {
    const snapshot = users;
    const userObj = users.find((u) => u.id === userId);
    if (!userObj) return { error: new Error('User not found.') };

    // Check current password (if currentPassword is not null - e.g. for self-service resets)
    if (currentPassword !== null) {
      const expectedPassword = userObj.password || userObj.username;
      if (currentPassword !== expectedPassword) {
        return { error: new Error('Incorrect current password.') };
      }
    }

    // Optimistic update
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, password: newPassword } : u)));

    if (LIVE) {
      const { error } = await usersApi.update(userId, { password: newPassword });
      if (error) {
        setUsers(snapshot);
        notify('Password update failed on server.', 'danger');
        return { error };
      }
    }

    logAudit('user', userId, 'reset-password', { username: userObj.username });
    notify('Password updated successfully.', 'success');
    return {};
  }, [users, logAudit, notify]);


  // ---- Trainer mutations (optimistic; remote when LIVE) ---------------------
  const addTrainer = useCallback(async (t) => {
    const userId = genId('USR');
    const trainerId = genId('TR');

    const userRecord = {
      id: userId,
      username: t.username || t.staffNo || genId('u'),
      fullName: t.name,
      email: t.email || null,
      role: 'Trainer',
      departmentId: t.departmentId || null,
      mobileNumber: t.mobileNumber || null,
      status: t.presentStatus || 'Active',
      password: t.password || t.username || t.staffNo,
      createdAt: TODAY,
    };

    const trainerRecord = {
      id: trainerId,
      userId: userId,
      name: t.name,
      staffNo: t.staffNo,
      departmentId: t.departmentId,
      employmentType: t.employmentType,
      presentStatus: t.presentStatus,
      rating: Number(t.rating) || 4.5,
      photoUrl: t.photoUrl || '',
    };

    const usersSnapshot = users;
    const trainersSnapshot = trainersRef.current;

    setUsers((prev) => [userRecord, ...prev]);
    setTrainers((prev) => [trainerRecord, ...prev]);

    if (LIVE) {
      const { error: uError } = await usersApi.insert(userRecord);
      if (uError) {
        setUsers(usersSnapshot);
        setTrainers(trainersSnapshot);
        notify('Could not save user credentials — reverted.', 'danger');
        return { error: uError };
      }

      const { error: tError } = await trainersApi.insert(trainerRecord);
      if (tError) {
        await usersApi.remove(userId);
        setUsers(usersSnapshot);
        setTrainers(trainersSnapshot);
        notify('Could not save trainer details — reverted.', 'danger');
        return { error: tError };
      }
    }

    logAudit('trainer', trainerId, 'create', { name: trainerRecord.name, staffNo: trainerRecord.staffNo });
    notify(`Trainer “${trainerRecord.name}” added.`, 'success');
    return { data: trainerRecord };
  }, [users, logAudit, notify]);

  const updateTrainer = useCallback(async (id, patch) => {
    const trainersSnapshot = trainersRef.current;
    const usersSnapshot = users;
    const beforeTrainer = trainersSnapshot.find((t) => t.id === id);
    if (!beforeTrainer) return { error: new Error('Trainer not found') };

    const userId = beforeTrainer.userId;

    const trainerFields = {};
    const userFields = {};

    if ('name' in patch) { trainerFields.name = patch.name; userFields.fullName = patch.name; }
    if ('staffNo' in patch) trainerFields.staffNo = patch.staffNo;
    if ('departmentId' in patch) { trainerFields.departmentId = patch.departmentId; userFields.departmentId = patch.departmentId; }
    if ('employmentType' in patch) trainerFields.employmentType = patch.employmentType;
    if ('presentStatus' in patch) {
      trainerFields.presentStatus = patch.presentStatus;
      userFields.status = patch.presentStatus === 'Released' ? 'Inactive' : 'Active';
    }
    if ('rating' in patch) trainerFields.rating = Number(patch.rating);
    if ('photoUrl' in patch) trainerFields.photoUrl = patch.photoUrl;

    if ('username' in patch) userFields.username = patch.username;
    if ('password' in patch) userFields.password = patch.password;
    if ('email' in patch) userFields.email = patch.email;
    if ('mobileNumber' in patch) userFields.mobileNumber = patch.mobileNumber;

    setTrainers((prev) => prev.map((t) => (t.id === id ? { ...t, ...trainerFields } : t)));
    if (userId && Object.keys(userFields).length > 0) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...userFields } : u)));
    }

    if (LIVE) {
      if (userId && Object.keys(userFields).length > 0) {
        const { error: uError } = await usersApi.update(userId, userFields);
        if (uError) {
          setTrainers(trainersSnapshot);
          setUsers(usersSnapshot);
          notify('User credentials update failed — reverted.', 'danger');
          return { error: uError };
        }
      }

      if (Object.keys(trainerFields).length > 0) {
        const { error: tError } = await trainersApi.update(id, trainerFields);
        if (tError) {
          setTrainers(trainersSnapshot);
          setUsers(usersSnapshot);
          notify('Trainer update failed — reverted.', 'danger');
          return { error: tError };
        }
      }
    }

    logAudit('trainer', id, Object.keys(patch).length === 1 && 'presentStatus' in patch ? 'status' : 'update', diffFields(beforeTrainer, patch));
    return {};
  }, [users, logAudit, notify]);

  const deleteTrainer = useCallback(async (id) => {
    const trainersSnapshot = trainersRef.current;
    const usersSnapshot = users;
    const beforeTrainer = trainersSnapshot.find((t) => t.id === id);
    if (!beforeTrainer) return { error: new Error('Trainer not found') };

    const userId = beforeTrainer.userId;

    setTrainers((prev) => prev.filter((t) => t.id !== id));
    if (userId) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }

    if (LIVE) {
      const { error: tError } = await trainersApi.remove(id);
      if (tError) {
        setTrainers(trainersSnapshot);
        setUsers(usersSnapshot);
        notify('Delete trainer failed — reverted.', 'danger');
        return { error: tError };
      }

      if (userId) {
        const { error: uError } = await usersApi.remove(userId);
        if (uError) {
          console.warn('[ATMS] user cleanup failed', uError);
        }
      }
    }

    logAudit('trainer', id, 'delete', { name: beforeTrainer.name });
    notify('Trainer removed.', 'info');
    return {};
  }, [users, logAudit, notify]);

  const deleteTrainersBulk = useCallback(async (ids) => {
    if (!ids?.length) return {};
    const trainersSnapshot = trainersRef.current;
    const usersSnapshot = users;
    const idSet = new Set(ids);
    const userIds = trainersSnapshot.filter((t) => idSet.has(t.id) && t.userId).map((t) => t.userId);

    setTrainers((prev) => prev.filter((t) => !idSet.has(t.id)));
    if (userIds.length > 0) {
      const userSet = new Set(userIds);
      setUsers((prev) => prev.filter((u) => !userSet.has(u.id)));
    }

    if (LIVE) {
      const { error: tError } = await trainersApi.removeMany(ids);
      if (tError) {
        setTrainers(trainersSnapshot);
        setUsers(usersSnapshot);
        notify('Bulk delete trainers failed — reverted.', 'danger');
        return { error: tError };
      }

      if (userIds.length > 0) {
        const { error: uError } = await usersApi.removeMany(userIds);
        if (uError) {
          console.warn('[ATMS] users bulk cleanup failed', uError);
        }
      }
    }

    ids.forEach((id) => logAudit('trainer', id, 'delete', null));
    notify(`${ids.length} trainer(s) removed.`, 'info');
    return {};
  }, [users, logAudit, notify]);

  // ---- Trainee mutations ----------------------------------------------------
  const addTrainee = useCallback(async (t) => {
    const record = { ...t, id: genId('TRNE') };
    const snapshot = traineesRef.current;
    setTrainees((prev) => [record, ...prev]);
    if (LIVE) {
      const { error } = await traineesApi.insert(record);
      if (error) { setTrainees(snapshot); notify('Could not save trainee — reverted.', 'danger'); return { error }; }
    }
    logAudit('trainee', record.id, 'create', { studentId: record.studentId, fullName: record.fullName });
    notify(`Trainee “${record.fullName}” registered.`, 'success');
    return { data: record };
  }, [logAudit, notify]);

  const updateTrainee = useCallback(async (id, patch) => {
    const snapshot = traineesRef.current;
    const before = snapshot.find((t) => t.id === id);
    setTrainees((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    if (LIVE) {
      const { error } = await traineesApi.update(id, patch);
      if (error) { setTrainees(snapshot); notify('Update failed — reverted.', 'danger'); return { error }; }
    }
    logAudit('trainee', id, 'update', diffFields(before, patch));
    return {};
  }, [logAudit, notify]);

  const deleteTrainee = useCallback(async (id) => {
    const snapshot = traineesRef.current;
    const before = snapshot.find((t) => t.id === id);
    setTrainees((prev) => prev.filter((t) => t.id !== id));
    if (LIVE) {
      const { error } = await traineesApi.remove(id);
      if (error) { setTrainees(snapshot); notify('Delete failed — reverted.', 'danger'); return { error }; }
    }
    logAudit('trainee', id, 'delete', { fullName: before?.fullName });
    notify('Trainee removed.', 'info');
    return {};
  }, [logAudit, notify]);

  const deleteTraineesBulk = useCallback(async (ids) => {
    if (!ids?.length) return {};
    const snapshot = traineesRef.current;
    const idSet = new Set(ids);
    setTrainees((prev) => prev.filter((t) => !idSet.has(t.id)));
    if (LIVE) {
      const { error } = await traineesApi.removeMany(ids);
      if (error) { setTrainees(snapshot); notify('Bulk delete failed — reverted.', 'danger'); return { error }; }
    }
    ids.forEach((id) => logAudit('trainee', id, 'delete', null));
    notify(`${ids.length} trainee(s) removed.`, 'info');
    return {};
  }, [logAudit, notify]);

  // ---- Other mutations (remote when LIVE) -----------------------------
  const addSchedule = useCallback(async (s) => {
    const record = { ...s, id: genId('SCH') };
    const snapshot = schedules;
    setSchedules((prev) => [record, ...prev]);
    if (LIVE) {
      const { error } = await insertRow('schedules', record);
      if (error) {
        setSchedules(snapshot);
        notify('Could not save schedule — reverted.', 'danger');
        return { error };
      }
    }
    logAudit('schedule', record.id, 'create', { sectionCode: record.sectionCode });
    notify(`Schedule created for ${record.sectionCode}`, 'success');
    return { data: record };
  }, [schedules, logAudit, notify]);

  const deleteSchedule = useCallback(async (id) => {
    const snapshot = schedules;
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    if (LIVE) {
      const { error } = await deleteRow('schedules', id);
      if (error) {
        setSchedules(snapshot);
        notify('Could not delete schedule — reverted.', 'danger');
        return { error };
      }
    }
    logAudit('schedule', id, 'delete', null);
    notify('Schedule entry removed.', 'info');
    return {};
  }, [schedules, logAudit, notify]);

  const setExamStatus = useCallback(async (id, status) => {
    const snapshot = examApprovals;
    const patch = { status, approvalDate: status === 'Approved' ? TODAY : null };
    setExamApprovals((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    if (LIVE) {
      const { error } = await updateRow('exam_approvals', id, patch);
      if (error) {
        setExamApprovals(snapshot);
        notify('Could not update exam status — reverted.', 'danger');
        return { error };
      }
    }
    logAudit('exam_approval', id, 'status', { status });
    notify(`Exam status updated to ${status}.`, 'info');
    return {};
  }, [examApprovals, logAudit, notify]);

  const setComplaintStatus = useCallback(async (id, status) => {
    const snapshot = complaints;
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    if (LIVE) {
      const { error } = await updateRow('complaints', id, { status });
      if (error) {
        setComplaints(snapshot);
        notify('Could not update complaint status — reverted.', 'danger');
        return { error };
      }
    }
    logAudit('complaint', id, 'status', { status });
    notify(`Complaint status updated to ${status}.`, 'info');
    return {};
  }, [complaints, logAudit, notify]);

  // ---- Trainer submission actions (flow straight into admin views) ---------
  const submitAttendance = useCallback(async (rec) => {
    const record = { ...rec, id: genId('ATT') };
    const snapshot = attendanceRecords;
    setAttendanceRecords((prev) => [record, ...prev]);
    if (LIVE) {
      const { error } = await insertRow('attendance', record);
      if (error) {
        setAttendanceRecords(snapshot);
        notify('Could not submit attendance — reverted.', 'danger');
        return { error };
      }
    }
    logAudit('attendance', record.id, 'submit', { date: record.date });
    notify(`Attendance submitted for ${record.sectionLabel || 'a section'}`, 'info');
    return { data: record };
  }, [attendanceRecords, logAudit, notify]);

  const submitCoverage = useCallback(async (rec) => {
    const record = { ...rec, id: genId('CC') };
    const snapshot = courseCoverage;
    setCourseCoverage((prev) => [record, ...prev]);
    if (LIVE) {
      const { error } = await insertRow('course_coverage', record);
      if (error) {
        setCourseCoverage(snapshot);
        notify('Could not save course coverage — reverted.', 'danger');
        return { error };
      }
    }
    logAudit('course_coverage', record.id, 'submit', { courseId: record.courseId });
    notify(`Course coverage updated for ${record.courseLabel || 'a unit'}`, 'success');
    return { data: record };
  }, [courseCoverage, logAudit, notify]);

  const submitCoop = useCallback(async (rec) => {
    const record = { ...rec, id: genId('COOP') };
    const snapshot = coopFollowups;
    setCoopFollowups((prev) => [record, ...prev]);
    if (LIVE) {
      const { error } = await insertRow('coop_followups', record);
      if (error) {
        setCoopFollowups(snapshot);
        notify('Could not save coop report — reverted.', 'danger');
        return { error };
      }
    }
    logAudit('coop_followup', record.id, 'submit', { traineeName: record.traineeName });
    notify(`Coop follow-up logged for ${record.traineeName}`, 'info');
    return { data: record };
  }, [coopFollowups, logAudit, notify]);

  const submitSkillGap = useCallback(async (rec) => {
    const record = { ...rec, id: genId('SG') };
    const snapshot = skillGapTraining;
    setSkillGapTraining((prev) => [record, ...prev]);
    if (LIVE) {
      const { error } = await insertRow('skill_gap_training', record);
      if (error) {
        setSkillGapTraining(snapshot);
        notify('Could not save skill-gap report — reverted.', 'danger');
        return { error };
      }
    }
    logAudit('skill_gap', record.id, 'submit', { skillArea: record.skillArea });
    notify(`Skill-gap session reported: ${rec.skillArea}`, 'info');
    return { data: record };
  }, [skillGapTraining, logAudit, notify]);

  const submitExamPlan = useCallback(async (rec) => {
    const record = { ...rec, id: genId('EX'), status: 'Pending' };
    const snapshot = examApprovals;
    setExamApprovals((prev) => [record, ...prev]);
    if (LIVE) {
      const { error } = await insertRow('exam_approvals', record);
      if (error) {
        setExamApprovals(snapshot);
        notify('Could not submit exam plan — reverted.', 'danger');
        return { error };
      }
    }
    logAudit('exam_approval', record.id, 'submit', { examType: record.examType });
    notify(`New exam plan submitted for approval (${record.examType})`, 'warning');
    return { data: record };
  }, [examApprovals, logAudit, notify]);

  // ---- Live hydrate + realtime (only when Supabase is configured) ----------
  // Pulls every dataset from Supabase in one pass so the UI reflects the live
  // backend (no mock data). Tables that error or are empty stay [].
  useEffect(() => {
    if (!LIVE) return;
    let cancelled = false;
    (async () => {
      const [
        deps, cens, rms, crs, usrs, tr, tn, sch,
        att, cov, sg, coop, coc, exams, results, evals, webs, comps,
      ] = await Promise.all([
        selectAll('departments'), selectAll('centers'), selectAll('rooms'), selectAll('courses'),
        selectAll('users'), trainersApi.list(), traineesApi.list(), selectAll('schedules'),
        selectAll('attendance'), selectAll('course_coverage'), selectAll('skill_gap_training'),
        selectAll('coop_followups'), selectAll('coc_registrations'), selectAll('exam_approvals'),
        selectAll('assessment_results'), selectAll('trainer_evaluations'), selectAll('webinars'),
        selectAll('complaints'),
      ]);
      if (cancelled) return;

      // Count failures
      const failedTables = [];
      if (!deps) failedTables.push('departments');
      if (!cens) failedTables.push('centers');
      if (!rms) failedTables.push('rooms');
      if (!crs) failedTables.push('courses');
      if (!usrs) failedTables.push('users');
      if (!tr) failedTables.push('trainers');
      if (!tn) failedTables.push('trainees');
      if (!sch) failedTables.push('schedules');
      if (!att) failedTables.push('attendance');
      if (!cov) failedTables.push('course_coverage');
      if (!sg) failedTables.push('skill_gap_training');
      if (!coop) failedTables.push('coop_followups');
      if (!coc) failedTables.push('coc_registrations');
      if (!exams) failedTables.push('exam_approvals');
      if (!results) failedTables.push('assessment_results');
      if (!evals) failedTables.push('trainer_evaluations');
      if (!webs) failedTables.push('webinars');
      if (!comps) failedTables.push('complaints');

      // Update data
      if (deps) setDepartments(deps);
      if (cens) setCenters(cens);
      if (rms) setRooms(rms);
      if (crs) setCourses(crs);
      if (usrs) setUsers(usrs);
      if (tr) setTrainers(tr);
      if (tn) setTrainees(tn);
      if (sch) setSchedules(sch);
      if (att) setAttendanceRecords(att);
      if (cov) setCourseCoverage(cov);
      if (sg) setSkillGapTraining(sg);
      if (coop) setCoopFollowups(coop);
      if (coc) setCocRegistrations(coc);
      if (exams) setExamApprovals(exams);
      if (results) setAssessmentResults(results);
      if (evals) setTrainerEvaluations(evals);
      if (webs) setWebinars(webs);
      if (comps) setComplaints(comps);

      // Provide detailed error feedback
      if (failedTables.length > 0) {
        if (failedTables.length > 5) {
          notify(`Database sync failed: ${failedTables.length} tables unavailable. Running in offline mode.`, 'warning');
        } else {
          notify(`Database sync incomplete: ${failedTables.join(', ')} unavailable.`, 'warning');
        }
      } else {
        notify('All data synced from database successfully.', 'info');
      }

      setDataReady(true);
    })();
    return () => { cancelled = true; };
  }, [notify]);

  useEffect(() => {
    if (!LIVE) return;
    let active = true;
    const cleanups = [];
    const apply = (setter, evt, row) => {
      if (evt === 'DELETE') { setter((prev) => prev.filter((x) => x.id !== row.id)); return; }
      setter((prev) => (prev.some((x) => x.id === row.id)
        ? prev.map((x) => (x.id === row.id ? row : x))
        : [row, ...prev]));
    };
    (async () => {
      const unsubT = await trainersApi.subscribe((evt, row) => apply(setTrainers, evt, row));
      const unsubN = await traineesApi.subscribe((evt, row) => apply(setTrainees, evt, row));
      const unsubU = await usersApi.subscribe((evt, row) => apply(setUsers, evt, row));
      const unsubS = await subscribeTable('schedules', (evt, row) => apply(setSchedules, evt, row));
      const unsubA = await subscribeTable('attendance', (evt, row) => apply(setAttendanceRecords, evt, row));
      const unsubC = await subscribeTable('course_coverage', (evt, row) => apply(setCourseCoverage, evt, row));
      const unsubCo = await subscribeTable('complaints', (evt, row) => apply(setComplaints, evt, row));
      const unsubSG = await subscribeTable('skill_gap_training', (evt, row) => apply(setSkillGapTraining, evt, row));
      const unsubCoopFollowups = await subscribeTable('coop_followups', (evt, row) => apply(setCoopFollowups, evt, row));
      const unsubExam = await subscribeTable('exam_approvals', (evt, row) => apply(setExamApprovals, evt, row));

      if (!active) {
        unsubT && unsubT();
        unsubN && unsubN();
        unsubU && unsubU();
        unsubS && unsubS();
        unsubA && unsubA();
        unsubC && unsubC();
        unsubCo && unsubCo();
        unsubSG && unsubSG();
        unsubCoopFollowups && unsubCoopFollowups();
        unsubExam && unsubExam();
        return;
      }
      cleanups.push(unsubT, unsubN, unsubU, unsubS, unsubA, unsubC, unsubCo, unsubSG, unsubCoopFollowups, unsubExam);
    })();
    return () => { active = false; cleanups.forEach((c) => c && c()); };
  }, []);

  // ---- Derived: schedule conflicts -----------------------------------------
  const conflicts = useMemo(() => {
    const out = [];
    for (let i = 0; i < schedules.length; i++) {
      for (let j = i + 1; j < schedules.length; j++) {
        const a = schedules[i];
        const b = schedules[j];
        if (a.roomId === b.roomId && a.scheduleTime1 && a.scheduleTime1 === b.scheduleTime1) {
          out.push({ type: 'Room', a: a.id, b: b.id, detail: `${roomName(a.roomId)} double-booked at ${a.scheduleTime1}` });
        } else if (a.trainerId === b.trainerId && a.scheduleTime1 && a.scheduleTime1 === b.scheduleTime1) {
          out.push({ type: 'Trainer', a: a.id, b: b.id, detail: `${trainerName(a.trainerId)} clash at ${a.scheduleTime1}` });
        }
      }
    }
    return out;
  }, [schedules, roomName, trainerName]);

  // ---- Derived: trainer load report ----------------------------------------
  const trainerLoad = useMemo(() => {
    return trainers.map((t) => {
      const assigned = schedules.filter((s) => s.trainerId === t.id);
      const totalCredit = assigned.reduce((sum, s) => sum + (courseById(s.courseId)?.creditHours || 0), 0);
      return {
        trainerId: t.id,
        name: t.name,
        department: deptName(t.departmentId),
        employmentType: t.employmentType,
        courses: assigned.length,
        creditHours: totalCredit,
        invigilationDays: Math.max(1, Math.round(totalCredit / 4)),
      };
    }).sort((a, b) => b.creditHours - a.creditHours);
  }, [trainers, schedules, courseById, deptName]);

  // ---- Derived: 360 evaluation ---------------------------------------------
  const evaluation360 = useMemo(() => {
    return trainerEvaluations.map((e) => {
      const weighted =
        e.trainee * EVAL_WEIGHTS.trainee +
        e.peer * EVAL_WEIGHTS.peer +
        e.self * EVAL_WEIGHTS.self +
        e.department * EVAL_WEIGHTS.department;
      return { ...e, name: trainerName(e.trainerId), weighted: Math.round(weighted * 10) / 10 };
    }).sort((a, b) => b.weighted - a.weighted);
  }, [trainerEvaluations, trainerName]);

  // ---- Derived: top-level KPIs + submissions -------------------------------
  const kpis = useMemo(() => ({
    qualityAlerts: conflicts.length + complaints.filter((c) => c.status === 'Open').length,
    activeTrainers: trainers.filter((t) => t.presentStatus !== 'Released').length,
    totalTrainees: trainees.length,
    totalUsers: users.length,
  }), [conflicts.length, complaints, trainers, trainees.length, users.length]);

  const submissions = useMemo(() => ([
    { key: 'attendance', label: 'Attendance', count: attendanceRecords.length },
    { key: 'coverage', label: 'Course Coverage', count: courseCoverage.length },
    { key: 'assessment', label: 'Assessment Plans', count: examApprovals.length },
    { key: 'coop', label: 'Coop Reports', count: coopFollowups.length },
    { key: 'skillgap', label: 'Skill Gap', count: skillGapTraining.length },
    { key: 'coc', label: 'COC Registered', count: cocRegistrations.length },
    { key: 'schedules', label: 'Schedules', count: schedules.length },
    { key: 'results', label: 'Results', count: assessmentResults.length },
  ]), [attendanceRecords.length, courseCoverage.length, examApprovals.length, coopFollowups.length, skillGapTraining.length, cocRegistrations.length, schedules.length, assessmentResults.length]);

  // ---- Derived: per-trainer dashboard profiles -----------------------------
  const trainerStats = useMemo(() => {
    return trainers.map((t) => {
      const assigned = schedules.filter((s) => s.trainerId === t.id);
      const creditHours = assigned.reduce((sum, s) => sum + (courseById(s.courseId)?.creditHours || 0), 0);
      const att = attendanceRecords.filter((a) => a.trainerId === t.id);
      const presentSum = att.reduce((s, a) => s + (a.present ?? 0), 0);
      const totalSum = att.reduce((s, a) => s + (a.total ?? 0), 0);
      const cov = courseCoverage.filter((c) => c.trainerId === t.id);
      const coveredLos = cov.reduce((s, c) => s + c.coveredLos, 0);
      const totalLos = cov.reduce((s, c) => s + c.totalLos, 0);
      const exams = examApprovals.filter((e) => e.trainerId === t.id);
      const evalRow = evaluation360.find((e) => e.trainerId === t.id);
      return {
        ...t,
        department: deptName(t.departmentId),
        courses: assigned.length,
        creditHours,
        attendanceRate: totalSum ? Math.round((presentSum / totalSum) * 100) : 0,
        attendanceSessions: att.length,
        coverageRate: totalLos ? Math.round((coveredLos / totalLos) * 100) : 0,
        coveredLos,
        totalLos,
        examsPending: exams.filter((e) => e.status === 'Pending' || e.status === 'Draft').length,
        examsTotal: exams.length,
        evalScore: evalRow ? evalRow.weighted : null,
      };
    });
  }, [trainers, schedules, courseById, attendanceRecords, courseCoverage, examApprovals, evaluation360, deptName]);

  // ---- Derived: monthly activity report ------------------------------------
  const monthlyActivity = useMemo(() => {
    const cocByDept = departments.map((d) => ({
      department: d.name,
      count: cocRegistrations.filter((c) => c.departmentId === d.id).length,
    })).filter((x) => x.count > 0);
    return {
      activeTrainers: kpis.activeTrainers,
      totalSubmissions: submissions.reduce((s, x) => s + x.count, 0),
      classesScheduled: schedules.length,
      cocByDept,
    };
  }, [departments, cocRegistrations, kpis.activeTrainers, submissions, schedules.length]);

  const value = {
    meta: { academicYear: ACADEMIC_YEAR, semester: SEMESTER, dataSourceLabel, isLive: LIVE, dataReady },
    departments, centers, rooms, courses, trainers,
    users, trainees, schedules, examApprovals, complaints, webinars,
    attendanceRecords, courseCoverage, coopFollowups, skillGapTraining,
    assessmentResults, cocRegistrations, trainerEvaluations,
    deptName, centerName, roomName, trainerName, trainerByUserId, courseTitle, courseById, scheduleById,
    addTrainee, updateTrainee, deleteTrainee, deleteTraineesBulk,
    addTrainer, updateTrainer, deleteTrainer, deleteTrainersBulk,
    addSchedule, deleteSchedule,
    setExamStatus, setComplaintStatus,
    submitAttendance, submitCoverage, submitCoop, submitSkillGap, submitExamPlan,
    notifications, notify, markNotificationsRead,
    auditLog, logAudit, auditFor, listAllAudits, updateUserPassword,
    currentUser, setCurrentUser,
    conflicts, trainerLoad, evaluation360, kpis, submissions, monthlyActivity, trainerStats,
    today: TODAY,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
