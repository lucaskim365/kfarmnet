import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, loginWithGoogle, logout } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // 1. Sync user profile to Firestore - non-blocking for Auth state
          const syncProfile = async () => {
            try {
              const userRef = doc(db, 'users', user.uid);
              await setDoc(userRef, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                updatedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
              }, { merge: true });
            } catch (error) {
              console.error("Profile sync failed:", error);
            }
          };
          syncProfile();

          // 2. Check if admin
          try {
            const { getDoc } = await import('firebase/firestore');
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            setIsAdmin(adminDoc.exists());
          } catch (e) {
            console.log("Admin check failed - expected if not admin");
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
      } finally {
        setUser(user);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    await loginWithGoogle();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
