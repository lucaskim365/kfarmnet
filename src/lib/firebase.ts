import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: Use the databaseId from config if provided
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Connection Test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or network status.");
    }
  }
}
testConnection();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Login failed (Firebase):", error.code, error.message);
    if (error.code === 'auth/popup-blocked') {
      alert('로그인 팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해 주세요.');
    } else if (error.code === 'auth/operation-not-allowed') {
      console.error("Firebase Console에서 Google 로그인이 활성화되어 있는지 확인하세요.");
    }
    throw error;
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}
