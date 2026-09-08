import test from 'node:test';
import assert from 'node:assert/strict';
import { canAccessPath, hasPermission } from './permissions';

test('route access is limited to the role workspace', () => {
  assert.equal(canAccessPath('student', '/student-dashboard'), true);
  assert.equal(canAccessPath('student', '/placement-admin'), false);
  assert.equal(canAccessPath('faculty', '/student-dashboard'), false);
  assert.equal(canAccessPath('placement_admin', '/placement-admin'), true);
  assert.equal(canAccessPath('campus_admin', '/any-admin-route'), true);
});

test('permissions expose only actions supported by each role', () => {
  assert.equal(hasPermission('student', 'marks.view'), true);
  assert.equal(hasPermission('student', 'marks.edit'), false);
  assert.equal(hasPermission('faculty', 'attendance.edit'), true);
  assert.equal(hasPermission('placement_admin', 'users.delete'), false);
  assert.equal(hasPermission('campus_admin', 'audit_logs.view'), true);
});