Here is a detailed breakdown of the features and functionalities visible in the "ADMAS University TVET Management System (ATMS)" based on the screen recording provided:

1. Authentication & System Access
User Login Portal: A secure login screen requiring a username and password to access the system. The video demonstrates an admin login.

2. Administrator Dashboard
The primary landing page acts as a central hub for system monitoring, featuring a comprehensive top navigation bar and several key performance indicator (KPI) cards:

Top Navigation Menu: Includes dropdown menus for Dashboard, TVET Scheduling, TVET Reports, TVET Assessment, Manage Complaints, Trainers Evaluation, Lifelong Learning, and System Administrator.

High-Level KPI Counters: Displays real-time metrics for Quality Alerts, Active Trainers, Total Trainees, and Total Users.

TVET Submissions Overview: Quick-access widgets showing submission counts for various categories, including Attendance, Session Plans, Course Coverage, Assessment Plans, Practical Projects, Coop Reports, Skill Gap, Female Support, and Grades Imported.

1. TVET Scheduling Module
This section contains robust tools for managing classes, trainers, and facilities:

Manage Schedules (Spreadsheet View): A tabular interface to view, filter, and edit existing class schedules. It includes columns for Year, Section, Course Title, Credit Hours, Schedule (Day/Time), Room, Center, Trainer Name, and Start/End dates.

Advanced Schedule Entry: A form to manually create new class schedules using dropdown selections for various parameters to prevent conflicts. It includes options to save to the database or export rows.

Interactive Classroom Schedule Grid: A visual, calendar-style scheduling tool that maps out classes by room and time block. It features an automated conflict detection system (e.g., displaying "Action Required: 15 Conflicts Detected").

Printable Trainer Load Report: A comprehensive report calculating the total credit hours assigned to each trainer across different programs and years, including an estimate for invigilation days.

Course Coordinator Report: A tool to designate and view course coordinators based on the trainer with the most credit hours for a specific course.

Printable Schedule Report: Generates a clean, formatted class schedule based on selected criteria (Year/Program and Section), ready for printing or exporting.

1. User & Trainee Management
Manage Users: A directory to view, edit, or delete system users, displaying their Full Name, Username, Role & Type, and Contact information.

Manage Trainees: A detailed database of students. It allows filtering by "Year" and "Section" and displays ID Number, Sex, Level, Year, Section, and provides action buttons for editing student profiles.

1. TVET Reports Module
A suite of reporting tools tracking academic progress and system compliance:

View Attendance Submissions: A log of submitted attendance records with options to view attached photos or delete entries.

View Course Coverage Submissions: Tracks the progress of courses, showing total Learning Outcomes (LOs), covered LOs, and specific coverage text notes submitted by trainers.

View Cooperative Training Follow-ups: Logs details of visits to trainees at their cooperative training organizations.

View Skill Gap Training Reports: Details specific skill gap training sessions, including learning outcomes targeted, duration, and attached photographic evidence.

Overall Monthly Activity Report: A generated summary for a specific month/year, compiling data on active trainers, submissions, COC (Center of Competence) registration summaries by department, and classes scheduled.

1. TVET Assessment Module
Exam Approvals: A review queue for "Draft/Pending Exams," showing theoretical and practical assessment plans submitted by trainers, with options to "Approve/Publish" or "View" the exam details.

Institutional Assessment Results: A published log of assessment results categorized by Title, Level, Assigned Section, and Date.

COC Registration Submissions: A ledger of students registered for their Center of Competence exams, showing their current level, contact info, and amount paid.

1. Trainers Evaluation
Trainer of the Month Calculator: A tool to calculate and determine the top-performing trainer based on an "Activity Score," "Workload Index," and "Rating."

360° Trainer Evaluation Report: A comprehensive performance review system that aggregates scores from Trainee Evaluation (60% weight), Peer Evaluation (5%), Self Evaluation (5%), and Department Evaluation (30%) to generate a final weighted score.

1. Lifelong Learning (LMS Features)
Manage Live Webinars: A dashboard to schedule and start live online webinar sessions.

System Error Handling: At 04:14, navigating to "Manage MOOC Courses" results in a PHP "Fatal error: Uncaught PDOException," indicating a missing database column (c.created_by) which breaks the page load.

Lifelong Learning Hub: A student/user-facing interface with tabs for "Live Webinars" (showing registered webinars and links), "Online Courses (MOOC)," and "My Learning."
