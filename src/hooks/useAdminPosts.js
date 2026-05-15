import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const useAdminPosts = (user) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'blogPosts'));
      const data = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (user) fetchPosts(); }, [user, fetchPosts]);

  const createPost = async (payload) => {
    await addDoc(collection(db, 'blogPosts'), { ...payload, createdAt: serverTimestamp() });
    await fetchPosts();
  };

  const updatePost = async (id, payload) => {
    await updateDoc(doc(db, 'blogPosts', id), payload);
    await fetchPosts();
  };

  const deletePost = async (id) => {
    await deleteDoc(doc(db, 'blogPosts', id));
    await fetchPosts();
  };

  return { posts, loading, fetchPosts, createPost, updatePost, deletePost };
};
