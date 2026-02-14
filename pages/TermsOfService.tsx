
import React, { useEffect } from 'react';
import { updateSEO } from '../utils/seo';

const TermsOfService: React.FC = () => {
  useEffect(() => {
    updateSEO({ title: 'Terms of Service', description: 'Legal guidelines for the PageDraft platform.' });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
      <header className="mb-20 border-l-8 border-black pl-8">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-black leading-none mb-4">
          TERMS OF <br /> <span className="text-orange-500">SERVICE</span>
        </h1>
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Last Updated: February 24, 2026</p>
      </header>

      <div className="space-y-16 text-gray-800 leading-relaxed font-medium">
        <section>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-black mb-6">01. Acceptance of Terms</h2>
          <p>
            By accessing or utilizing the PageDraft platform, you agree to be bound by these Terms of Service. If you disagree with any segment of these technical or legal guidelines, you must cease all interaction with our systems immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-black mb-6">02. Strategic Usage</h2>
          <p className="mb-4">
            PageDraft provides a workspace for content creation. Users are prohibited from utilizing the platform for:
          </p>
          <ul className="list-none space-y-3">
            <li className="flex gap-4">
              <span className="text-orange-500 font-black">/</span>
              <span>Systematic automated scraping or data mining</span>
            </li>
            <li className="flex gap-4">
              <span className="text-orange-500 font-black">/</span>
              <span>Distribution of malicious software or phishing campaigns</span>
            </li>
            <li className="flex gap-4">
              <span className="text-orange-500 font-black">/</span>
              <span>Infringement upon the intellectual property of others</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-black mb-6">03. IP Ownership</h2>
          <p>
            PageDraft claims no ownership over the content you draft. By publishing content to our public feeds, you grant PageDraft a non-exclusive, worldwide, royalty-free license to store, cache, and display that content solely for the purpose of operating the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-black mb-6">04. Limitation of Liability</h2>
          <p>
            PageDraft is provided "as is" without warranty of any kind. We are not liable for any data loss, service interruptions, or consequential damages arising from the use of our infrastructure. We recommend regular external backups of critical creative assets.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-black mb-6">05. Account Termination</h2>
          <p>
            We reserve the right to suspend or terminate access to our systems without prior notice for violations of these terms or behavior deemed detrimental to the stability of the PageDraft ecosystem.
          </p>
        </section>

        <div className="pt-10 border-t-2 border-black flex items-center gap-4">
          <div className="w-12 h-12 bg-black flex items-center justify-center text-orange-500 font-black">PD</div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 max-w-xs">
            PageDraft is a registered intellectual entity. All platform design elements are protected by copyright law.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
