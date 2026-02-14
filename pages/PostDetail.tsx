
import React, { useEffect, useState, useCallback } from 'react';
import { pb, blogService, getFileUrl } from '../services/pocketbase';
import { Post, Comment } from '../types';
import { updateSEO } from '../utils/seo';
import Button from '../components/Button';
import Logo from '../components/Logo';

interface PostDetailProps {
  slug: string;
}

// Static fallback for specific featured content
const STATIC_POSTS: Record<string, Partial<Post>> = {
  'shadow-of-influence': {
    id: 'static-epstein',
    title: 'The Shadow of Influence: Unpacking the Jeffrey Epstein Legacy',
    excerpt: 'The name Jeffrey Epstein has become synonymous with a dark intersection of wealth, power, and systemic failure. Even years after his death, the release of millions of documents continues to peel back the layers of his global network.',
    content: `
      <p>The name Jeffrey Epstein has become synonymous with a dark intersection of wealth, power, and systemic failure. Even years after his death, the release of millions of documents continues to peel back the layers of his global network. This blog post explores the recent developments and the enduring questions surrounding the disgraced financier.</p>
      
      <h3>The Recent Release of the "Epstein Files"</h3>
      <p>In late January and early February 2026, the U.S. Department of Justice released over 3 million pages of documents, photos, and videos related to the Epstein investigation. This massive disclosure, mandated by recent Congressional legislation, has reignited public scrutiny of the high-profile figures who once inhabited Epstein’s orbit.</p>
      <ul>
        <li><strong>Key Findings:</strong> While appearing in these files does not inherently imply wrongdoing, they paint a picture of Epstein’s vast influence long after his 2008 sex offender conviction.</li>
        <li><strong>Victim Protection:</strong> The Department of Justice has withheld material that would identify victims and recently took down thousands of documents that mistakenly included such information.</li>
      </ul>

      <h3>A Network Built on Prestige</h3>
      <p>Epstein didn't just accumulate money; he accumulated people. His strategy involved cultivating relationships with elite circles in politics, science, and business.</p>
      <ul>
        <li><strong>Academic Influence:</strong> Schools like Harvard University and MIT have faced intense internal investigations regarding Epstein’s donations and his presence on their campuses.</li>
        <li><strong>Scientific "Rebels":</strong> Epstein sought out prominent scientists, often funding those who challenged conventional norms, a move some experts suggest was an attempt to buy intellectual legitimacy.</li>
        <li><strong>Political Connections:</strong> Recent email releases have highlighted his past associations with figures across the political spectrum, including former President Donald Trump and various international dignitaries.</li>
      </ul>

      <h3>The Quest for Accountability</h3>
      <p>For the survivors, the steady "trickle of information" is a double-edged sword. While transparency is vital, many argue that full accountability remains elusive.</p>
      <ul>
        <li><strong>The "Sweetheart Deal":</strong> Much of the current public anger stems from the 2008 non-prosecution agreement that allowed Epstein to serve a minimal state sentence rather than face federal charges.</li>
        <li><strong>Ghislaine Maxwell:</strong> While Epstein avoided trial through his 2019 suicide, his primary associate, Ghislaine Maxwell, was convicted in 2021 for her role in the sex-trafficking operation.</li>
        <li><strong>Financial Restitution:</strong> Since his death, a victim compensation fund has paid out over $120 million to more than 100 survivors.</li>
      </ul>

      <h3>Why It Still Matters</h3>
      <p>The Epstein saga is more than a true-crime story; it is a case study in how wealth can be used to bypass the legal system. As researchers and journalists continue to sift through the millions of new documents, the goal remains the same: ensuring that such a "two-tiered system of justice" is never allowed to operate in the shadows again.</p>
      
      <p>For more detailed information on the case, you can visit the <a href="https://www.justice.gov" target="_blank" rel="noopener noreferrer" style="color: #f97316; font-weight: bold; text-decoration: underline;">Official U.S. Department of Justice Website</a> for ongoing updates on public file releases.</p>
    `,
    tags: ['Analysis', 'Legacy', 'Systemic Failure'],
    created: '2026-02-15T12:00:00Z',
    image: '', 
    expand: {
      author: {
        id: 'staff',
        name: 'PageDraft Editorial',
        email: 'editorial@pagedraft.dev',
        username: 'editorial',
        avatar: ''
      }
    }
  } as any
};

