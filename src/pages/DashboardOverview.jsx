import React from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  BellRing,
  ArrowRight
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { EnrollmentChart, DistributionChart } from '../components/CustomChart';

const DashboardOverview = ({ setActiveTab }) => {
  // Mock Stats Data
  const stats = [
    { 
      label: "Enrolled Students", 
      value: "14,820", 
      change: "+4.2%", 
      isPositive: true, 
      icon: GraduationCap, 
      color: "hsl(var(--accent-teal))",
      glow: "rgba(20, 184, 166, 0.15)"
    },
    { 
      label: "Active Faculty", 
      value: "580", 
      change: "+1.8%", 
      isPositive: true, 
      icon: Users, 
      color: "hsl(var(--accent-cyan))",
      glow: "rgba(0, 229, 255, 0.15)"
    },
    { 
      label: "Active Courses", 
      value: "320", 
      change: "+8.5%", 
      isPositive: true, 
      icon: BookOpen, 
      color: "hsl(var(--accent-emerald))",
      glow: "rgba(16, 185, 129, 0.15)"
    },
    { 
      label: "Departments", 
      value: "24", 
      change: "0%", 
      isPositive: true, 
      icon: Layers, 
      color: "hsl(var(--accent-gold))",
      glow: "rgba(234, 179, 8, 0.15)"
    }
  ];

  // Chart Mock Data
  const enrollmentTrend = [
    { label: '2022 A', value: 8200 },
    { label: '2022 B', value: 9100 },
    { label: '2023 A', value: 10400 },
    { label: '2023 B', value: 11200 },
    { label: '2024 A', value: 12800 },
    { label: '2024 B', value: 13500 },
    { label: '2025 A', value: 14820 }
  ];

  const facultyDistribution = [
    { label: 'Comp. Sci', value: 124 },
    { label: 'Eng. Tech', value: 98 },
    { label: 'Business', value: 112 },
    { label: 'Medicine', value: 86 },
    { label: 'Social Sci', value: 75 },
    { label: 'Natural Sci', value: 85 }
  ];

  const activities = [
    { id: 1, action: "Academic calendar updated", details: "Fall Semester 2026 registration dates adjusted.", time: "10 mins ago", type: "system" },
    { id: 2, action: "New faculty member onboarded", details: "Dr. Biruk Tadesse joined Department of Computer Science.", time: "1 hour ago", type: "faculty" },
    { id: 3, action: "Curriculum expansion approved", details: "Artificial Intelligence BSc program curriculum review completed.", time: "3 hours ago", type: "curriculum" },
    { id: 4, action: "Security patches applied", details: "LMS server maintenance and authorization patches deployed.", time: "1 day ago", type: "system" }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={idx} hoverEffect={true}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', fontWeight: '500' }}>
                  {stat.label}
                </span>
                <div 
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: stat.glow,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color
                  }}
                >
                  <Icon size={18} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'Outfit' }}>
                  {stat.value}
                </span>
                <span 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    color: stat.isPositive ? 'hsl(var(--accent-emerald))' : 'hsl(var(--accent-rose))',
                    padding: '2px 6px',
                    background: stat.isPositive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                    borderRadius: '6px'
                  }}
                >
                  {stat.isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {stat.change}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Analytics Visualizations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        
        {/* Enrollment Trend Chart */}
        <GlassCard hoverEffect={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Enrollment Trends</h3>
              <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Student headcount per academic semester</p>
            </div>
            <div className="badge badge-info" style={{ gap: '4px' }}>
              <TrendingUp size={12} /> Active Growth
            </div>
          </div>
          <EnrollmentChart data={enrollmentTrend} />
        </GlassCard>

        {/* Faculty Distribution Chart */}
        <GlassCard hoverEffect={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Faculty Allocation</h3>
              <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Number of active instructors by department</p>
            </div>
            <button 
              onClick={() => setActiveTab('faculty')}
              style={{
                background: 'none',
                border: 'none',
                color: 'hsl(var(--accent-cyan))',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Manage Staff <ArrowRight size={12} />
            </button>
          </div>
          <DistributionChart data={facultyDistribution} />
        </GlassCard>

      </div>

      {/* Announcements and Recent Feed Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Recent Activities list */}
        <GlassCard hoverEffect={false}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>System Activity Stream</h3>
            <span style={{ fontSize: '0.72rem', color: 'hsl(var(--accent-cyan))', fontWeight: '600' }}>Live Logs</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activities.map((act) => (
              <div 
                key={act.id} 
                style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                  alignItems: 'flex-start'
                }}
              >
                <div 
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: act.type === 'system' ? 'hsl(var(--accent-cyan))' : act.type === 'faculty' ? 'hsl(var(--accent-teal))' : 'hsl(var(--accent-gold))',
                    marginTop: '6px',
                    boxShadow: `0 0 8px ${act.type === 'system' ? 'hsl(var(--accent-cyan))' : act.type === 'faculty' ? 'hsl(var(--accent-teal))' : 'hsl(var(--accent-gold))'}`
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: 'hsl(var(--text-primary))' }}>
                    {act.action}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-secondary))', marginTop: '2px' }}>
                    {act.details}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', display: 'block', marginTop: '4px' }}>
                    {act.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Dynamic Announcements Dashboard Widget */}
        <GlassCard hoverEffect={false} style={{ background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(0, 229, 255, 0.05) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BellRing size={18} color="hsl(var(--accent-gold))" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>University Announcements</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div 
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)'
              }}
            >
              <span className="badge badge-warning" style={{ marginBottom: '8px' }}>Important</span>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '4px' }}>
                Term Exam Schedules Released
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', lineHeight: 1.4 }}>
                The comprehensive scheduling framework for the final examinations of Second Semester 2026 is published on the public board. Faculty heads are requested to coordinate invigilator allocations.
              </p>
            </div>

            <div 
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)'
              }}
            >
              <span className="badge badge-info" style={{ marginBottom: '8px' }}>General</span>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '4px' }}>
                29th Graduation Ceremony Preparations
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', lineHeight: 1.4 }}>
                Graduand registration forms have opened. Students are required to verify their academic credits clears at the Registrar Office by the end of next month.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

    </div>
  );
};

export default DashboardOverview;
