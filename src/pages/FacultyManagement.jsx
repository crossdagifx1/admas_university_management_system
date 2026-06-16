import React, { useState, useMemo } from 'react';
import { Mail, Phone, Star, Sparkles, Filter, Plus, UserCheck, X } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const FacultyManagement = ({ searchTerm }) => {
  const [facultyList, setFacultyList] = useState([
    { id: 1, name: 'Dr. Yosef Kebede', role: 'Head of Department', department: 'Computer Science', email: 'yosef.k@admas.edu.et', phone: '+251-911-234567', status: 'Active', rating: 4.8, bio: 'PhD in Computer Architecture. 12+ years teaching experience.' },
    { id: 2, name: 'Dr. Biruk Tadesse', role: 'Assistant Professor', department: 'Computer Science', email: 'biruk.t@admas.edu.et', phone: '+251-911-789012', status: 'Active', rating: 4.7, bio: 'Machine learning practitioner and former research fellow.' },
    { id: 3, name: 'Martha Hailu', role: 'Lecturer', department: 'Software Engineering', email: 'martha.h@admas.edu.et', phone: '+251-912-345678', status: 'Active', rating: 4.5, bio: 'Specialist in Agile Methodologies and DevOps workflows.' },
    { id: 4, name: 'Abebe Bikila', role: 'Registrar Head', department: 'Administration', email: 'abebe.b@admas.edu.et', phone: '+251-910-111213', status: 'Active', rating: 4.9, bio: 'Directs registration protocols and institutional student records.' },
    { id: 5, name: 'Dr. Elizabeth Tesfaye', role: 'Senior Lecturer', department: 'Business Administration', email: 'elizabeth.t@admas.edu.et', phone: '+251-911-456789', status: 'On Leave', rating: 4.6, bio: 'Expert in Micro-Economics and corporate financial structures.' },
    { id: 6, name: 'Brook Assefa', role: 'Assistant Lecturer', department: 'Electrical Engineering', email: 'brook.a@admas.edu.et', phone: '+251-920-222333', status: 'Active', rating: 4.2, bio: 'Teaches digital signal processing and microprocessors laboratory.' }
  ]);

  const [activeDept, setActiveDept] = useState('All');
  const [showModal, setShowModal] = useState(false);

  // Form states for new faculty
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Lecturer');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBio, setNewBio] = useState('');

  const departments = ['All', 'Computer Science', 'Software Engineering', 'Business Administration', 'Electrical Engineering', 'Administration'];
  const roles = ['Head of Department', 'Professor', 'Assistant Professor', 'Senior Lecturer', 'Lecturer', 'Assistant Lecturer', 'Registrar Head'];

  // Toggle active / leave status
  const toggleStatus = (id) => {
    setFacultyList(facultyList.map(member => 
      member.id === id 
        ? { ...member, status: member.status === 'Active' ? 'On Leave' : 'Active' }
        : member
    ));
  };

  // Add new faculty member
  const handleAddFaculty = (e) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPhone) return;

    const newFaculty = {
      id: Date.now(),
      name: newName,
      role: newRole,
      department: newDept,
      email: newEmail,
      phone: newPhone,
      status: 'Active',
      rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)), // random starting rating
      bio: newBio || 'Faculty member of Admas University.'
    };

    setFacultyList([...facultyList, newFaculty]);
    setShowModal(false);

    // Reset
    setNewName('');
    setNewRole('Lecturer');
    setNewDept('Computer Science');
    setNewEmail('');
    setNewPhone('');
    setNewBio('');
  };

  // Filter computation
  const filteredFaculty = useMemo(() => {
    return facultyList.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDept = activeDept === 'All' || member.department === activeDept;
      
      return matchesSearch && matchesDept;
    });
  }, [facultyList, searchTerm, activeDept]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Action panel & Category tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        {/* Department Selection Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '75%' }}>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              style={{
                padding: '8px 16px',
                background: activeDept === dept ? 'rgba(0, 229, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: '1px solid',
                borderColor: activeDept === dept ? 'hsl(var(--accent-cyan))' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                color: activeDept === dept ? 'hsl(var(--accent-cyan))' : 'hsl(var(--text-secondary))',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.25s',
                whiteSpace: 'nowrap'
              }}
            >
              {dept}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary"
          style={{ width: 'auto', padding: '10px 18px', borderRadius: '10px', fontSize: '0.88rem' }}
        >
          <Plus size={16} />
          Register Faculty
        </button>
      </div>

      {/* Faculty Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredFaculty.length > 0 ? (
          filteredFaculty.map((faculty) => (
            <GlassCard key={faculty.id} hoverEffect={true} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Header profile & status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div 
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      color: 'hsl(var(--accent-cyan))',
                      fontSize: '1.1rem',
                      fontFamily: 'Outfit'
                    }}
                  >
                    {faculty.name.split(' ').pop().charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'hsl(var(--text-primary))' }}>
                      {faculty.name}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'hsl(var(--accent-teal))', fontWeight: '600', display: 'block', marginTop: '1px' }}>
                      {faculty.role}
                    </span>
                  </div>
                </div>

                {/* Rating Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)', padding: '4px 8px', borderRadius: '8px' }}>
                  <Star size={11} fill="hsl(var(--accent-gold))" color="hsl(var(--accent-gold))" />
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'hsl(var(--accent-gold))', fontFamily: 'Outfit' }}>{faculty.rating}</span>
                </div>
              </div>

              {/* Bio summary */}
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', lineHeight: 1.45, marginBottom: '18px', flexGrow: 1 }}>
                {faculty.bio}
              </p>

              {/* Contact info list */}
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px', 
                  borderTop: '1px solid rgba(255, 255, 255, 0.04)', 
                  paddingTop: '14px',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'hsl(var(--text-secondary))' }}>
                  <Mail size={13} color="hsl(var(--text-muted))" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{faculty.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'hsl(var(--text-secondary))' }}>
                  <Phone size={13} color="hsl(var(--text-muted))" />
                  <span>{faculty.phone}</span>
                </div>
              </div>

              {/* Status control button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: '600' }}>
                  DEP: <span style={{ color: 'hsl(var(--text-secondary))' }}>{faculty.department}</span>
                </span>
                
                <button
                  onClick={() => toggleStatus(faculty.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    background: faculty.status === 'Active' ? 'rgba(16, 185, 129, 0.06)' : 'rgba(244, 63, 94, 0.06)',
                    border: '1px solid',
                    borderColor: faculty.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                    color: faculty.status === 'Active' ? 'hsl(var(--accent-emerald))' : 'hsl(var(--accent-rose))',
                    transition: 'all 0.2s'
                  }}
                >
                  <div 
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: faculty.status === 'Active' ? 'hsl(var(--accent-emerald))' : 'hsl(var(--accent-rose))',
                      boxShadow: `0 0 6px ${faculty.status === 'Active' ? 'hsl(var(--accent-emerald))' : 'hsl(var(--accent-rose))'}`
                    }}
                  />
                  {faculty.status}
                </button>
              </div>

            </GlassCard>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '60px 20px', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
            No registered faculty members matched your filters or search.
          </div>
        )}
      </div>

      {/* Register Faculty Modal Popup */}
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
          <div className="animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '8px' }}>
            <GlassCard hoverEffect={false} style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="hsl(var(--accent-cyan))" /> Onboard Faculty Member
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--text-muted))' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddFaculty} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Full Name */}
                <div className="input-group">
                  <label className="input-label" htmlFor="facName">Full Name</label>
                  <input
                    id="facName"
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Dr. Abraham Alula"
                    className="input-field"
                  />
                </div>

                {/* Designation / Role and Department */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label" htmlFor="facRole">Academic Role</label>
                    <select
                      id="facRole"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="input-field"
                    >
                      {roles.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="facDept">Department</label>
                    <select
                      id="facDept"
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      className="input-field"
                    >
                      {departments.filter(d => d !== 'All').map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact: Email & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label" htmlFor="facEmail">University Email</label>
                    <input
                      id="facEmail"
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="e.g. abraham.a@admas.edu.et"
                      className="input-field"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label" htmlFor="facPhone">Phone Number</label>
                    <input
                      id="facPhone"
                      type="text"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+251-9..."
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Professional Bio */}
                <div className="input-group">
                  <label className="input-label" htmlFor="facBio">Professional Bio Summary</label>
                  <textarea
                    id="facBio"
                    rows="3"
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    placeholder="Short summary of background, credentials and courses taught..."
                    className="input-field"
                    style={{ resize: 'none', fontFamily: 'inherit' }}
                  />
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
                    Register Faculty
                  </button>
                </div>

              </form>
            </GlassCard>
          </div>
        </div>
      )}

    </div>
  );
};

export default FacultyManagement;