const PostDetail: React.FC<PostDetailProps> = ({ slug }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Comment states
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const initPostData = useCallback(async (data: Post) => {
    updateSEO({ title: data.title, description: data.excerpt });
    
    try {
      const count = await blogService.getLikeCount(data.id);
      setLikeCount(count);
      const hasLiked = await blogService.hasUserLiked(data.id);
      setLiked(hasLiked);
      
      // Initial comments fetch
      const result = await blogService.getComments(data.id, 1);
      setComments(result.items as any);
    } catch (e) {
      console.warn("Post detail data initialization partial failure.");
    }
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await blogService.getPostBySlug(slug);
        setPost(data as any);
        await initPostData(data as any);
      } catch (err) {
        if (STATIC_POSTS[slug]) {
          const staticData = STATIC_POSTS[slug] as Post;
          setPost(staticData);
          await initPostData(staticData);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, initPostData]);

  const handleToggleLike = async () => {
    if (!pb.authStore.isValid) {
      window.location.hash = '#/login';
      return;
    }
    if (!post || post.id === 'static-epstein') {
      alert("Voting is reserved for platform-hosted drafts.");
      return;
    }
    try {
      const result = await blogService.toggleLike(post.id);
      setLiked(result);
      setLikeCount(prev => result ? prev + 1 : prev - 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;
    if (post.id === 'static-epstein') {
      alert("Discussion for this featured archival piece is restricted.");
      return;
    }
    try {
      await blogService.createComment(post.id, newComment);
      setNewComment('');
      // Optimistically fetch/refresh comments
      const result = await blogService.getComments(post.id, 1);
      setComments(result.items as any);
    } catch (err) {
      alert("Failed to post comment.");
    }
  };

  if (loading) return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="relative mb-8">
        <Logo size={60} className="text-black animate-bounce" />
        <div className="absolute inset-0 bg-orange-500/20 blur-xl animate-pulse rounded-full"></div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Loading Technical Draft...</p>
    </div>
  );

  if (error || !post) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-20 text-center">
      <div className="w-24 h-24 bg-black flex items-center justify-center text-orange-500 font-black text-4xl mb-8">404</div>
      <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Draft Sequence Missing</h2>
      <p className="text-gray-500 mb-8 max-w-sm">The requested draft could not be retrieved from the central archive.</p>
      <Button variant="outline" className="px-8" onClick={() => window.location.hash = '#/blog'}>Return to Archive</Button>
    </div>
  );

  const displayImage = post.image ? getFileUrl(post, post.image) : 
    (slug === 'shadow-of-influence' ? "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop" : "");

  return (
    <article className="bg-white min-h-screen pb-24 animate-in fade-in duration-700">
      <header className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {post.tags?.map(tag => (
              <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-orange-500 border-2 border-orange-500 px-3 py-1 bg-orange-50/50">
                {tag}
              </span>
            ))}
          </div>
          <button 
            onClick={handleToggleLike}
            className={`flex items-center gap-3 px-5 py-2 border-2 font-black transition-all ${liked ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(249,115,22,1)]' : 'bg-white text-black border-black hover:bg-black hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${liked ? 'fill-orange-500 text-orange-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm">{likeCount}</span>
          </button>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-10 uppercase text-black">
          {post.title}
        </h1>
        
        <p className="text-xl md:text-3xl text-gray-400 font-medium mb-12 italic leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-6 py-10 border-y-4 border-black mb-16">
          <div className="w-16 h-16 bg-black flex items-center justify-center text-white font-black rounded-none border-2 border-orange-500 shadow-[4px_4px_0px_0px_rgba(249,115,22,1)]">
            {post.expand?.author?.name?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Drafted By</p>
            <p className="text-xl font-black text-black uppercase tracking-tight">{post.expand?.author?.name || 'PageDraft Editorial'}</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Release Date</p>
            <p className="text-sm font-black text-black uppercase">{new Date(post.created).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
          </div>
        </div>

        {displayImage && (
          <div className="w-full aspect-video overflow-hidden border-2 border-black shadow-[20px_20px_0px_0px_rgba(249,115,22,1)]">
            <img src={displayImage} alt={post.title} className="w-full h-full object-cover grayscale-0" />
          </div>
        )}
      </header>

      <div className="max-w-3xl mx-auto px-6">
        <div 
          className="prose prose-xl prose-orange max-w-none text-gray-900 leading-relaxed mb-24 font-serif selection:bg-orange-500 selection:text-white"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Action Section */}
        <div className="py-20 border-t-4 border-black mb-24 flex flex-col items-center text-center bg-gray-50/50">
          <h4 className="text-3xl font-black uppercase tracking-tighter mb-8">Support this Analysis</h4>
          <button 
            onClick={handleToggleLike}
            className={`group relative flex items-center gap-6 px-12 py-8 border-4 transition-all duration-300 font-black text-2xl uppercase tracking-tighter ${liked ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-black hover:text-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 transform transition-transform group-hover:scale-110 ${liked ? 'fill-orange-500 text-orange-500' : 'text-current'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{liked ? 'Upvoted' : 'Upvote Draft'}</span>
            <span className="bg-orange-500 text-white px-4 py-1 text-xl ml-2">{likeCount}</span>
          </button>
          {!pb.authStore.isValid && (
            <p className="mt-8 text-xs font-black uppercase tracking-widest text-orange-500">Authentication required for strategic voting</p>
          )}
        </div>
        
        <section className="pt-20">
          <div className="flex items-center justify-between mb-16 border-b-2 border-black pb-4">
            <h3 className="text-4xl font-black uppercase tracking-tighter text-black">
              Discussions <span className="text-orange-500">({comments.length})</span>
            </h3>
            <div className="h-1 flex-1 bg-black/5 mx-8"></div>
          </div>

          {post.id === 'static-epstein' ? (
             <div className="bg-orange-50 p-12 border-2 border-black text-center mb-16 uppercase font-black text-xs tracking-widest text-black shadow-[10px_10px_0px_0px_rgba(249,115,22,1)]">
              Discussion for this featured archival piece is currently locked.
            </div>
          ) : pb.authStore.isValid ? (
            <form onSubmit={handlePostComment} className="mb-24">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Participate in the draft analysis..."
                className="w-full px-8 py-6 border-2 border-black focus:border-orange-500 outline-none transition-all min-h-[160px] mb-6 font-bold text-xl placeholder:text-gray-300"
                required
              />
              <Button variant="primary" className="px-16 h-16 text-lg">
                Submit Technical Feedback
              </Button>
            </form>
          ) : (
            <div className="bg-gray-50 p-16 border-4 border-dashed border-gray-200 text-center mb-20">
              <p className="uppercase font-black text-xs tracking-[0.3em] text-gray-400 mb-6">Login required to join the technical discussion</p>
              <Button variant="outline" className="px-10 h-12 text-xs" onClick={() => window.location.hash = '#/login'}>Authenticate</Button>
            </div>
          )}

          <div className="space-y-16">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-8 group animate-in slide-in-from-bottom-4">
                <div className="w-14 h-14 flex-shrink-0 bg-black flex items-center justify-center text-white font-black border-2 border-transparent group-hover:border-orange-500 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  {comment.expand?.user?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1 pb-12 border-b-2 border-gray-100 last:border-0">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-black uppercase tracking-tighter text-black">
                      {comment.expand?.user?.name || 'Anonymous User'}
                    </h4>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      {new Date(comment.created).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed font-medium">{comment.content}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && post.id !== 'static-epstein' && (
              <p className="text-center text-gray-400 font-black uppercase tracking-widest py-10">No discussion entries recorded yet.</p>
            )}
          </div>
        </section>
      </div>
    </article>
  );
};

export default PostDetail;
