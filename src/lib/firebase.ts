import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const dbId = (firebaseConfig as any).firestoreDatabaseId || '(default)';
console.log(`Initializing Firestore with database: ${dbId}`);

const app = initializeApp(firebaseConfig);

// Use custom DB ID only if valid, otherwise fallback to default
const firestoreDbId = (firebaseConfig as any).firestoreDatabaseId;
export const db = (firestoreDbId && firestoreDbId !== "(default)") 
  ? getFirestore(app, firestoreDbId) 
  : getFirestore(app);

export const auth = getAuth(app);

// Test connection and log specific error
async function testConnection() {
  try {
    // Try a simple read to verify connection
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection verified.");
  } catch (error: any) {
    console.warn("Firestore connection check failed (this is expected if setup is incomplete):", error.message);
    if (error?.code === 'failed-precondition' || error?.message?.includes('offline')) {
       console.error("Firebase might be offline or misconfigured.");
    }
  }
}
testConnection();

// Error handling as per instructions
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
