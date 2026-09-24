import React, { useState } from 'react';

export default function DonorPost({ user, socket }) {
  const [formData, setFormData] = useState({
    foodType: 'produce',
    quantity: '',
    unit: 'kg',
    safeUntil: '',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        donor_id: user?.id,
        food_type: formData.foodType,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        safe_until: formData.safeUntil,
        pickup_location: { address: formData.address, lat: 40.7128, lng: -74.0060 }
      };

      const res = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log("Match Engine Response:", data);
      
      if (res.ok) {
        alert(data.message);
      }
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background w-full flex justify-center py-6 md:py-12 px-4">
      {/* 768px-first layout that gracefully degrades to mobile */}
      <div className="w-full max-w-3xl bg-surface p-6 md:p-10 rounded-2xl shadow-sm flex flex-col md:flex-row gap-10">
        
        {/* Helper/Context Column for desktop width */}
        <div className="flex-1 max-w-sm hidden md:block">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Surplus Food</h1>
          <p className="text-gray-700 text-sm mb-6 leading-relaxed">
            Your timely donation helps local shelters serve fresh, nutritious meals instead of the food going to waste.
          </p>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h3 className="text-sm font-bold text-blue-900 mb-2">How it works</h3>
            <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
              <li>Enter exact quantities and safe margins.</li>
              <li>Our engine finds the best local recipient.</li>
              <li>A volunteer driver will arrive for pickup.</li>
            </ul>
          </div>
        </div>

        {/* Form Column - responsive down to 375px */}
        <div className="flex-1 w-full">
          {/* Mobile-only header block */}
          <header className="mb-6 md:hidden">
            <h1 className="text-2xl font-bold text-gray-900">Post Surplus Food</h1>
            <p className="text-xs text-gray-500 mt-1 pb-4 border-b border-gray-100">Fields marked with * are required.</p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Food Type *</label>
              <select 
                className="min-h-touch px-3 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:ring-2 focus:ring-primary outline-none"
                value={formData.foodType}
                onChange={(e) => setFormData({...formData, foodType: e.target.value})}
              >
                <option value="produce">Produce</option>
                <option value="prepared">Prepared Meals</option>
                <option value="packaged">Packaged Goods</option>
              </select>
            </div>

            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-sm font-semibold text-gray-700">Quantity *</label>
                <input 
                  type="number" 
                  placeholder="e.g. 50"
                  className="min-h-touch px-3 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:ring-2 focus:ring-primary outline-none w-full"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex flex-col gap-1.5 md:w-32">
                <label className="text-sm font-semibold text-gray-700">Unit *</label>
                <select 
                  className="min-h-touch px-3 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:ring-2 focus:ring-primary outline-none w-full"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                >
                  <option value="kg">kg</option>
                  <option value="meals">meals</option>
                  <option value="boxes">boxes</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Safe to consume until *</label>
              <input 
                type="datetime-local" 
                className="min-h-touch px-3 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:ring-2 focus:ring-primary outline-none"
                value={formData.safeUntil}
                onChange={(e) => setFormData({...formData, safeUntil: e.target.value})}
                required
              />
              <span className="text-xs text-gray-500">Food becomes ineligible for matching after this time.</span>
            </div>

            <div className="flex flex-col gap-1.5 md:mb-2">
              <label className="text-sm font-semibold text-gray-700">Pickup Address *</label>
              <input 
                type="text"
                placeholder="123 Main St"
                className="min-h-touch px-3 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:ring-2 focus:ring-primary outline-none"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>

            <button 
              type="submit"
              className="mt-4 md:mt-2 min-h-touch w-full bg-primary text-white font-bold text-sm tracking-wide rounded-md hover:bg-emerald-700 transition flex items-center justify-center shadow-sm"
            >
              Match Donation
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
