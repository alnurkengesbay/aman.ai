import React from 'react';
import { DemoSection } from './components/DemoSection';

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-black selection:text-white relative flex flex-col" style={{ background: '#f9fafb' }}>
      
      {/* Grid Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.3,
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Page Title Section */}
          <div className="mb-10">
             <div>
               <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">AI Blood Analysis</h1>
               
               {/* Service Description */}
               <div className="text-slate-600 leading-relaxed mb-8">
                  <p className="max-w-4xl text-base md:text-lg">
                    AI analyzes over 50 blood biomarkers, revealing hidden patterns of inflammation, hormonal changes, and metabolic risks.
                  </p>
               </div>
             </div>
          </div>

          {/* The Demo Card */}
          <DemoSection />
        
        </div>
      </main>
    </div>
  );
};

export default App;