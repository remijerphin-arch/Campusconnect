import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRequired, validators } from './validation';

test('validateRequired flags missing, null, and empty fields', () => {
  const result = validateRequired({ name: 'Piru', email: '', role: null });
  assert.equal(result.valid, false);
  if (!result.valid) {
    assert.equal(result.errors.email, 'This field is required.');
    assert.equal(result.errors.role, 'This field is required.');
    assert.equal('name' in result.errors, false);
  }
});

test('validateRequired passes when every field has a value', () => {
  const result = validateRequired({ name: 'Piru', email: 'piru@example.com' });
  assert.equal(result.valid, true);
});

test('validators.email accepts valid addresses and rejects invalid ones', () => {
  assert.equal(validators.email('piru@example.com'), null);
  assert.notEqual(validators.email('not-an-email'), null);
});

test('validators.phone accepts numbers with at least 7 digits', () => {
  assert.equal(validators.phone('+91 98765 43210'), null);
  assert.notEqual(validators.phone('12345'), null);
});

test('validators.dateRange rejects an end date before the start date', () => {
  assert.equal(validators.dateRange('2026-01-01', '2026-01-10'), null);
  assert.notEqual(validators.dateRange('2026-01-10', '2026-01-01'), null);
});

test('validators.cgpa enforces the 0-10 scale', () => {
  assert.equal(validators.cgpa(8.5), null);
  assert.notEqual(validators.cgpa(11), null);
  assert.notEqual(validators.cgpa(-1), null);
});

test('validators.mark enforces the 0-max scale, defaulting to 100', () => {
  assert.equal(validators.mark(75), null);
  assert.notEqual(validators.mark(150), null);
  assert.equal(validators.mark(45, 50), null);
  assert.notEqual(validators.mark(55, 50), null);
});
