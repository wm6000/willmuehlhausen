import { BrowserRouter, Route, Routes } from "react-router";

import { PageShell } from "@/layout/PageShell";
import { RequireSession } from "@/components/auth/RequireSession";
import { SessionProvider } from "@/components/auth/SessionContext";
import { ProfileProvider } from "@/components/profile/ProfileContext";
import { AdvisorPage } from "@/pages/AdvisorPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ProjectPage } from "@/pages/ProjectPage";
import { ProjectsPage } from "@/pages/ProjectsPage";

export function App() {
  return (
    <SessionProvider>
      <ProfileProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PageShell />}>
              <Route index element={<HomePage />} />
              <Route path="advisor" element={<AdvisorPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:slug" element={<ProjectPage />} />
              <Route
                path="profile"
                element={
                  <RequireSession>
                    <ProfilePage />
                  </RequireSession>
                }
              />
              <Route path="login" element={<LoginPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProfileProvider>
    </SessionProvider>
  );
}
