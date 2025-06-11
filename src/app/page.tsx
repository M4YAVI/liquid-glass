'use client';

import { useState } from 'react';

// Interactive Demo Section
const DemoSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Code Generation', 'Data Analysis', 'Task Automation'];

  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}

          {/* Demo Content */}
          <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 p-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>

              <div className="rounded-xl p-6">
                <pre className="text-green-400 font-mono text-sm">
                  {`// AI Agent: ${tabs[activeTab]}
const agent = new AIAgent({
  model: 'gpt-4-turbo',
  capabilities: ['${tabs[activeTab].toLowerCase().replace(' ', '_')}'],
  interface: 'liquid-glass'
});

await agent.execute();`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main App Component
export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <DemoSection />

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        body {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
