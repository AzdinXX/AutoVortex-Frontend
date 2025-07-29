import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
    
    // Set up periodic check for admin session validity
    const interval = setInterval(() => {
      if (isAdmin) {
        checkAdminStatus();
      }
    }, 30000); // Check every 30 seconds if admin is logged in

    return () => clearInterval(interval);
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        // Check if user data is valid and has required fields
        if (userData && userData.user && userData.user.role === 'admin' && userData.user.id) {
          // Additional check: verify the user is actually logged in by checking if we have valid user data
          if (userData.user.username && userData.user.email) {
            // Optional: Verify session with backend (uncomment if you want server-side verification)
            // try {
            //   const response = await fetch('http://localhost:3000/api/verify-admin-session', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ userId: userData.user.id })
            //   });
            //   if (!response.ok) {
            //     throw new Error('Session invalid');
            //   }
            // } catch (error) {
            //   console.error('Session verification failed:', error);
            //   localStorage.removeItem('user');
            //   setIsAdmin(false);
            //   setAdminUser(null);
            //   setLoading(false);
            //   return;
            // }
            
            setIsAdmin(true);
            setAdminUser(userData.user);
          } else {
            // Invalid user data, clear it
            localStorage.removeItem('user');
            setIsAdmin(false);
            setAdminUser(null);
          }
        } else {
          // Not an admin or invalid data
          setIsAdmin(false);
          setAdminUser(null);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        setIsAdmin(false);
        setAdminUser(null);
      }
    } else {
      // No user data in localStorage
      setIsAdmin(false);
      setAdminUser(null);
    }
    setLoading(false);
  };

  const loginAsAdmin = (userData) => {
    if (userData.user && userData.user.role === 'admin') {
      setIsAdmin(true);
      setAdminUser(userData.user);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setAdminUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    isAdmin,
    adminUser,
    loading,
    loginAsAdmin,
    logoutAdmin,
    checkAdminStatus,
    refreshAdminStatus: checkAdminStatus
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 