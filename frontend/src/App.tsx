import { useEffect } from "react";
import { useThemeStore } from "./store/useThemeStore";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import { useAuthStore } from "./store/useAuthStore";
import LoginPage from "./pages/LoginPage";

function App() {
  const { theme } = useThemeStore();
  const { user, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ user, isCheckingAuth });

  if (isCheckingAuth && !user) {
    return <div>Loading...</div>;
  }
  return (
    <div data-theme={theme} className="h-screen bg-base-200 text-base-content">
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to={"/"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
