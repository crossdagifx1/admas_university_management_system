import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { NAV, VIEW_TITLES, TRAINER_NAV, TRAINER_VIEW_TITLES } from './config/nav';
import { useData } from './context/DataContext';

import DashboardOverview from './pages/DashboardOverview';
import ManageSchedules from './pages/scheduling/ManageSchedules';
import TrainerLoadReport from './pages/scheduling/TrainerLoadReport';
import ManageTrainers from './pages/users/ManageTrainers';
import ManageTrainees from './pages/users/ManageTrainees';
import TrainerDashboard from './pages/TrainerDashboard';
import AttendanceReport from './pages/reports/AttendanceReport';
import CourseCoverageReport from './pages/reports/CourseCoverageReport';
import CoopTrainingReport from './pages/reports/CoopTrainingReport';
import SkillGapReport from './pages/reports/SkillGapReport';
import MonthlyActivityReport from './pages/reports/MonthlyActivityReport';
import ExamApprovals from './pages/assessment/ExamApprovals';
import AssessmentResults from './pages/assessment/AssessmentResults';
import CocRegistrations from './pages/assessment/CocRegistrations';
import TrainerOfMonth from './pages/evaluation/TrainerOfMonth';
import Evaluation360 from './pages/evaluation/Evaluation360';
import AuditLogs from './pages/AuditLogs';
import TrainerSettings from './pages/trainer/TrainerSettings';
import Complaints from './pages/complaints/Complaints';
import SettingsPage from './pages/SettingsPage';

// Trainer portal
import TrainerHome from './pages/trainer/TrainerHome';
import MySchedule from './pages/trainer/MySchedule';
import SubmitAttendance from './pages/trainer/SubmitAttendance';
import SubmitCoverage from './pages/trainer/SubmitCoverage';
import SubmitCoop from './pages/trainer/SubmitCoop';
import SubmitSkillGap from './pages/trainer/SubmitSkillGap';
import SubmitExam from './pages/trainer/SubmitExam';

function App() {
  const { setCurrentUser } = useData();
  const [user, setUser] = useState(null);

  const isTrainer = user?.portal === 'trainer';
  const [activeView, setActiveView] = useState('dashboard');

  const filteredNav = React.useMemo(() => {
    if (isTrainer) return TRAINER_NAV;
    if (user?.role === 'System Administrator') return NAV;
    return NAV.map((item) => {
      if (item.type === 'group' && item.id === 'users') {
        return {
          ...item,
          children: item.children.filter((c) => c.view !== 'users/trainers'),
        };
      }
      return item;
    });
  }, [isTrainer, user]);

  const viewToRender = React.useMemo(() => {
    if (!isTrainer && activeView === 'users/trainers' && user?.role !== 'System Administrator') {
      return 'dashboard';
    }
    return activeView;
  }, [isTrainer, activeView, user]);

  const handleLogin = (u) => {
    setUser(u);
    setCurrentUser(u);
    setActiveView(u.portal === 'trainer' ? 'trainer/home' : 'dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentUser(null);
    setActiveView('dashboard');
  };

  if (!user) return <LoginPage onLogin={handleLogin} />;

  const adminRegistry = {
    dashboard: <DashboardOverview setActiveView={setActiveView} />,
    'scheduling/manage': <ManageSchedules />,
    'scheduling/trainer-load': <TrainerLoadReport />,
    'users/trainers': <ManageTrainers />,
    'users/trainees': <ManageTrainees />,
    'trainer-dashboard': <TrainerDashboard setActiveView={setActiveView} />,
    'reports/attendance': <AttendanceReport />,
    'reports/coverage': <CourseCoverageReport />,
    'reports/coop': <CoopTrainingReport />,
    'reports/skillgap': <SkillGapReport />,
    'reports/monthly': <MonthlyActivityReport />,
    'assessment/exams': <ExamApprovals />,
    'assessment/results': <AssessmentResults />,
    'assessment/coc': <CocRegistrations />,
    'evaluation/top': <TrainerOfMonth />,
    'evaluation/360': <Evaluation360 />,
    'audit-logs': <AuditLogs />,
    complaints: <Complaints />,
    settings: <SettingsPage />,
  };

  const trainerRegistry = {
    'trainer/home': <TrainerHome user={user} setActiveView={setActiveView} />,
    'trainer/schedule': <MySchedule user={user} />,
    'trainer/attendance': <SubmitAttendance user={user} />,
    'trainer/coverage': <SubmitCoverage user={user} />,
    'trainer/coop': <SubmitCoop user={user} />,
    'trainer/skillgap': <SubmitSkillGap user={user} />,
    'trainer/exam': <SubmitExam user={user} />,
    'trainer/settings': <TrainerSettings user={user} />,
  };

  const registry = isTrainer ? trainerRegistry : adminRegistry;
  const titles = isTrainer ? TRAINER_VIEW_TITLES : VIEW_TITLES;
  const fallbackView = isTrainer ? 'trainer/home' : 'dashboard';
  const [title, subtitle] = titles[viewToRender] || titles[fallbackView];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'hsl(var(--bg-obsidian))', position: 'relative', gap: '24px', paddingRight: '32px' }}>
      <div className="glow-bg">
        <div className="glow-circle glow-1" style={{ opacity: 0.1 }}></div>
        <div className="glow-circle glow-2" style={{ opacity: 0.1 }}></div>
        <div className="glow-circle glow-3"></div>
      </div>

      <Sidebar
        activeView={viewToRender}
        setActiveView={setActiveView}
        onLogout={handleLogout}
        user={user}
        nav={filteredNav}
        portalLabel={isTrainer ? 'Trainer Portal' : 'TVET Management'}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 1, minWidth: 0, paddingBottom: '32px' }}>
        <Header title={title} subtitle={subtitle} user={user} />
        <main style={{ flex: 1 }}>{registry[viewToRender] || registry[fallbackView]}</main>
      </div>
    </div>
  );
}

export default App;
