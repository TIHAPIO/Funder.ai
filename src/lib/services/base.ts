import { 
  collection, 
  query, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  where,
  orderBy,
  Timestamp,
  writeBatch,
  DocumentData,
  QueryConstraint,
  limit,
  startAfter,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { validateAuthState } from '../auth-utils';

export class BaseFirestoreService<T extends { id: number }> {
  protected collectionName: string;
  protected pageSize: number = 20;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected async getPage(
    pageNumber: number = 1, 
    queryConstraints: QueryConstraint[] = []
  ): Promise<{
    items: T[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    // Ensure user is authenticated before proceeding
    await validateAuthState();

    const collectionRef = collection(db, this.collectionName);
    
    // Add pagination constraints
    const paginatedConstraints = [
      ...queryConstraints,
      orderBy('id'),
      limit(this.pageSize)
    ];

    try {
      const q = query(collectionRef, ...paginatedConstraints);
      const querySnapshot = await getDocs(q);
      
      const items = querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data()
      } as T));

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      const hasMore = querySnapshot.docs.length === this.pageSize;

      return {
        items,
        lastDoc,
        hasMore
      };
    } catch (error) {
      console.error(`Error fetching ${this.collectionName}:`, error);
      throw new Error(`Failed to fetch ${this.collectionName}. Please ensure you're authenticated and try again.`);
    }
  }

  protected async getNextPage(
    lastDoc: QueryDocumentSnapshot,
    queryConstraints: QueryConstraint[] = []
  ): Promise<{
    items: T[];
    lastDoc: QueryDocumentSnapshot | null;
    hasMore: boolean;
  }> {
    await validateAuthState();

    const collectionRef = collection(db, this.collectionName);
    
    const paginatedConstraints = [
      ...queryConstraints,
      orderBy('id'),
      startAfter(lastDoc),
      limit(this.pageSize)
    ];

    try {
      const q = query(collectionRef, ...paginatedConstraints);
      const querySnapshot = await getDocs(q);
      
      const items = querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data()
      } as T));

      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      const hasMore = querySnapshot.docs.length === this.pageSize;

      return {
        items,
        lastDoc: newLastDoc,
        hasMore
      };
    } catch (error) {
      console.error(`Error fetching next page of ${this.collectionName}:`, error);
      throw new Error(`Failed to fetch next page. Please ensure you're authenticated and try again.`);
    }
  }

  protected async getById(id: number): Promise<T | null> {
    await validateAuthState();

    try {
      const docRef = doc(db, this.collectionName, id.toString());
      const docSnap = await getDocs(query(collection(db, this.collectionName), where('id', '==', id)));
      
      if (docSnap.empty) return null;
      return { id, ...docSnap.docs[0].data() } as T;
    } catch (error) {
      console.error(`Error fetching ${this.collectionName} by ID:`, error);
      throw new Error(`Failed to fetch ${this.collectionName}. Please ensure you're authenticated and try again.`);
    }
  }

  protected async add(data: Omit<T, 'id'>): Promise<string> {
    await validateAuthState();

    try {
      const collectionRef = collection(db, this.collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error adding ${this.collectionName}:`, error);
      throw new Error(`Failed to add ${this.collectionName}. Please ensure you're authenticated and try again.`);
    }
  }

  protected async update(id: number, updates: Partial<T>): Promise<void> {
    await validateAuthState();

    try {
      const docRef = doc(db, this.collectionName, id.toString());
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error);
      throw new Error(`Failed to update ${this.collectionName}. Please ensure you're authenticated and try again.`);
    }
  }

  protected async delete(id: number): Promise<void> {
    await validateAuthState();

    try {
      const docRef = doc(db, this.collectionName, id.toString());
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error);
      throw new Error(`Failed to delete ${this.collectionName}. Please ensure you're authenticated and try again.`);
    }
  }

  public async bulkAdd(items: Omit<T, 'id'>[]): Promise<void> {
    await validateAuthState();

    try {
      const batch = writeBatch(db);
      const collectionRef = collection(db, this.collectionName);
      
      items.forEach((item, index) => {
        const docRef = doc(collectionRef);
        batch.set(docRef, {
          ...item,
          id: index + 1,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error(`Error bulk adding ${this.collectionName}:`, error);
      throw new Error(`Failed to bulk add ${this.collectionName}. Please ensure you're authenticated and try again.`);
    }
  }

  protected async search(field: keyof T, value: any): Promise<T[]> {
    await validateAuthState();

    try {
      const collectionRef = collection(db, this.collectionName);
      const q = query(
        collectionRef,
        where(field as string, '>=', value),
        where(field as string, '<=', value + '\uf8ff'),
        limit(this.pageSize)
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: parseInt(doc.id),
        ...doc.data()
      } as T));
    } catch (error) {
      console.error(`Error searching ${this.collectionName}:`, error);
      throw new Error(`Failed to search ${this.collectionName}. Please ensure you're authenticated and try again.`);
    }
  }
}
