import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


// =====================================================
// AUTH CONTEXT
// =====================================================

const AuthContext = createContext(null);


// =====================================================
// SAFE USER PARSER
// =====================================================

const getStoredUser = () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    return user;
  } catch (error) {
    console.error(
      "Failed to parse stored user:",
      error
    );

    return null;
  }
};


// =====================================================
// TOKEN HELPER
// =====================================================

const getStoredToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    null
  );
};


// =====================================================
// PROVIDER
// =====================================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());

  const [token, setToken] = useState(
    () => getStoredToken()
  );

  const [loading, setLoading] = useState(true);


  // ======================================
  // Initialize Auth State
  // ======================================

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();

    setUser(storedUser);
    setToken(storedToken);

    setLoading(false);
  }, []);


  // ======================================
  // Login
  // ======================================

  const login = (authData) => {
    if (!authData) {
      return;
    }

    const newToken =
      authData?.token ||
      authData?.accessToken ||
      null;

    const newUser =
      authData?.user ||
      authData?.data?.user ||
      authData?.data ||
      null;

    if (newToken) {
      localStorage.setItem(
        "token",
        newToken
      );

      setToken(newToken);
    }

    if (newUser) {
      localStorage.setItem(
        "user",
        JSON.stringify(newUser)
      );

      setUser(newUser);
    }
  };


  // ======================================
  // Update User
  // ======================================

  const updateUser = (updatedUser) => {
    if (!updatedUser) {
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
  };


  // ======================================
  // Logout
  // ======================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };


  // ======================================
  // Refresh Auth From Storage
  // ======================================

  const refreshAuth = () => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();

    setUser(storedUser);
    setToken(storedToken);
  };


  // ======================================
  // Auth Status
  // ======================================

  const isAuthenticated = Boolean(
    user && token
  );


  // ======================================
  // Role Helpers
  // ======================================

  const role = user?.role || null;

  const isStudent =
    role === "student";

  const isRecruiter =
    role === "recruiter";

  const isEmployee =
    role === "employee";

  const isAmbassador =
    role === "ambassador";

  const isControl =
    role === "control";


  // ======================================
  // Context Value
  // ======================================

  const value = useMemo(
    () => ({
      user,
      token,
      loading,

      isAuthenticated,

      role,

      isStudent,
      isRecruiter,
      isEmployee,
      isAmbassador,
      isControl,

      login,
      logout,
      updateUser,
      refreshAuth,
    }),
    [
      user,
      token,
      loading,
      isAuthenticated,
      role,
      isStudent,
      isRecruiter,
      isEmployee,
      isAmbassador,
      isControl,
    ]
  );


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


// =====================================================
// USE AUTH HOOK
// =====================================================

export const useAuth = () => {
  const context = useContext(
    AuthContext
  );

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};


export default AuthContext;