// Lightweight client-side export + print helpers (no external dependencies).

export function getAdmasLogoSVG(size = 72) {
  return `<img src="/admas-logo.png" alt="Admas University Logo" width="${size}" height="${size}" style="border-radius: 50%; object-fit: cover; display: inline-block; vertical-align: middle; width: ${size}px; height: ${size}px;" />`;
}

export function exportToCSV(filename, columns, rows) {
  const header = columns.map((c) => `"${String(c.label).replace(/"/g, '""')}"`).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const raw = typeof c.value === 'function' ? c.value(row) : row[c.key];
          const cell = raw == null ? '' : String(raw);
          return `"${cell.replace(/"/g, '""')}"`;
        })
        .join(',')
    )
    .join('\n');

  const csv = `${header}\n${body}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Opens a clean print window for a given report title and HTML content.
export function printReport(title, innerHTML) {
  const win = window.open('', '_blank', 'width=1000,height=700');
  if (!win) return;
  win.document.write(`<!doctype html><html><head><title>${title}</title>
    <style>
      body{font-family:'Segoe UI',Arial,sans-serif;color:#111;padding:32px;}
      h1{font-size:20px;margin:0 0 4px;}
      .muted{color:#666;font-size:12px;margin-bottom:18px;}
      table{width:100%;border-collapse:collapse;font-size:12px;}
      th,td{border:1px solid #ddd;padding:8px 10px;text-align:left;}
      th{background:#f3f4f6;}
      .brand{display:flex;align-items:center;gap:10px;border-bottom:2px solid #14b8a6;padding-bottom:10px;margin-bottom:14px;}
      .brand .logo{width:34px;height:34px;border-radius:8px;background:linear-gradient(135deg,#14b8a6,#00e5ff);}
    </style></head><body>
    <div class="brand"><div class="logo"></div><div><h1>ADMAS University · ATMS</h1><div class="muted">${title}</div></div></div>
    ${innerHTML}
    <p class="muted" style="margin-top:18px;">Generated on June 18, 2026 · Confidential institutional report</p>
    </body></html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
}

// Custom formatted print for the Class Schedule matching legacy Access layout
export function printClassSchedule(academicYear, semester, sectionsData) {
  const win = window.open('', '_blank', 'width=1000,height=700');
  if (!win) return;

  const logoSVG = getAdmasLogoSVG(72);
  const now = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  let htmlContent = '';
  sectionsData.forEach((sec, idx) => {
    htmlContent += `
      <div class="section-container" style="${idx > 0 ? 'page-break-before: always;' : ''}">
        <div class="header-table">
          <div class="header-logo">${logoSVG}</div>
          <div class="header-titles">
            <h1 class="univ-title">ADMAS UNIVERSITY</h1>
            <h2 class="campus-title">Misrak Campus</h2>
            <h3 class="schedule-subtitle">Class Schedule</h3>
            <div class="meta-row">
              <span><strong>AcYear:</strong> ${academicYear}</span>
              <span style="margin-left: 20px;"><strong>Semester:</strong> ${semester}</span>
            </div>
          </div>
          <div class="header-right">
            <div class="final-banner">FINAL SCHEDULE</div>
          </div>
        </div>

        <div class="section-bar">
          <span class="sec-label">Section</span>
          <span class="sec-value">${sec.sectionCode}</span>
        </div>

        <table class="schedule-table">
          <thead>
            <tr>
              <th>Unit Title</th>
              <th>Schedule I</th>
              <th>Room_No</th>
              <th>Center</th>
              <th>Trainer's Name</th>
            </tr>
          </thead>
          <tbody>
            ${sec.rows.map(r => `
              <tr>
                <td style="font-weight: 500;">${r.unitTitle}</td>
                <td>${r.schedule}</td>
                <td style="text-align: center;">${r.room}</td>
                <td style="text-align: center;">${r.center}</td>
                <td>${r.trainerName}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  });

  win.document.write(`<!doctype html><html><head><title>Class Schedule - Admas University</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
      body {
        font-family: 'Segoe UI', Arial, sans-serif;
        color: #111;
        margin: 0;
        padding: 40px;
        background: #fff;
      }
      .section-container {
        margin-bottom: 40px;
        page-break-inside: avoid;
      }
      .header-table {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;
      }
      .header-logo {
        flex-shrink: 0;
      }
      .header-titles {
        flex: 1;
        margin-left: 20px;
      }
      .univ-title {
        font-family: 'Outfit', sans-serif;
        font-size: 24px;
        font-weight: 800;
        margin: 0;
        color: #0b1e36;
        letter-spacing: 0.5px;
      }
      .campus-title {
        font-size: 16px;
        font-weight: 600;
        margin: 2px 0 0 0;
        color: #555;
      }
      .schedule-subtitle {
        font-size: 14px;
        color: #666;
        margin: 4px 0;
      }
      .meta-row {
        font-size: 12px;
        color: #444;
        margin-top: 6px;
      }
      .header-right {
        text-align: right;
      }
      .final-banner {
        font-family: 'Outfit', sans-serif;
        font-size: 20px;
        font-weight: 800;
        color: #e65100;
        letter-spacing: 0.5px;
      }
      .section-bar {
        border: 1px solid #c2e0ff;
        background-color: #f0f7ff;
        padding: 8px 16px;
        font-size: 13px;
        margin-bottom: 12px;
        display: inline-block;
        border-radius: 4px;
      }
      .sec-label {
        color: #b71c1c;
        font-weight: 700;
        margin-right: 8px;
        text-transform: uppercase;
      }
      .sec-value {
        color: #0d47a1;
        font-weight: 800;
        font-family: 'Outfit', sans-serif;
      }
      .schedule-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        margin-bottom: 20px;
      }
      .schedule-table th, .schedule-table td {
        border: 1px solid #888;
        padding: 8px 12px;
        text-align: left;
      }
      .schedule-table th {
        background-color: #ffff00;
        color: #000;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 11px;
        letter-spacing: 0.3px;
      }
      .schedule-table tr:nth-child(even) {
        background-color: #fafafa;
      }
      .print-footer {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: #777;
        margin-top: 30px;
        border-top: 1px dashed #ccc;
        padding-top: 10px;
      }
      @media print {
        body { padding: 20px; }
        .section-container { page-break-inside: avoid; }
      }
    </style></head><body>
    ${htmlContent}
    <div class="print-footer">
      <span>Generated on ${now} · ADMAS ATMS Portal</span>
      <span>Confidential - For Academic Use Only</span>
    </div>
    </body></html>`);

  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
}

// Custom formatted print for the Trainer Load matching legacy Access layout
export function printTrainerCourseLoad(academicYear, semester, trainersData, classEndText = 'megabit 20') {
  const win = window.open('', '_blank', 'width=1000,height=700');
  if (!win) return;

  const logoSVG = getAdmasLogoSVG(72);
  const now = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  let htmlContent = '';
  trainersData.forEach((trn, idx) => {
    htmlContent += `
      <div class="trainer-container" style="${idx > 0 ? 'page-break-before: always;' : ''}">
        <div class="header-table">
          <div class="header-logo">${logoSVG}</div>
          <div class="header-titles">
            <h1 class="univ-title">ADMAS UNIVERSITY</h1>
            <h2 class="campus-title">Misrak Campus</h2>
            <h3 class="load-subtitle">Trainer Course Load</h3>
          </div>
          <div class="header-meta">
            <div><strong>Academic Year:</strong> ${academicYear}</div>
            <div><strong>Semester:</strong> ${semester}</div>
          </div>
        </div>

        <div class="trainer-bar">
          <span class="trainer-label">Trainer's Name:</span>
          <span class="trainer-value">${trn.name.toUpperCase()}</span>
        </div>

        <table class="load-table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Unit Title</th>
              <th style="text-align: center; width: 60px;">act H</th>
              <th>Schedule I</th>
              <th>Schedule II</th>
              <th style="text-align: center; width: 70px;">Room_No</th>
              <th style="text-align: center; width: 90px;">Center</th>
            </tr>
          </thead>
          <tbody>
            ${trn.rows.map(r => `
              <tr>
                <td style="font-weight: 700; color: #0d47a1; font-family: 'Outfit', sans-serif;">${r.sectionCode}</td>
                <td>${r.unitTitle}</td>
                <td style="text-align: center; font-weight: bold;">${String(r.creditHours).padStart(2, '0')}</td>
                <td>${r.schedule1}</td>
                <td>${r.schedule2 || ''}</td>
                <td style="text-align: center;">${r.room}</td>
                <td style="text-align: center;">${r.center}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="2" style="font-weight: bold; text-align: left;">Total Weekly Load</td>
              <td style="text-align: center; font-weight: 800; font-family: 'Outfit', sans-serif;">${String(trn.totalLoad).padStart(2, '0')}</td>
              <td colspan="4"></td>
            </tr>
          </tbody>
        </table>

        <div class="class-end-bar">
          <strong>Class End:</strong> <span class="highlight-yellow">${classEndText}</span>
        </div>

        <div class="signature-section">
          <div class="sig-line">
            <span class="sig-label">Department Head's Name:</span>
            <span class="underline-orange">___________________________</span>
          </div>
          <div class="sig-line">
            <span class="sig-label">Signature:</span>
            <span class="underline-orange">_______________________</span>
          </div>
          <div class="sig-line">
            <span class="sig-label">Date:</span>
            <span class="underline-orange">_____________________</span>
          </div>
        </div>
      </div>
    `;
  });

  win.document.write(`<!doctype html><html><head><title>Trainer Course Load - Admas University</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
      body {
        font-family: 'Segoe UI', Arial, sans-serif;
        color: #111;
        margin: 0;
        padding: 40px;
        background: #fff;
      }
      .trainer-container {
        margin-bottom: 50px;
        page-break-inside: avoid;
      }
      .header-table {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
        border-bottom: 2px solid #36b6e8;
        padding-bottom: 8px;
      }
      .header-logo {
        flex-shrink: 0;
      }
      .header-titles {
        flex: 1;
        margin-left: 20px;
      }
      .univ-title {
        font-family: 'Outfit', sans-serif;
        font-size: 24px;
        font-weight: 800;
        margin: 0;
        color: #0b1e36;
        letter-spacing: 0.5px;
      }
      .campus-title {
        font-size: 16px;
        font-weight: 600;
        margin: 2px 0 0 0;
        color: #555;
      }
      .load-subtitle {
        font-family: 'Outfit', sans-serif;
        font-size: 16px;
        font-weight: 700;
        color: #36b6e8;
        margin: 4px 0 0 0;
      }
      .header-meta {
        text-align: right;
        font-size: 11px;
        color: #444;
        line-height: 1.5;
      }
      .trainer-bar {
        margin: 12px 0;
        font-size: 13px;
      }
      .trainer-label {
        font-weight: bold;
        color: #b71c1c;
        margin-right: 6px;
      }
      .trainer-value {
        color: #b71c1c;
        font-weight: 800;
        font-family: 'Outfit', sans-serif;
      }
      .load-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
        margin-bottom: 15px;
      }
      .load-table th, .load-table td {
        border: 1px solid #777;
        padding: 6px 10px;
        text-align: left;
      }
      .load-table th {
        background-color: #64b5f6;
        color: #fff;
        font-weight: bold;
        font-size: 11px;
        text-transform: capitalize;
      }
      .total-row {
        background-color: #f5f5f5 !important;
      }
      .class-end-bar {
        border-top: 4px solid #ffff00;
        border-bottom: 4px solid #ffff00;
        background-color: #fffde7;
        padding: 8px 12px;
        font-size: 12px;
        margin-bottom: 25px;
        font-weight: bold;
      }
      .highlight-yellow {
        background-color: #ffff00;
        padding: 2px 6px;
        border-radius: 2px;
      }
      .signature-section {
        display: flex;
        justify-content: space-between;
        margin-top: 25px;
        font-size: 11px;
      }
      .sig-line {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .sig-label {
        color: #e65100;
        font-weight: 600;
      }
      .underline-orange {
        color: #ffb74d;
        font-weight: bold;
      }
      .print-footer {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: #777;
        margin-top: 30px;
        border-top: 1px dashed #ccc;
        padding-top: 10px;
      }
      @media print {
        body { padding: 20px; }
        .trainer-container { page-break-inside: avoid; }
      }
    </style></head><body>
    ${htmlContent}
    <div class="print-footer">
      <span>Generated on ${now} · ADMAS ATMS Portal</span>
      <span>Confidential - Departmental Records</span>
    </div>
    </body></html>`);

  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
}
