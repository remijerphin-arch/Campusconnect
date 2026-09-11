import { getFacultyWorkspaceData, getPlacementWorkspaceData, getStudentDashboardData } from '@/lib/data/repository';

/**
 * Where a workspace's data currently comes from. 'demo' reads from local
 * fixtures/browser storage; 'supabase' reads from the live database.
 * Not every screen is wired to 'supabase' yet — see the README's
 * Production Status section for what's still on demo fixtures.
 */
export type DataSource = 'demo' | 'supabase';

/**
 * The common shape every screen depends on when fetching workspace data.
 * Routing through this interface (instead of importing repository.ts
 * directly everywhere) means the data source behind each function can be
 * swapped later without touching the screens that call it.
 */
export interface DataProvider {
  getStudentDashboard: typeof getStudentDashboardData;
  getFacultyWorkspace: typeof getFacultyWorkspaceData;
  getPlacementWorkspace: typeof getPlacementWorkspaceData;
}

// Default provider, currently wired straight to the repository layer.
export const dataProvider: DataProvider = {
  getStudentDashboard: getStudentDashboardData,
  getFacultyWorkspace: getFacultyWorkspaceData,
  getPlacementWorkspace: getPlacementWorkspaceData,
};
