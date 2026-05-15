import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminPostList({ posts, loading, onCreateNew, onEdit, onDelete }) {
  return (
    <div className="section-container py-12 md:py-16 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold">Manage Posts</h1>
          <p className="text-brand-gray mt-1">View, edit, or delete your articles.</p>
        </div>
        <button onClick={onCreateNew} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Post
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-brand-blue w-8 h-8" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-brand-border">
          <p className="text-brand-gray text-lg">No posts yet.</p>
          <button
            onClick={onCreateNew}
            className="text-brand-blue font-semibold mt-2 hover:underline"
          >
            Create your first post
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 bg-white border border-brand-border rounded-xl hover:shadow-sm transition-shadow"
            >
              <img
                src={post.image}
                alt=""
                className="w-16 h-16 rounded-lg object-cover hidden sm:block"
              />
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-brand-dark truncate">{post.title}</h3>
                <p className="text-sm text-brand-gray">
                  {post.date} • {post.author}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(post)}
                  className="p-2 text-brand-blue hover:bg-brand-light rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete(post.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
