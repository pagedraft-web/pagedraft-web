
import React, { useState, useEffect, useRef } from 'react';
import { pb, blogService } from '../services/pocketbase';
import { Post, PostStatus } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';

declare const Quill: any;

interface PostEditorProps {
  editId?: string;
}

const CreatePost: React.FC<PostEditorProps> = ({ editId }) => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<PostStatus>('draft');
  const [scheduledDate, setScheduledDate] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!editId);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<any>(null);

  useEffect(() => {
    if (!pb.authStore.isValid) {
      window.location.hash = '#/login';
      return;
    }

    if (editId) {
      const fetchPost = async () => {
        try {
          const post = await blogService.getPostBySlug(editId) as Post;
          setTitle(post.title);
          setExcerpt(post.excerpt);
          setContent(post.content);
          setTags(post.tags?.join(', ') || '');
          setStatus(post.status);
          if (post.publishedAt) {
            setScheduledDate(new Date(post.publishedAt).toISOString().slice(0, 16));
          }
        } catch (err) {
          setError('Failed to load post for editing.');
        } finally {
          setFetching(false);
        }
      };
      fetchPost();
    }
  }, [editId]);

  useEffect(() => {
    // Safety check for Quill availability
    if (typeof Quill === 'undefined') return;

    if (!showPreview && editorRef.current && !fetching) {
      // Clear container to prevent Quill from double-mounting if re-initializing after preview
      if (!quillInstance.current) {
        editorRef.current.innerHTML = '';
        quillInstance.current = new Quill(editorRef.current, {
          theme: 'snow',
          placeholder: 'Craft your draft here...',
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'image'],
              ['clean']
            ]
          }
        });

        if (content) {
          quillInstance.current.root.innerHTML = content;
        }

        quillInstance.current.on('text-change', () => {
          setContent(quillInstance.current.root.innerHTML);
        });
      }
    }

    return () => {
      // In a more complex app we'd clean up the Quill instance, but here clearing internal state is enough
      if (showPreview) {
        quillInstance.current = null;
      }
    };
  }, [showPreview, fetching]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    const isContentEmpty = !content || content === '<p><br></p>';

    if (!title || !excerpt || isContentEmpty) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (status === 'scheduled' && !scheduledDate) {
      setError('Please select a release date for scheduled drafts.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('excerpt', excerpt);
      formData.append('content', content);
      formData.append('author', pb.authStore.model?.id || '');
      formData.append('status', status);
      
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      tagArray.forEach(tag => formData.append('tags', tag));

      if (status === 'scheduled') {
        formData.append('publishedAt', new Date(scheduledDate).toISOString());
      } else if (status === 'published' && !editId) {
        formData.append('publishedAt', new Date().toISOString());
      }
      
      if (!editId) {
        const slug = title
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, '')
          .substring(0, 50) + '-' + Math.random().toString(36).substring(2, 7);
        formData.append('slug', slug);
      }
      
      if (image) {
        formData.append('image', image);
      }

      if (editId) {
        await blogService.updatePost(editId, formData);
      } else {
        await blogService.createPost(formData);
      }
      window.location.hash = '#/profile';
    } catch (err: any) {
      setError(err.message || 'Failed to save post.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-100 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
  );

  if (showPreview) {
    const previewTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    return (
      <div className="bg-white min-h-screen pb-20 animate-in fade-in duration-500">
        <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-md border-b border-black py-4 px-6 mb-12">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 border border-orange-200">Mode: {status}</span>
               <div className="hidden sm:flex gap-2">
                 {previewTags.map(t => <span key={t} className="text-[9px] font-bold text-gray-400 uppercase">#{t}</span>)}
               </div>
            </div>
            <Button variant="outline" className="px-6 py-2 h-10 text-xs" onClick={() => setShowPreview(false)}>
              Exit Preview
            </Button>
          </div>
        </div>
        <article className="max-w-3xl mx-auto px-6">
          <header className="mb-12">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase leading-[0.9] text-black">
              {title || 'Untitled Draft'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-medium mb-8 leading-relaxed italic">
              {excerpt || 'No summary provided.'}
            </p>
            <div 
              className="prose prose-lg prose-orange max-w-none text-gray-800 leading-relaxed font-serif"
              dangerouslySetInnerHTML={{ __html: content || '<p>Blank draft.</p>' }}
            />
          </header>
          <div className="mt-20 pt-10 border-t-4 border-black flex flex-col md:flex-row gap-4">
             <Button variant="primary" className="flex-1 h-14 text-lg" isLoading={loading} onClick={() => handleSubmit(null as any)}>
                Confirm & {editId ? 'Update' : 'Publish'}
             </Button>
             <Button variant="outline" className="px-12 h-14" onClick={() => setShowPreview(false)}>
                Back to Editor
             </Button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12 border-l-8 border-black pl-8">
        <h1 className="text-5xl font-black tracking-tighter mb-2 uppercase text-black">
          {editId ? 'Modify Draft' : 'New Entry'}
        </h1>
        <p className="text-orange-500 font-bold uppercase tracking-widest text-xs">Standard Operating Procedure: Content Creation</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 border-2 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
        {error && (
          <div className="mb-8 p-4 bg-orange-50 text-orange-800 text-sm border-l-4 border-orange-500 font-black uppercase tracking-tight">
            Error :: {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Input label="Draft Title" placeholder="Strategic Analysis..." value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Tags (Comma separated)" placeholder="technology, architecture, future" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        
        <Input label="Executive Summary" placeholder="A brief overview for the reader..." value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-black uppercase tracking-widest text-gray-700 mb-4">Lifecycle Status</label>
            <div className="flex flex-wrap gap-6">
              {['draft', 'published', 'scheduled'].map((s) => (
                <label key={s} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="status" 
                    value={s} 
                    checked={status === s} 
                    onChange={() => setStatus(s as PostStatus)}
                    className="accent-orange-500 w-5 h-5"
                  />
                  <span className={`text-xs font-black uppercase tracking-widest transition-colors ${status === s ? 'text-orange-500' : 'text-gray-400 group-hover:text-black'}`}>
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          {status === 'scheduled' && (
            <div className="animate-in slide-in-from-top-2">
              <label className="block text-sm font-black uppercase tracking-widest text-gray-700 mb-2">Release Timestamp</label>
              <input 
                type="datetime-local" 
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-black font-bold outline-none focus:border-orange-500 transition-colors"
                required
              />
            </div>
          )}
        </div>

        <div className="mb-12">
          <label className="block text-sm font-black uppercase tracking-widest text-gray-700 mb-2">Header Imagery</label>
          <div className="relative border-4 border-dashed border-gray-100 p-10 text-center hover:border-black transition-all bg-gray-50 group">
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mb-4 group-hover:text-orange-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {image ? (
                <span className="text-black font-black uppercase tracking-widest text-xs">File: {image.name}</span>
              ) : (
                <span className="text-gray-400 font-bold uppercase tracking-tighter text-xs">Select or Drop Document Cover</span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-12">
          <label className="block text-sm font-black uppercase tracking-widest text-gray-700 mb-4">Technical Content</label>
          <div className="rich-text-container border-2 border-black">
            <div ref={editorRef} className="bg-white" style={{ minHeight: '300px' }}></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <Button variant="primary" className="flex-1 h-16 text-xl" isLoading={loading} type="submit">
            {editId ? 'Commit Changes' : 'Execute Upload'}
          </Button>
          <Button variant="outline" className="px-12 h-16 text-lg" type="button" onClick={() => setShowPreview(true)}>
            Pre-Flight Check
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
