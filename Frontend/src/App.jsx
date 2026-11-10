import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { Home } from "./pages/Home";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { supabase } from "./lib/supabase";
import { login, logout } from "./context/UserSlice";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Mainoutlet } from "./pages/Mainoutlet";
import { Documents } from "./pages/Documents";
import { Setting } from "./pages/Setting";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ResetPassword } from "./pages/ResetPassword";

function App() {
  const dispatch = useDispatch();

  const [authLoading, setAuthLoading] = useState(true);

  // Get theme from Redux
  const theme = useSelector((state) => state.theme.mode);

  // Restore user session
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const user = session.user;

          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

          dispatch(
            login({
              id: user.id,
              name: profile?.full_name || "",
              email: user.email,
            })
          );
        } else {
          dispatch(logout());
        }
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, [dispatch]);

  // Apply Redux theme to HTML
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );
  }, [theme]);

  // Loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-800 dark:text-gray-200">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication pages */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Protected application layout */}
        <Route
          element={
            <ProtectedRoute>
              <Mainoutlet />
            </ProtectedRoute>
          }
        >

          {/* Dashboard / Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Documents */}
          <Route
            path="/documents"
            element={<Documents />}
          />

          {/* Settings */}
          <Route
            path="/setting"
            element={<Setting />}
          />

        </Route>

        {/* Reset password */}
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;