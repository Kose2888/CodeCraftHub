export const VALID_STATUSES = ['Not Started', 'In Progress', 'Completed'];

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function validateCourseInput(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object'] };
  }

  if (typeof body.name !== 'string' || body.name.trim() === '') {
    errors.push('name is required and must be a non-empty string');
  }

  if (typeof body.description !== 'string') {
    errors.push('description is required and must be a string');
  }

  if (typeof body.targetCompletionDate !== 'string' || !DATE_REGEX.test(body.targetCompletionDate)) {
    errors.push('targetCompletionDate is required and must be in YYYY-MM-DD format');
  }

  if (!VALID_STATUSES.includes(body.status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  return { valid: errors.length === 0, errors };
}
