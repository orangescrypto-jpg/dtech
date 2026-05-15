import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAdminPosts } from '../hooks/useAdminPosts';
import AdminLogin from '../components/admin/AdminLogin';
import AdminHeader from '../components/admin/AdminHeader';
import AdminPostList from '../components/admin/AdminPostList';
import AdminEditor from '../components/admin/AdminEditor';

export default function Admin() {
  const { user, loading: authLoading, logout } = useAuth();
  const { posts, loading: postsLoading, createPost, updatePost, deletePost } = useAdminPosts(user);
  const [view, setView] = useState('list');       // 'list' | 'editor'
  const [editingPost, setEditingPost] = useState(null);

  // ── Auth gate ────────────────────────────────────────────────────────────
  if (authLoading || !user) {
    return <AdminLogin authLoading={authLoading} />;
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleCreateNew = () => { setEditingPost(null); setView('editor'); };
  const handleEdit = (post)  => { setEditingPost(post); setView('editor'); };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      await deletePost(id);
    }
  };

  const handleSave = async (payload, id) => {
    if (id) {
      await updatePost(id, payload);
      alert('Post updated successfully!');
    } else {
      await createPost(payload);
      alert('Post published successfully!');
    }
    setView('list');
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      <AdminHeader user={user} onLogout={logout} />

      {view === 'list' ? (
        <AdminPostList
          posts={posts}
          loading={postsLoading}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <AdminEditor
          post={editingPost}
          onSave={handleSave}
          onBack={() => setView('list')}
        />
      )}
    </div>
  );
}
