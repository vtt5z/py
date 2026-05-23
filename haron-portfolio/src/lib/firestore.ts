import { Timestamp, addDoc, collection, getDocs, query, where } from "firebase/firestore";

import { getFirebaseFirestore } from "@/lib/firebase";

export interface Upload {
  id: string;
  userId: string;
  fileName: string;
  size: number;
  mimeType: string;
  storageRef: string;
  uploadedAt: Date;
  isPublic: boolean;
}

export async function recordFileUpload(
  userId: string,
  fileName: string,
  size: number,
  mimeType: string,
  storageRef: string,
): Promise<Upload> {
  if (!userId.trim()) throw new Error("Missing authenticated user id");

  const db = getFirebaseFirestore();
  const docRef = await addDoc(collection(db, "uploads"), {
    userId,
    fileName,
    size,
    mimeType,
    storageRef,
    uploadedAt: Timestamp.now(),
    isPublic: false,
  });

  return {
    id: docRef.id,
    userId,
    fileName,
    size,
    mimeType,
    storageRef,
    uploadedAt: new Date(),
    isPublic: false,
  };
}

export async function getUserUploads(userId: string): Promise<Upload[]> {
  if (!userId.trim()) throw new Error("Missing authenticated user id");

  const db = getFirebaseFirestore();
  const snapshot = await getDocs(query(collection(db, "uploads"), where("userId", "==", userId)));

  return snapshot.docs.map((uploadDoc) => {
    const data = uploadDoc.data();
    return {
      id: uploadDoc.id,
      userId: data.userId,
      fileName: data.fileName,
      size: data.size,
      mimeType: data.mimeType,
      storageRef: data.storageRef,
      uploadedAt: data.uploadedAt?.toDate() || new Date(),
      isPublic: data.isPublic,
    };
  });
}
