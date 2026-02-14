
import React, { useEffect } from 'react';
import Button from '../components/Button';
import { updateSEO } from '../utils/seo';

const Home: React.FC = () => {
  useEffect(() => {
    updateSEO({}); 
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:px-12 md:py-48 flex flex-col items-center text-center w-full bg-grid overflow-hidden border-b-4 border-black">
        <div className="absolute top-10 right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-black/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-block px-4 py-1 bg-black text-white text-xs font-black uppercase tracking-widest mb-8 border-2 border-black neo-shadow animate-in fade-in slide-in-from-top-4">
            Version 2.0 Now Live
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-8 text-black uppercase animate-in fade-in slide-in-from-bottom-8 duration-700">
            WRITE THE <br />
            <span className="text-orange-500 text-stroke-black">FUTURE.</span>
          </h1>
          <p className="text-xl md:text-3xl font-black text-black mb-12 tracking-tight uppercase max-w-3xl mx-auto leading-tight">
            THE DEFINITIVE WORKSPACE FOR VISIONARY DRAFTING. <span className="text-orange-500 underline decoration-4 underline-offset-8">NO BOUNDARIES.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center">
            <Button variant="primary" className="text-xl px-12 py-5" onClick={() => window.location.hash = '#/register'}>
              Get Started For Free
            </Button>
            <Button variant="outline" className="text-xl px-12 py-5 bg-white" onClick={() => window.location.hash = '#/blog'}>
              Explore Blog
            </Button>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="hidden lg:block absolute left-10 top-1/2 -translate-y-1/2 -rotate-90">
          <span className="text-[10px] font-black uppercase tracking-[1em] text-gray-300">SYSTEM.DRAFT.EXECUTE</span>
        </div>
      </section>

      {/* Featured Insight Section */}
      <section className="bg-white py-32 px-6 md:px-12 border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute -top-6 -left-6 w-full h-full border-4 border-orange-500 z-0 bg-orange-50 transition-all group-hover:translate-x-2 group-hover:translate-y-2"></div>
              <div className="relative z-10 aspect-video overflow-hidden border-4 border-black neo-shadow-lg bg-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop" 
                  alt="Shadow of Influence" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-black text-white px-8 py-4 font-black uppercase tracking-widest text-xs z-20 border-2 border-white">
                Featured Analysis
              </div>
            </div>
            
            <div className="animate-in slide-in-from-right-8 duration-700">
              <div className="inline-block px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6 border-2 border-black neo-shadow">
                CRITICAL REVIEW
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 uppercase text-black">
                The Shadow of <br/><span className="text-orange-500">Influence:</span>
              </h2>
              <p className="text-lg text-gray-600 font-medium mb-10 leading-relaxed italic border-l-4 border-black pl-6">
                "The name Jeffrey Epstein has become synonymous with a dark intersection of wealth, power, and systemic failure. Even years after his death, millions of documents continue to peel back the layers."
              </p>
              <div className="space-y-4 mb-12">
                {[
                  "Recent release of 3 million documents",
                  "Examination of elite social and academic networks",
                  "The ongoing quest for systemic accountability"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-orange-500 border-2 border-black rotate-45"></div>
                    <p className="text-sm font-black text-black uppercase tracking-tight">{item}</p>
                  </div>
                ))}
              </div>
              <Button variant="primary" className="px-10 py-4" onClick={() => window.location.hash = '#/blog/shadow-of-influence'}>
                Read Complete Draft
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-grid py-32 px-6 md:px-12 border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase text-black leading-none">THE PAGEDRAFT <br /><span className="text-orange-500">STANDARD.</span></h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mt-6">Optimized for visionaries and technical minds.</p>
            </div>
            <div className="hidden md:block w-32 h-1 bg-black"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-black bg-black neo-shadow-lg">
            {[
              {
                id: '01',
                title: 'Lightning Fast',
                desc: 'Powered by Cloudflare and React 19, ensuring your content reaches your audience instantly across the globe.'
              },
              {
                id: '02',
                title: 'Secure Storage',
                desc: 'Industry-standard authentication and encrypted storage via PocketBase integration for maximum privacy.'
              },
              {
                id: '03',
                title: 'Modern Design',
                desc: 'A professional interface that puts your content front and center with elegant typography and clean layouts.'
              }
            ].map((feature) => (
              <div key={feature.id} className="p-12 bg-white border-2 border-black group hover:bg-orange-500 transition-colors">
                <div className="w-16 h-16 bg-black mb-8 flex items-center justify-center text-orange-500 font-black text-3xl group-hover:bg-white transition-colors border-2 border-black">
                  {feature.id}
                </div>
                <h3 className="text-3xl font-black mb-6 uppercase tracking-tighter text-black group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed group-hover:text-black transition-colors">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 px-6 md:px-12 text-center bg-orange-500 flex flex-col items-center justify-center border-b-4 border-black">
        <h2 className="text-6xl md:text-9xl font-black mb-16 tracking-tighter uppercase text-black max-w-5xl leading-[0.85] animate-pulse">
          READY TO START YOUR <span className="text-white text-stroke-black">DRAFT?</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-8 w-full max-w-2xl mx-auto">
          <Button 
            variant="primary" 
            className="px-12 py-10 text-3xl w-full border-4" 
            onClick={() => window.location.hash = '#/register'}
          >
            JOIN THE ELITE
          </Button>
        </div>
        <p className="mt-12 text-sm font-black uppercase tracking-[0.5em] text-black/40">Secured with enterprise grade encryption</p>
      </section>
    </div>
  );
};

export default Home;
