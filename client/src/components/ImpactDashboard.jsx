import React from 'react';

export default function ImpactDashboard() {
  const stats = {
    mealsRescued: 1420,
    weightDiverted: 426, // kg
    co2eAvoided: 1065 // kg (assuming 1kg food = 2.5kg CO2e)
  };

  return (
    <div className="min-h-screen bg-background w-full p-4 lg:p-16">
      {/* 1024px-first layout explicitly targeting a shared screen/TV view (max-w-7xl) */}
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-10 lg:gap-16">
        
        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between border-b border-gray-200 pb-8 gap-4">
           <div>
             <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Surplus to Shelter</h1>
             <p className="text-lg text-gray-600 mt-2 font-medium">City-wide real-time food rescue impact metrics.</p>
           </div>
           
           <div className="text-sm font-bold bg-green-100 text-green-800 px-5 py-3 rounded-full w-max flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              LIVE SYSTEM OPERATIONAL
           </div>
        </header>

        {/* Grid intended for wide desktop/TV visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          <div className="bg-white p-8 lg:p-14 rounded-[2rem] shadow-sm border border-emerald-100 flex flex-col justify-center">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Meals Rescued</span>
            <span className="text-5xl font-black text-status-delivered tabular-nums tracking-tighter">
              {stats.mealsRescued.toLocaleString()}
            </span>
          </div>

          <div className="bg-white p-8 lg:p-14 rounded-[2rem] shadow-sm border border-blue-100 flex flex-col justify-center">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Kg Diverted</span>
            <span className="text-5xl font-black text-status-matched tabular-nums tracking-tighter">
              {stats.weightDiverted.toLocaleString()}
            </span>
          </div>

          <div className="bg-gray-900 p-8 lg:p-14 rounded-[2rem] shadow-xl border border-gray-800 flex flex-col justify-center text-white">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Kg CO₂e Avoided</span>
            <span className="text-5xl font-black tabular-nums tracking-tighter">
              {stats.co2eAvoided.toLocaleString()}
            </span>
          </div>
          
        </div>

      </div>
    </div>
  );
}
