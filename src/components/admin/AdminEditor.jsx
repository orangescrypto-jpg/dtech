import { useState } from 'react';
import { ArrowLeft, Save, Loader2, LinkIcon } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QUILL_MODULES = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['blockquote', 'code-block'],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'link', 'image', 'blockquote', 'code-block',
];

const emptyForm = { title: '', author: '', excerpt: '', content: '', coverUrl: '' };

export default function AdminEditor({ post, onSave, onBack }) {
  const [formData, setFormData] = useState(
    post
      ? { title: post.title, author: post.author, excerpt: post.excerpt, content: post.content || '', coverUrl: post.image }
      : emptyForm
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.coverUrl) {
      alert('Please fill out Title, Cover Image URL, and Content.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSave({
        title: formData.title,
        author: formData.author || 'DTECHNURSE Admin',
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.coverUrl,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      }, post?.id);
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Failed to save post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-container py-12 md:py-16 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="text-brand-gray hover:text-brand-dark">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold">{post ? 'Edit Post' : 'Create Post'}</h1>
          <p className="text-brand-gray mt-1">
            {post ? 'Modify your existing article.' : 'Write a new article for DTECHNURSE'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-10 rounded-2xl border border-brand-border shadow-sm">

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
            <LinkIcon size={16} /> Cover Image URL
          </label>
          <input
            type="url"
            name="coverUrl"
            value={formData.coverUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none mb-4"
            placeholder="https://images.unsplash.com/photo-xxxxx..."
            required
          />
          <div className="border-2 border-dashed border-brand-border rounded-xl h-64 flex items-center justify-center bg-gray-50 overflow-hidden">
            {formData.coverUrl ? (
              <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" onError={(e) => (e.target.src = '')} />
            ) : (
              <p className="text-brand-gray text-sm">Paste a URL above to see a preview</p>
            )}
          </div>
        </div>

        {/* Title & Author */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Blog Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none"
              placeholder="e.g., The Future of Nursing..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Author Name</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none"
              placeholder="e.g., Jane Doe, RN"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold mb-2">Short Excerpt</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none resize-none"
            placeholder="A brief summary..."
            required
          />
        </div>

        {/* Rich Text Editor (react-quill) */}
        <div>
          <label className="block text-sm font-semibold mb-2">Content</label>
          <div className="rounded-lg border border-brand-border overflow-hidden">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(val) => setFormData({ ...formData, content: val })}
              modules={QUILL_MODULES}
              formats={QUILL_FORMATS}
              className="bg-white"
              style={{ minHeight: '320px' }}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-4 border-t border-brand-border">
          {isSubmitting && (
            <div className="flex items-center gap-2 text-sm text-brand-blue font-medium">
              <Loader2 className="animate-spin" size={18} /> Saving...
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary ml-auto flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isSubmitting ? 'Saving...' : post ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
