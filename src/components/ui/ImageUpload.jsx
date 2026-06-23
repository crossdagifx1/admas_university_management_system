import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

// Reads a real selected image file into a base64 data URL so the photo can be
// stored in app state and previewed by the admin. value = data URL string.
const ImageUpload = ({ value, onChange, label = 'Upload photo', hint }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  const handleFile = (file) => {
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    if (file.size > 4 * 1024 * 1024) { setError('Image must be under 4 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result, file.name);
    reader.readAsDataURL(file);
  };

  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      {value ? (
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          <img src={value} alt="upload preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }} />
          <button type="button" onClick={() => onChange('', '')}
            style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(9,10,15,0.8)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '22px', borderRadius: '12px', border: '1.5px dashed rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.02)', color: 'hsl(var(--text-muted))', cursor: 'pointer', transition: 'var(--transition-fast)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'hsl(var(--accent-cyan))'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}>
          <Upload size={22} color="hsl(var(--accent-cyan))" />
          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'hsl(var(--text-secondary))' }}>Click to {label.toLowerCase()}</span>
          {hint && <span style={{ fontSize: '0.72rem' }}>{hint}</span>}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files?.[0])} />
      {error && <span style={{ fontSize: '0.75rem', color: 'hsl(var(--accent-rose))' }}>{error}</span>}
    </div>
  );
};

// Small clickable thumbnail/indicator for tables — opens the full image in a new tab.
export const ImageThumb = ({ src }) => {
  if (!src) return <span style={{ color: 'hsl(var(--text-muted))' }}>—</span>;
  const isData = typeof src === 'string' && src.startsWith('data:');
  if (!isData) return <ImageIcon size={15} color="hsl(var(--accent-cyan))" />;
  return (
    <button type="button"
      onClick={() => { const w = window.open(); if (w) w.document.write(`<img src="${src}" style="max-width:100%"/>`); }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 0 }} title="View photo">
      <img src={src} alt="evidence" style={{ width: '34px', height: '34px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)' }} />
    </button>
  );
};

export default ImageUpload;
