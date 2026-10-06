import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteField,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { GradingScore, SubmissionDoc, KelasType } from '../types/lkpd';
import { createResetSubmission } from '../constants/lkpdData';

const COLLECTION_NAME = 'submissions';

export function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) {
    return null as any;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as any;
  }
  const cleanObj: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleanObj[key] = sanitizeForFirestore(value);
    }
  }
  return cleanObj;
}

export async function getSubmission(id: string): Promise<SubmissionDoc | null> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SubmissionDoc;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function saveSubmission(sub: SubmissionDoc): Promise<void> {
  const path = `${COLLECTION_NAME}/${sub.id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, sub.id);
    const updatedData: SubmissionDoc = {
      ...sub,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, sanitizeForFirestore(updatedData), { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function submitFinalSubmission(sub: SubmissionDoc): Promise<void> {
  const path = `${COLLECTION_NAME}/${sub.id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, sub.id);
    const finalData: SubmissionDoc = {
      ...sub,
      status: 'sudah_mengumpulkan',
      progressPercent: 100,
      currentStep: 8, // Selesai
      submittedAt: sub.submittedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, sanitizeForFirestore(finalData), { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function gradeSubmission(
  id: string,
  score: GradingScore,
  gradedBy: string = 'Guru Geografi'
): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updatePayload: Partial<SubmissionDoc> = {
      status: 'sudah_dinilai',
      score: {
        ...score,
        gradedBy,
        gradedAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, sanitizeForFirestore(updatePayload));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function reopenSubmission(id: string): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updatePayload: Partial<SubmissionDoc> = {
      status: 'sedang_mengerjakan',
      currentStep: 3, // return to working activities
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, sanitizeForFirestore(updatePayload));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function resetSubmission(
  id: string,
  kelas: KelasType,
  groupNumber: number,
  groupName?: string,
  members?: string[]
): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const resetData = createResetSubmission(kelas, groupNumber, groupName, members);
    const cleanPayload = sanitizeForFirestore({
      ...resetData,
      score: deleteField(),
      submittedAt: deleteField(),
    });
    await setDoc(docRef, cleanPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getAllSubmissionsOnce(): Promise<SubmissionDoc[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snap = await getDocs(colRef);
    const items: SubmissionDoc[] = [];
    snap.forEach((d) => {
      items.push(d.data() as SubmissionDoc);
    });
    items.sort((a, b) => {
      if (a.kelas === b.kelas) {
        return a.groupNumber - b.groupNumber;
      }
      return a.kelas.localeCompare(b.kelas);
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    return [];
  }
}

export function listenToSubmission(
  id: string,
  onUpdate: (data: SubmissionDoc | null) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const path = `${COLLECTION_NAME}/${id}`;
  const docRef = doc(db, COLLECTION_NAME, id);

  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as SubmissionDoc);
      } else {
        onUpdate(null);
      }
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function listenToAllSubmissions(
  onUpdate: (subs: SubmissionDoc[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const colRef = collection(db, COLLECTION_NAME);

  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: SubmissionDoc[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as SubmissionDoc);
      });
      // Sort by class then group number
      items.sort((a, b) => {
        if (a.kelas === b.kelas) {
          return a.groupNumber - b.groupNumber;
        }
        return a.kelas.localeCompare(b.kelas);
      });
      onUpdate(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    }
  );
}
