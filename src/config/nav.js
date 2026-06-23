import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserCog,
  FileText,
  ClipboardCheck,
  Award,
  Video,
  MessageSquare,
  Settings,
  CalendarCheck,
  TrendingUp,
  Building2,
  GitBranch,
  FilePlus2,
  History,
} from 'lucide-react';

// Full module map for the System Administrator (sees everything).
// Each leaf has a `view` key that maps to a page in the App view registry.
export const NAV = [
  { type: 'item', view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    type: 'group',
    id: 'scheduling',
    label: 'TVET Scheduling',
    icon: CalendarDays,
    children: [
      { view: 'scheduling/manage', label: 'Manage Schedules' },
      { view: 'scheduling/trainer-load', label: 'Trainer Load Report' },
    ],
  },
  {
    type: 'group',
    id: 'users',
    label: 'Trainers & Trainees',
    icon: Users,
    children: [
      { view: 'users/trainers', label: 'Manage Trainers' },
      { view: 'users/trainees', label: 'Manage Trainees' },
    ],
  },
  { type: 'item', view: 'trainer-dashboard', label: 'Trainer Dashboard', icon: UserCog },
  {
    type: 'group',
    id: 'reports',
    label: 'TVET Reports',
    icon: FileText,
    children: [
      { view: 'reports/attendance', label: 'Attendance' },
      { view: 'reports/coverage', label: 'Course Coverage' },
      { view: 'reports/coop', label: 'Coop Training' },
      { view: 'reports/skillgap', label: 'Skill Gap Training' },
      { view: 'reports/monthly', label: 'Monthly Activity' },
    ],
  },
  {
    type: 'group',
    id: 'assessment',
    label: 'TVET Assessment',
    icon: ClipboardCheck,
    children: [
      { view: 'assessment/exams', label: 'Exam Approvals' },
      { view: 'assessment/results', label: 'Assessment Results' },
      { view: 'assessment/coc', label: 'COC Registrations' },
    ],
  },
  {
    type: 'group',
    id: 'evaluation',
    label: 'Trainers Evaluation',
    icon: Award,
    children: [
      { view: 'evaluation/top', label: 'Trainer of the Month' },
      { view: 'evaluation/360', label: '360° Evaluation' },
    ],
  },
  { type: 'item', view: 'audit-logs', label: 'Audit Logs', icon: History },
  { type: 'item', view: 'complaints', label: 'Manage Complaints', icon: MessageSquare },
  { type: 'item', view: 'settings', label: 'System Settings', icon: Settings },
];

// Human-readable titles for the header, keyed by view.
export const VIEW_TITLES = {
  dashboard: ['System Overview', 'Administrator command center'],
  'scheduling/manage': ['Manage Schedules', 'Class, trainer & room allocation'],
  'scheduling/trainer-load': ['Trainer Load Report', 'Credit hours & invigilation estimates'],
  'users/trainers': ['Manage Trainers', 'Trainer directory & assignments'],
  'users/trainees': ['Manage Trainees', 'Trainee directory & records'],
  'trainer-dashboard': ['Trainer Dashboard', 'Per-trainer workload & performance'],
  'reports/attendance': ['Attendance Submissions', 'Trainer-submitted attendance logs'],
  'reports/coverage': ['Course Coverage', 'Learning outcome progress'],
  'reports/coop': ['Cooperative Training', 'Workplace visit follow-ups'],
  'reports/skillgap': ['Skill Gap Training', 'Targeted skill sessions'],
  'reports/monthly': ['Monthly Activity Report', 'Institution-wide summary'],
  'assessment/exams': ['Exam Approvals', 'Review & publish assessment plans'],
  'assessment/results': ['Assessment Results', 'Published institutional results'],
  'assessment/coc': ['COC Registrations', 'Center of Competence ledger'],
  'evaluation/top': ['Trainer of the Month', 'Top performer calculation'],
  'evaluation/360': ['360° Trainer Evaluation', 'Weighted performance review'],
  'audit-logs': ['Audit Logs', 'Global system audit trail'],
  complaints: ['Manage Complaints', 'Issue tracking & resolution'],
  settings: ['System Settings', 'Institution configuration'],
};

// ---- Trainer portal -------------------------------------------------------
// Pages a logged-in Trainer sees. Submissions flow straight into the admin views.
export const TRAINER_NAV = [
  { type: 'item', view: 'trainer/home', label: 'My Dashboard', icon: LayoutDashboard },
  { type: 'item', view: 'trainer/schedule', label: 'My Schedule', icon: CalendarDays },
  { type: 'item', view: 'trainer/attendance', label: 'Submit Attendance', icon: CalendarCheck },
  { type: 'item', view: 'trainer/coverage', label: 'Course Coverage', icon: TrendingUp },
  { type: 'item', view: 'trainer/coop', label: 'Coop Training', icon: Building2 },
  { type: 'item', view: 'trainer/skillgap', label: 'Skill Gap Support', icon: GitBranch },
  { type: 'item', view: 'trainer/exam', label: 'Exam Posting', icon: FilePlus2 },
  { type: 'item', view: 'trainer/settings', label: 'Change Password', icon: Settings },
];

export const TRAINER_VIEW_TITLES = {
  'trainer/home': ['My Dashboard', 'Your teaching workload & submissions'],
  'trainer/schedule': ['My Schedule', 'Your assigned classes this semester'],
  'trainer/attendance': ['Submit Attendance', 'Upload monthly attendance with photo'],
  'trainer/coverage': ['Course Coverage', 'Report learning outcomes covered'],
  'trainer/coop': ['Coop Training', 'Log cooperative workplace follow-ups'],
  'trainer/skillgap': ['Skill Gap Support', 'Report students supported with photo evidence'],
  'trainer/exam': ['Exam Posting', 'Submit assessment plans for admin approval'],
  'trainer/settings': ['Change Password', 'Update your portal password'],
};
