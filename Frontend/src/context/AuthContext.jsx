import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setTokenState] = useState(
    localStorage.getItem("token")
  );
  const [isGuest, setIsGuestState] = useState(
    localStorage.getItem("isGuest") === "true"
  );

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      localStorage.removeItem("isGuest");
      setIsGuestState(false);
    } else {
      localStorage.removeItem("token");
    }
    setTokenState(newToken);
  };

  const setIsGuest = (guestVal) => {
    if (guestVal) {
      localStorage.setItem("isGuest", "true");
      localStorage.removeItem("token");
      setTokenState(null);
    } else {
      localStorage.removeItem("isGuest");
    }
    setIsGuestState(guestVal);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isGuest,
        setIsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;