import test from 'node:test';
import assert from 'node:assert/strict';
import { isRoleAccessEnabled, isUploadSourceAllowed } from './adminAccess';

test('student access is disabled when admin turns off the student portal', () => {
  const settings = { services: { studentPortal: false, facultyWorkspace: true, placementServices: true, communityBoard: true }, rfidEnabled: true, maintenanceMode: false, studentWidgets: ['profile'] };
  assert.equal(isRoleAccessEnabled('student', settings), false);
});

test('faculty and placement imports are allowed only for supported sources', () => {
  assert.equal(isUploadSourceAllowed('student', 'xlsx'), true);
  assert.equal(isUploadSourceAllowed('faculty', 'pdf'), true);
  assert.equal(isUploadSourceAllowed('placement_admin', 'jpg'), false);
});
