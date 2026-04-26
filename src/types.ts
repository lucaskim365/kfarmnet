export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface Message {
  id?: string;
  role: "user" | "model";
  text: string;
  image?: {
    mimeType: string;
    data?: string; // base64 for immediate API calls
    url?: string;  // storage URL for permanent history
  };
  createdAt?: any; // Firestore Timestamp or Date
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  updatedAt: any;
  createdAt: any;
}
