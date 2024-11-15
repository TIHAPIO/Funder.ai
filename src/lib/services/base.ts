import { db } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  QueryConstraint,
  DocumentData
} from 'firebase/firestore';

export interface BaseDocument extends DocumentData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export class BaseFirestoreService<T extends BaseDocument> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected getCollection() {
    return collection(db, this.collectionName);
  }

  protected getDocRef(id: string) {
    return doc(db, this.collectionName, id);
  }

  async getById(id: string): Promise<T | null> {
    const docRef = this.getDocRef(id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id
    } as T;
  }

  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    const q = query(this.getCollection(), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as T));
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(this.getCollection(), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  }

  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const docRef = this.getDocRef(id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = this.getDocRef(id);
    await deleteDoc(docRef);
  }

  async getByField(fieldName: keyof Omit<T, 'id'>, value: any): Promise<T[]> {
    const q = query(this.getCollection(), where(fieldName as string, '==', value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as T));
  }
}
