import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell.jsx";
import { AuthRouteSkeleton } from "./components/ui/ScreenSkeletons.jsx";
import { useAuth } from "./state/AuthProvider.jsx";

import { LandingPage } from "./pages/LandingPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { CreateRegistryPage } from "./pages/CreateRegistryPage.jsx";
import { EditRegistryPage } from "./pages/EditRegistryPage.jsx";
import { JoinRegistryPage } from "./pages/JoinRegistryPage.jsx";
import { RegistryPage } from "./pages/RegistryPage.jsx";
import { RevealPage } from "./pages/RevealPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";
import { DocumentationPage } from "./pages/DocumentationPage.jsx";
import { NotificationsPage } from "./pages/NotificationsPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { safeInternalPath } from "./utils/navigation.js";

function Protected({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <AuthRouteSkeleton />;
  if (!user) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}

function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <AuthRouteSkeleton />;
  if (user) {
    const rawNext = new URLSearchParams(location.search).get("next");
    const next = safeInternalPath(rawNext);
    if (next) return <Navigate to={next} replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function ShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<ShellLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <PublicOnly>
              <LoginPage />
            </PublicOnly>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnly>
              <RegisterPage />
            </PublicOnly>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicOnly>
              <ForgotPasswordPage />
            </PublicOnly>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <DashboardPage />
            </Protected>
          }
        />
        <Route
          path="/registries/new"
          element={
            <Protected>
              <CreateRegistryPage />
            </Protected>
          }
        />
        <Route
          path="/registry/join"
          element={
            <Protected>
              <JoinRegistryPage />
            </Protected>
          }
        />
        <Route
          path="/registry/join/:joinCode"
          element={
            <Protected>
              <JoinRegistryPage />
            </Protected>
          }
        />
        <Route
          path="/registry/:registryId/edit"
          element={
            <Protected>
              <EditRegistryPage />
            </Protected>
          }
        />
        <Route
          path="/registry/:registryId"
          element={
            <Protected>
              <RegistryPage />
            </Protected>
          }
        />
        <Route
          path="/registry/:registryId/reveal"
          element={
            <Protected>
              <RevealPage />
            </Protected>
          }
        />
        <Route path="/thank-you" element={<Navigate to="/notifications" replace />} />
        <Route
          path="/notifications"
          element={
            <Protected>
              <NotificationsPage />
            </Protected>
          }
        />
        <Route
          path="/settings"
          element={
            <Protected>
              <SettingsPage />
            </Protected>
          }
        />
        <Route
          path="/documentation/*"
          element={
            <Protected>
              <DocumentationPage />
            </Protected>
          }
        />
        <Route path="/users/*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
