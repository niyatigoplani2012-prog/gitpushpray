/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Urgency colors for expiry countdown
        urgency: {
          safe: '#059669',      // emerald-600
          warning: '#ca8a04',   // yellow-700
          critical: '#dc2626',  // red-600
          expired: '#9ca3af',   // gray-400
        },
        // Status colors for donation lifecycle
        status: {
          posted: '#eab308',     // yellow-500
          matched: '#2563eb',    // blue-600
          'picked-up': '#9333ea', // purple-600
          delivered: '#059669',  // emerald-600
          expired: '#4b5563',    // gray-600
          cancelled: '#dc2626',  // red-600
        },
        primary: '#059669', // emerald-600
        secondary: '#2563eb', // blue-600
        surface: '#ffffff',
        background: '#f9fafb', // gray-50
      },
      minHeight: {
        'touch': '48px', // Enforces minimum 48px touch targets
      },
      minWidth: {
        'touch': '48px',
      },
      fontSize: {
        '5xl': ['56px', { lineHeight: '64px' }],
      }
    },
  },
  plugins: [],
}
