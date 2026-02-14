
import React, { useEffect, useState } from 'react';
import { blogService, getFileUrl } from '../services/pocketbase';
import { Post } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';

const BlogCard: React.FC<{ post: Post }> = ({ post }) => (
  <a href={`#/blog/${post.slug || post.id}`} className="group block bg-white border-4 border-black neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200">
    <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100 border-b-4 border-black">
      <img 
        src={getFileUrl(post, post.image)} 
        alt={post.title} 
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
      />
    </div>
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {post.tags && post.tags.slice(0, 1).map(tag => (
            <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-white bg-black px-3 py-1 border-2 border-black">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {new Date(post.publishedAt || post.created).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      <h3 className="text-3xl font-black leading-none group-hover:text-orange-500 transition-colors mb-4 uppercase tracking-tighter">
        {post.title}
      </h3>
      <p className="text-gray-500 line-clamp-2 mb-8 font-medium text-sm leading-relaxed">
        {post.excerpt}
      </p>
      <div className="flex items-center gap-2">
        <span className="font-black text-xs uppercase tracking-widest border-b-4 border-black group-hover:border-orange-500 transition-colors pb-1">
          Read Draft
        </span>
      </div>
    </div>
  </a>
);

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await blogService.getPosts(1, 50, search, selectedTag);
        setPosts(response.items as any);
        
        if (search === '' && selectedTag === '') {
          const tags = new Set<string>();
          response.items.forEach((p: any) => p.tags?.forEach((t: string) => tags.add(t)));
          if (tags.size > 0) {
            setAllTags(Array.from(tags).sort());
          }
        }
      } catch (err) {
        console.error('Blog Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    const debounce = setTimeout(fetchPosts, 300);
    return () => clearTimeout(debounce);
  }, [search, selectedTag]);

  return (
    <div className="min-h-screen bg-grid">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1 bg-orange-500 text-white text-xs font-black uppercase tracking-widest mb-6 border-2 border-black neo-shadow">
              THE ARCHIVE
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.8] uppercase text-black">
              INSIGHTS & <br /> <span className="text-orange-500 text-stroke-black">DRAFTS.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 font-bold uppercase tracking-tight max-w-xl">Curation of professional thoughts, architecture, and future technology.</p>
          </div>
          <div className="w-full md:w-96">
            <div className="relative group">
              <input 
                type="text"
                placeholder="Search the archive..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full px-6 py-4 border-4 border-black neo-shadow focus:translate-x-1 focus:translate-y-1 focus:shadow-none outline-none font-black uppercase tracking-widest text-xs transition-all placeholder:text-gray-300"
              />
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-20">
          {/* Sidebar / Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-32 space-y-12">
              <section>
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-black mb-8 border-b-4 border-black pb-2">
                  Taxonomy
                </h4>
                <div className="flex flex-wrap lg:flex-col gap-4">
                  <button 
                    onClick={() => setSelectedTag('')}
                    className={`text-xs font-black uppercase tracking-widest px-6 py-3 border-2 text-left transition-all ${!selectedTag ? 'bg-black text-white border-black neo-shadow' : 'bg-white border-black hover:bg-orange-500 hover:text-white'}`}
                  >
                    All Documents
                  </button>
                  {allTags.map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`text-xs font-black uppercase tracking-widest px-6 py-3 border-2 text-left transition-all ${selectedTag === tag ? 'bg-orange-500 text-white border-black neo-shadow' : 'bg-white border-black hover:bg-black hover:text-white'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </section>

              <div className="bg-black p-8 border-4 border-black neo-shadow text-white">
                <h5 className="font-black uppercase text-xs tracking-widest mb-4">Newsletter</h5>
                <p className="text-[10px] font-medium opacity-60 mb-6 leading-relaxed">STAY SYNCED WITH OUR LATEST ARCHITECTURAL RELEASES.</p>
                <input className="w-full bg-white/10 border-2 border-white/20 p-3 mb-4 outline-none text-xs font-black uppercase tracking-widest focus:border-orange-500" placeholder="EMAIL" />
                <Button variant="secondary" fullWidth className="text-xs border-2 border-black">Subscribe</Button>
              </div>
            </div>
          </aside>

          {/* Post Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex flex-col border-4 border-black p-4 animate-pulse">
                    <div className="aspect-video bg-gray-100 mb-6 border-2 border-black"></div>
                    <div className="h-4 bg-gray-100 w-1/4 mb-4"></div>
                    <div className="h-10 bg-gray-100 w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {posts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-40 bg-white border-4 border-black neo-shadow flex flex-col items-center">
                <div className="w-32 h-32 bg-orange-500 border-4 border-black flex items-center justify-center mb-10 neo-shadow">
                  <span className="text-white font-black text-6xl">?</span>
                </div>
                <p className="text-black font-black uppercase tracking-widest text-2xl mb-4">No drafts located.</p>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-10">REFINE YOUR STRATEGIC SEARCH PARAMETERS.</p>
                <Button 
                  onClick={() => {setSearch(''); setSelectedTag('')}} 
                  variant="primary"
                  className="px-10"
                >
                  Reset Stream
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
