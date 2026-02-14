
import React, { useEffect } from 'react';
import { updateSEO } from '../utils/seo';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    updateSEO({ title: 'Privacy Policy', description: 'PageDraft data handling and privacy protocols.' });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
      <header className="mb-20 border-l-8 border-orange-500 pl-8">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-black leading-none mb-4">
          PRIVACY <br /> <span className="text-orange-500">POLICY</span>
        </h1>
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Effective Date: February 24, 2026</p>
      </header>

      <div className="space-y-16 text-gray-800 leading-relaxed font-medium">
        <section>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-black mb-6">01. Data Collection Protocols</h2>
          <p className="mb-4">
            PageDraft operates on a principle of minimal data retention. We collect only the essential information required to provide our drafting services:
          </p>
          <ul className="list-none space-y-3">
            <li className="flex gap-4">
              <span className="text-orange-500 font-black">/</span>
              <span>Account Credentials (Email, Username, Name)</span>
            </li>
            <li className="flex gap-4">
              <span className="text-orange-500 font-black">/</span>
              <span>Content Drafts and Metadata explicitly created by the user</span>
            </li>
            <li className="flex gap-4">
              <span className="text-orange-500 font-black">/</span>
              <span>Technical logs for security and performance optimization</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-black mb-6">02. Information Utilization</h2>
          <p>
            Your data is used exclusively to facilitate your workspace experience. We do not engage in data harvesting for third-party advertising. Information is processed to maintain account security, synchronize drafts across devices, and improve technical performance via our PocketBase integration.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-black mb-6">03. Security Architecture</h2>
          <p>
            PageDraft utilizes industry-standard encryption protocols and secure server environments. All authentication processes are managed through PocketBase with strict access control. While we implement robust security measures, no digital transmission is 100% secure; users are responsible for maintaining unique, high-entropy passwords.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-black mb-6">04. User Sovereignty</h2>
          <p className="mb-4">
            You retain absolute ownership of your intellectual property. At any time, users may:
          </p>
          <ul className="list-none space-y-3">
            <li className="flex gap-4">
              <span className="text-orange-500 font-black">/</span>
              <span>Modify or delete any draft recorded on the platform</span>
            </li>
            <li className="flex gap-4">
              <span className="text-orange-500 font-black">/</span>
              <span>Request a complete export of their data profile</span>
            </li>
            <li className="flex gap-4">
              <span className="text-orange-500 font-black">/</span>
              <span>Terminate their account and purge all associated records</span>
            </li>
          </ul>
        </section>

        <section className="bg-gray-50 p-10 border-2 border-black">
          <h2 className="text-xl font-black uppercase tracking-tighter text-black mb-4">Contact Legal Dept</h2>
          <p className="text-sm">
            For inquiries regarding privacy protocols or data handling, please contact our administrative team at:
            <br />
            <span className="font-black text-orange-500 mt-2 block">legal@pagedraft.dev</span>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
