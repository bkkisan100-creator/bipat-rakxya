'use client';

import { useState } from 'react';

export default function EarthquakeGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-left flex justify-between items-center text-sm font-semibold text-slate-200"
      >
        <span className="flex items-center gap-2">
          <span>🏚️</span> भूकम्प आउँदा के गर्ने? (सुरक्षा टिप्स)
        </span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-2 p-4 bg-slate-800/90 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-2">
          <p className="font-bold text-amber-400">१. भवन भित्र हुनुहुन्छ भने:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>खुकुलो ठाउँमा नभाग्नुहोस्। बलियो टेबल वा खाटमुनि छिर्नुहोस् (Drop, Cover, Hold)।</li>
            <li>झ्याल, सिसा र गाह्रोबाट टाढा रहनुहोस्।</li>
          </ul>

          <p className="font-bold text-amber-400 mt-2">२. बाहिर हुनुहुन्छ भने:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>रुख, बिजुलीको पोल र अग्ला भवनबाट टाढा खुला ठाउँमा जानुहोस्।</li>
          </ul>
        </div>
      )}
    </div>
  );
}