import { Navigate, Route, Routes } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { AuthorizationTestPage } from '../pages/AuthorizationTestPage';
import { BasesPage } from '../pages/BasesPage';
import { EquipmentTypesPage } from '../pages/EquipmentTypesPage';
import { AssetsPage } from '../pages/AssetsPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { RequirePermission } from './RequirePermission';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}><Route path="/app" element={<HomePage />} /></Route>
    <Route element={<ProtectedRoute />}><Route path="/app/bases" element={<BasesPage />} /></Route>
    <Route element={<RequirePermission permission="INVENTORY_VIEW" />}><Route path="/app/equipment-types" element={<EquipmentTypesPage />} /></Route>
    <Route element={<RequirePermission permission="INVENTORY_VIEW" />}><Route path="/app/assets" element={<AssetsPage />} /></Route>
    <Route element={<ProtectedRoute />}><Route path="/unauthorized" element={<UnauthorizedPage />} /></Route>
    <Route element={<RequirePermission permission="SYSTEM_ADMIN" />}><Route path="/app/admin-test" element={<AuthorizationTestPage title="System administration" description="Authorization test route for system administrators." />} /></Route>
    <Route element={<RequirePermission permission="INVENTORY_VIEW" />}><Route path="/app/inventory-test" element={<AuthorizationTestPage title="Inventory access" description="Authorization test route for inventory viewing permission." />} /></Route>
    <Route path="*" element={<Navigate to="/app" replace />} />
  </Routes>;
}
