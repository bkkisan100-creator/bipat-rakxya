'use client';

import { useState } from 'react';

export default function SosButton() {
  const [loading, setLoading] = useState(false);

  const handleSOS = () => {
    setLoading(true);

    if (!('geolocation' in navigator)) {
      alert('तपाईंको फोनमा GPS सुविधा उपलब्ध छैन।');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const emergencyNumber = "100";
        const message = `आकस्मिक मद्दत! म विपद् जोखिममा छु। मेरो लोकेशन: https://maps.google.com/?q=${latitude},${longitude}`;
        
        window.location.href = `sms:${emergencyNumber}?body=${encodeURIComponent(message)}`;
        setLoading(false);
      },
      (error) => {
        alert('GPS Location लिन सकिएन। कृपया फोनको Location/GPS अन गर्नुहोस्।');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 text-center">
      <button
        onClick={handleSOS}
        disabled={loading}
        className="w-full py-8 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-2xl rounded-3xl shadow-2xl border-4 border-red-300 transition-all flex flex-col items-center justify-center gap-2"
      >
        <span className="text-4xl">🚨</span>
        <span>{loading ? 'लोकेशन लिँदैछ...' : 'गुहार (1-TAP SOS)'}</span>
        <span className="text-xs font-normal opacity-90">इन्टरनेट बिना नै SMS बाट लोकेशन जानेछ</span>
      </button>
    </div>
  );
}