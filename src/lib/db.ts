import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from './firebase';
import type { ChatSession, Message } from '../types';

enum FirestoreOperation {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: FirestoreOperation;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: FirestoreOperation, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function createChat(userId: string, title: string) {
  const path = 'chats';
  try {
    const docRef = await addDoc(collection(db, path), {
      userId,
      title,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.CREATE, path);
  }
}

export async function uploadChatImage(userId: string, chatId: string, base64: string, mimeType: string) {
  try {
    const fileName = `users/${userId}/chats/${chatId}/${Date.now()}.png`;
    const storageRef = ref(storage, fileName);
    
    // Upload base64 string (removing data:image/png;base64, prefix if present)
    const base64Content = base64.includes(',') ? base64.split(',')[1] : base64;
    await uploadString(storageRef, base64Content, 'base64', { contentType: mimeType });
    
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

export async function addMessage(chatId: string, role: "user" | "model", text: string, image?: any) {
  const path = `chats/${chatId}/messages`;
  try {
    const messageData: any = {
      role,
      text,
      createdAt: serverTimestamp(),
    };
    
    if (image) {
      // We store the URL in Firestore, not the raw base64 data
      messageData.image = {
        mimeType: image.mimeType,
        url: image.url || null
      };
    };
    
    await addDoc(collection(db, path), messageData);
    
    // Update chat session timestamp
    await setDoc(doc(db, 'chats', chatId), {
      updatedAt: serverTimestamp()
    }, { merge: true });
    
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.CREATE, path);
  }
}

export async function getUserChats(userId: string) {
  const path = 'chats';
  try {
    const q = query(
      collection(db, path), 
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatSession));
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.LIST, path);
  }
}

export async function getChatMessages(chatId: string) {
  const path = `chats/${chatId}/messages`;
  try {
    const q = query(collection(db, path), orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.LIST, path);
  }
}

export async function getAllChats() {
  const path = 'chats';
  try {
    const q = query(collection(db, path), orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatSession));
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.LIST, path);
  }
}

export async function getAllUsers() {
  const path = 'users';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, FirestoreOperation.LIST, path);
  }
}
