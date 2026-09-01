import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_CREDENTIALS } from './mockData';
import { buildDemoStudentRecords, getDemoStudentCredentialList } from './studentDemoData';

test('demo student roster creates 57 unique student records', () => {
  const records = buildDemoStudentRecords();
  assert.equal(records.length, 57);
  const registerNumbers = records.map((student) => student.registerNumber);
  const emails = records.map((student) => student.email);
  assert.equal(new Set(registerNumbers).size, 57);
  assert.equal(new Set(emails).size, 57);
  assert.ok(records.every((student) => student.currentSemester === 5));
  assert.ok(records.every((student) => student.department === 'Artificial Intelligence and Machine Learning'));
});

test('student login only uses the authoritative roster and rejects generic fallback credentials', () => {
  const rosterStudents = getDemoStudentCredentialList();
  assert.equal(rosterStudents.length, 57);
  assert.ok(rosterStudents.every((student) => student.roleKey === 'student'));
  assert.ok(rosterStudents.every((student) => student.email.endsWith('@campusconnect.edu')));
  assert.ok(DEMO_CREDENTIALS.every((credential) => String(credential.roleKey) !== 'student'));
});
