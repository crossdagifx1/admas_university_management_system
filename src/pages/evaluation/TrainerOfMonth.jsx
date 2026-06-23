import React, { useMemo } from 'react';
import { Trophy, Star } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import GlassCard from '../../components/GlassCard';
import DataTable from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Toolbar';
import { useData } from '../../context/DataContext';

const TrainerOfMonth = () => {
  const { trainers, trainerLoad, evaluation360, meta } = useData();

  const ranking = useMemo(() => {
    const maxCredit = Math.max(...trainerLoad.map((t) => t.creditHours), 1);
    return trainers.map((t) => {
      const load = trainerLoad.find((l) => l.trainerId === t.id);
      const evalRow = evaluation360.find((e) => e.trainerId === t.id);
      const activityScore = evalRow ? evalRow.weighted : 70;          // 0-100
      const workloadIndex = Math.round(((load?.creditHours || 0) / maxCredit) * 100); // 0-100
      const rating = t.rating;                                         // 0-5
      const composite = Math.round((activityScore * 0.5 + workloadIndex * 0.2 + (rating / 5) * 100 * 0.3) * 10) / 10;
      return { id: t.id, name: t.name, activityScore, workloadIndex, rating, composite };
    }).sort((a, b) => b.composite - a.composite);
  }, [trainers, trainerLoad, evaluation360]);

  const winner = ranking[0];

  const columns = [
    { key: 'rank', label: '#', align: 'center', render: (r) => <span style={{ fontWeight: '700', fontFamily: 'Outfit' }}>{ranking.indexOf(r) + 1}</span> },
    { key: 'name', label: 'Trainer', render: (r) => <span style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{r.name}</span> },
    { key: 'activityScore', label: 'Activity Score', align: 'center', render: (r) => `${r.activityScore}` },
    { key: 'workloadIndex', label: 'Workload Index', align: 'center', render: (r) => `${r.workloadIndex}` },
    { key: 'rating', label: 'Rating', align: 'center', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'hsl(var(--accent-gold))', fontWeight: '700' }}><Star size={12} fill="hsl(var(--accent-gold))" />{r.rating}</span> },
    { key: 'composite', label: 'Composite', align: 'center', render: (r) => <Badge tone={r === winner ? 'success' : 'info'}>{r.composite}</Badge> },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader icon={Trophy} title="Trainer of the Month" subtitle={`${meta.semester} · composite of activity, workload & rating`} accent="hsl(var(--accent-gold))" />

      {winner && (
        <GlassCard hoverEffect={false} style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.1) 0%, rgba(0,229,255,0.05) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(234,179,8,0.35)' }}>
              <Trophy size={30} color="#090a0f" />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'hsl(var(--accent-gold))', fontWeight: '700' }}>Top Performer</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>{winner.name}</h2>
              <p style={{ fontSize: '0.84rem', color: 'hsl(var(--text-secondary))' }}>Activity {winner.activityScore} · Workload {winner.workloadIndex} · Rating {winner.rating}★</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="text-gradient-gold" style={{ fontSize: '2.6rem', fontWeight: '800', fontFamily: 'Outfit' }}>{winner.composite}</span>
              <p style={{ fontSize: '0.74rem', color: 'hsl(var(--text-muted))' }}>composite score</p>
            </div>
          </div>
        </GlassCard>
      )}

      <DataTable columns={columns} rows={ranking} />
    </div>
  );
};

export default TrainerOfMonth;
