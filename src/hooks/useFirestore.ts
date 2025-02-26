import { useState, useEffect } from 'react';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

export function useFirestoreDoc(collection: string, id: string) {
  const [data, setData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const docRef = doc(db, collection, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setData(null);
        }
      } catch (err: any) {
        setError(err);
        console.error('Firestore Error:', err);
        toast.error(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collection, id]);

  return { data, loading, error };
}