import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Filter, 
  UserPlus, 
  Check, 
  X, 
  Edit3,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

const StudentManagement = ({ searchTerm }) => {
  const [students, setStudents] = useState([
    { id: 'ADM-2024-001', name: 'Almaz Kassa', email: 'almaz.kassa@admas.edu.et', department: 'Computer Science', gpa: '3.85', status: 'Active', enrolledYear: '2024' },
    { id: 'ADM-2024-042', name: 'Yared Tilahun', email: 'yared.tilahun@admas.edu.et', department: 'Software Engineering', gpa: '3.62', status: 'Active', enrolledYear: '2024' },
    { id: 'ADM-2025-015', name: 'Selamawit Daniel', email: 'selamawit.daniel@admas.edu.et', department: 'Business Administration', gpa: '3.91', status: 'Active', enrolledYear: '2025' },
    { id: 'ADM-2023-098', name: 'Kibrom Tekle', email: 'kibrom.tekle@admas.edu.et', department: 'Electrical Engineering', gpa: '2.95', status: 'Suspended', enrolledYear: '2023' },
    { id: 'ADM-2023-005', name: 'Nardos Lemma', email: 'nardos.lemma@admas.edu.et', department: 'Information Systems', gpa: '3.40', status: 'Graduated', enrolledYear: '2023' },
    { id: 'ADM-2025-077', name: 'Tariku Bekele', email: 'tariku.bekele@admas.edu.et', department: 'Computer Science', gpa: '3.21', status: 'Active', enrolledYear: '2025' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Form states for creating student
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newGpa, setNewGpa] = useState('');
  const [newStatus, setNewStatus] = useState('Active');

  // Filter options
  const departments = ['All', 'Computer Science', 'Software Engineering', 'Business Administration', 'Electrical Engineering', 'Information Systems'];
  const statuses = ['All', 'Active', 'Suspended', 'Graduated'];

  // Handle adding student
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newName || !newEmail || !newGpa) return;

    const currentYear = new Date().getFullYear();
    const newId = `ADM-${currentYear}-${Math.floor(100 + Math.random() * 900)}`;

    const newStudent = {
      id: newId,
      name: newName,
      email: newEmail,
      department: newDept,
      gpa: parseFloat(newGpa).toFixed(2),
      status: newStatus,
      enrolledYear: currentYear.toString()
    };

    setStudents([newStudent, ...students]);
    setShowModal(false);

    // Reset fields
    setNewName('');
    setNewEmail('');
    setNewDept('Computer Science');
    setNewGpa('');
    setNewStatus('Active');
  };

  // Handle deleting student
  const handleDeleteStudent = (id) => {
    if (window.confirm("Are you sure you want to remove this student record?")) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  // Filtered students computation
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDept = filterDept === 'All' || student.department === filterDept;
      const matchesStatus = filterStatus === 'All' || student.status === filterStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [students, searchTerm, filterDept, filterStatus]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="badge badge-success">Active</span>;
      case 'Suspended':
        return <span className="badge badge-danger">Suspended</span>;
      default:
        return <span className="badge badge-warning">Graduated</span>;
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top action metrics bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ padding: '12px 20px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-secondary))', display: 'block' }}>Total Records</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'Outfit' }}>{students.length}</span>
          </div>
          <div style={{ padding: '12px 20px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-secondary))', display: 'block' }}>Average GPA</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'Outfit', color: 'hsl(var(--accent-gold))', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {(students.reduce((acc, curr) => acc + parseFloat(curr.gpa), 0) / students.length).toFixed(2)}
              <TrendingUp size={14} color="hsl(var(--accent-gold))" />
            </span>
          </div>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary"
          style={{ width: 'auto', padding: '12px 20px', borderRadius: '10px' }}
        >
          <UserPlus size={16} />
          Onboard Student
        </button>
      </div>

      {/* Filters bar */}
      <GlassCard hoverEffect={false} style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
            <Filter size={14} color="hsl(var(--accent-cyan))" /> Filters:
          </span>

          {/* Department Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted))' }}>Department</span>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="input-field"
              style={{ padding: '8px 12px', width: '180px', height: '36px', fontSize: '0.8rem', borderRadius: '8px' }}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted))' }}>Status</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
              style={{ padding: '8px 12px', width: '130px', height: '36px', fontSize: '0.8rem', borderRadius: '8px' }}
            >
              {statuses.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Export utility */}
          <button 
            style={{ 
              marginLeft: 'auto', 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '8px', 
              padding: '8px 12px', 
              color: 'hsl(var(--text-secondary))', 
              fontSize: '0.8rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
          >
            <FileSpreadsheet size={14} color="hsl(var(--accent-teal))" /> Export Sheet
          </button>
        </div>
      </GlassCard>

      {/* Student Table */}
      <GlassCard hoverEffect={false} style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '16px 20px', color: 'hsl(var(--text-secondary))', fontWeight: '600' }}>Student ID</th>
                <th style={{ padding: '16px 20px', color: 'hsl(var(--text-secondary))', fontWeight: '600' }}>Full Name</th>
                <th style={{ padding: '16px 20px', color: 'hsl(var(--text-secondary))', fontWeight: '600' }}>Email Address</th>
                <th style={{ padding: '16px 20px', color: 'hsl(var(--text-secondary))', fontWeight: '600' }}>Department</th>
                <th style={{ padding: '16px 20px', color: 'hsl(var(--text-secondary))', fontWeight: '600', textAlign: 'center' }}>GPA</th>
                <th style={{ padding: '16px 20px', color: 'hsl(var(--text-secondary))', fontWeight: '600', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '16px 20px', color: 'hsl(var(--text-secondary))', fontWeight: '600', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', transition: 'all 0.2s' }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: 'hsl(var(--accent-cyan))', fontFamily: 'Outfit' }}>{student.id}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{student.name}</td>
                    <td style={{ padding: '16px 20px', color: 'hsl(var(--text-secondary))' }}>{student.email}</td>
                    <td style={{ padding: '16px 20px', color: 'hsl(var(--text-secondary))' }}>{student.department}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '700', color: parseFloat(student.gpa) >= 3.5 ? 'hsl(var(--accent-gold))' : 'hsl(var(--text-primary))' }}>
                      {student.gpa}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>{getStatusBadge(student.status)}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-muted))' }}
                          className="action-btn-hover"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(student.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f43f5e' }}
                          className="action-btn-hover-delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                    No student records found matching the active criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Onboard Student Modal Popup */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}
        >
          <div className="animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '8px' }}>
            <GlassCard hoverEffect={false} style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserPlus size={18} color="hsl(var(--accent-cyan))" /> Onboard New Student
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-muted))' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Full Name */}
                <div className="input-group">
                  <label className="input-label" htmlFor="newName">Full Name</label>
                  <input
                    id="newName"
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Samuel Kebede"
                    className="input-field"
                  />
                </div>

                {/* Email */}
                <div className="input-group">
                  <label className="input-label" htmlFor="newEmail">Email Address</label>
                  <input
                    id="newEmail"
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. samuel.k@admas.edu.et"
                    className="input-field"
                  />
                </div>

                {/* Grid for GPA and Department */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label" htmlFor="newDept">Department</label>
                    <select
                      id="newDept"
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      className="input-field"
                    >
                      {departments.filter(d => d !== 'All').map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="newGpa">GPA</label>
                    <input
                      id="newGpa"
                      type="number"
                      step="0.01"
                      min="0.00"
                      max="4.00"
                      required
                      value={newGpa}
                      onChange={(e) => setNewGpa(e.target.value)}
                      placeholder="e.g. 3.75"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Status Selection */}
                <div className="input-group">
                  <label className="input-label" htmlFor="newStatus">Enrollment Status</label>
                  <select
                    id="newStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="input-field"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '16px' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '12px' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    style={{ flex: 1, padding: '12px' }}
                  >
                    Save Record
                  </button>
                </div>

              </form>
            </GlassCard>
          </div>
        </div>
      )}

      <style>{`
        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.01) !important;
        }
        .action-btn-hover:hover {
          color: hsl(var(--accent-cyan)) !important;
        }
        .action-btn-hover-delete:hover {
          color: #f43f5e !important;
          filter: drop-shadow(0 0 5px rgba(244,63,94,0.3));
        }
      `}</style>
    </div>
  );
};

export default StudentManagement;
