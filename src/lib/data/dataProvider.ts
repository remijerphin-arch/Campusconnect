import { getFacultyWorkspaceData, getPlacementWorkspaceData, getStudentDashboardData } from '@/lib/data/repository';

export type DataSource = 'demo' | 'supabase';

export interface DataProvider {
  getStudentDashboard: typeof getStudentDashboardData;
  getFacultyWorkspace: typeof getFacultyWorkspaceData;
  getPlacementWorkspace: typeof getPlacementWorkspaceData;
}

export const dataProvider: DataProvider = {
  getStudentDashboard: getStudentDashboardData,
  getFacultyWorkspace: getFacultyWorkspaceData,
  getPlacementWorkspace: getPlacementWorkspaceData,
};
