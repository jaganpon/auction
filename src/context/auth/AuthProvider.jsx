import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours
const WARNING_TIME = 10 * 60 * 1000; // 10 minutes

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const loginTime = localStorage.getItem("loginTime");

    if (!token || !user || !loginTime) return { token: null, user: null };

    const elapsed = Date.now() - Number(loginTime);
    if (elapsed >= SESSION_DURATION) {
      localStorage.clear();
      return { token: null, user: null };
    }

    return { token, user: JSON.parse(user) };
  });

  const [sessionWarning, setSessionWarning] = useState(false);
  const sessionTimerRef = useRef(null);
  const warningTimerRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    sessionTimerRef.current = null;
    warningTimerRef.current = null;
  }, []);

  const logout = useCallback(() => {
    clearTimers();
    setAuth({ token: null, user: null });
    setSessionWarning(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    navigate("/login", { replace: true });
  }, [navigate, clearTimers]);

  const startSessionTimer = useCallback(
    (duration) => {
      clearTimers();

      const warningDelay = duration - WARNING_TIME;
      if (warningDelay > 0) {
        warningTimerRef.current = setTimeout(
          () => setSessionWarning(true),
          warningDelay
        );
      }

      sessionTimerRef.current = setTimeout(() => {
        alert("Session expired. Please login again.");
        logout();
      }, duration);
    },
    [clearTimers, logout]
  );

  const login = useCallback(
    (userData, token) => {
      const loginTime = Date.now();
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("loginTime", loginTime.toString());

      setAuth({ token, user: userData });
      setSessionWarning(false);
      startSessionTimer(SESSION_DURATION);
    },
    [startSessionTimer]
  );

  const extendSession = useCallback(() => {
    const loginTime = Date.now();
    localStorage.setItem("loginTime", loginTime.toString());
    setSessionWarning(false);
    startSessionTimer(SESSION_DURATION);
  }, [startSessionTimer]);

  // Initialize session timer if token exists
  useEffect(() => {
    if (!auth.token) return;

    const loginTime = Number(localStorage.getItem("loginTime"));
    const elapsed = Date.now() - loginTime;
    const remaining = SESSION_DURATION - elapsed;

    if (remaining > 0) startSessionTimer(remaining);
  }, [auth.token, startSessionTimer]);

  // Cleanup timers on unmount
  useEffect(() => () => clearTimers(), [clearTimers]);

  const value = {
    user: auth.user,
    token: auth.token,
    login,
    logout,
    extendSession,
    sessionWarning,
    isAuthenticated: Boolean(auth.token),
    hasRole: (roles = []) =>
      roles.length === 0 || roles.includes(auth.user?.role),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}

      {sessionWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Session Expiring Soon</h2>
            <p className="mb-6">Extend your session before it expires?</p>
            <div className="flex gap-4">
              <button
                onClick={extendSession}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Extend
              </button>
              <button
                onClick={logout}
                className="flex-1 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
