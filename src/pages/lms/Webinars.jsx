import React from 'react';
import { Video, Users, Clock, Radio } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import GlassCard from '../../components/GlassCard';
import { Badge } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';

const STATUS_TONE = { Live: 'danger', Scheduled: 'info', Ended: 'warning' };

const Webinars = () => {
  const { webinars } = useData();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={Video} title="Manage Live Webinars" subtitle={`${webinars.length} webinars · Lifelong Learning hub`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {webinars.map((w) => (
          <GlassCard key={w.id} hoverEffect>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(var(--accent-cyan))' }}>
                {w.status === 'Live' ? <Radio size={20} /> : <Video size={20} />}
              </div>
              <Badge tone={STATUS_TONE[w.status]}>{w.status}</Badge>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '6px' }}>{w.title}</h3>
            <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', marginBottom: '14px' }}>Hosted by {w.host}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px', marginBottom: '14px' }}>
              <Row icon={Clock} text={`${w.startTime} · ${w.durationMin} min`} />
              <Row icon={Users} text={`${w.registrants} registered`} />
            </div>

            <button
              className={w.status === 'Live' ? 'btn-primary' : 'btn-secondary'}
              style={{ width: '100%', padding: '10px', fontSize: '0.84rem' }}
              disabled={w.status === 'Ended'}
              onClick={() => window.open(w.joinUrl, '_blank', 'noopener')}
            >
              {w.status === 'Live' ? 'Join / Manage Session' : w.status === 'Scheduled' ? 'Start Webinar' : 'View Recording'}
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

const Row = ({ icon: Icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>
    <Icon size={14} color="hsl(var(--text-muted))" /> {text}
  </div>
);

export default Webinars;
