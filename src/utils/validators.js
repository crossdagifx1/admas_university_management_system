// Pure form validators for the admin management panels. Each returns a
// { field: message } map; an empty object means "valid". `editingId` excludes
// the record currently being edited from its own duplicate check.

const norm = (v) => (v || '').trim().toLowerCase();

export function validateTrainer(form, allTrainers = [], editingId = null) {
  const errors = {};
  if (!form.name || !form.name.trim()) errors.name = 'Full name is required.';

  if (form.staffNo && form.staffNo.trim()) {
    const dup = allTrainers.some((t) => t.id !== editingId && norm(t.staffNo) === norm(form.staffNo));
    if (dup) errors.staffNo = 'A trainer with this staff number already exists.';
  }

  const rating = Number(form.rating);
  if (form.rating !== '' && form.rating != null && (Number.isNaN(rating) || rating < 0 || rating > 5)) {
    errors.rating = 'Rating must be between 0 and 5.';
  }
  return errors;
}

export function validateTrainee(form, allTrainees = [], editingId = null) {
  const errors = {};
  if (!form.studentId || !form.studentId.trim()) errors.studentId = 'Student ID is required.';
  if (!form.firstName || !form.firstName.trim()) errors.firstName = 'First name is required.';

  if (form.studentId && form.studentId.trim()) {
    const dup = allTrainees.some((t) => t.id !== editingId && norm(t.studentId) === norm(form.studentId));
    if (dup) errors.studentId = 'A trainee with this Student ID already exists.';
  }
  return errors;
}

export const hasErrors = (errors) => Object.keys(errors).length > 0;
