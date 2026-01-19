import { createContext, useContext, useState } from "react";

const AdminAuthContext = createContext<any>(null);

export const AdminAuthProvider = ({ children }: any) => {
  const [admin, setAdmin] = useState(null);

  const login = (adminData: any) => setAdmin(adminData);
  const logout = () => setAdmin(null);

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
