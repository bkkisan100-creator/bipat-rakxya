'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
  rain: number;
  windSpeed: number;
  status: 'safe' | 'warning' | 'danger';
  message: string;
  lastUpdated: string;
}

export default function WeatherAlert() {
  const [data, setData] = useState<WeatherData>({
    rain: 0,
    windSpeed: 0,
    status: 'safe',
    message: 'तथ्याङ्क लोड हुँदैछ...',
    lastUpdated: '',
  });
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // १. पहिले LocalStorage मा पुरानो डाटा छ भने अफलाइनका लागि लोड गर्ने
    const cachedData = localStorage.getItem('bipad_weather_cache');
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setData(parsed);
      } catch (e) {
        console.error('Failed to parse cached weather data', e);
      }
    }

    // २. नयाँ डाटा fetch गर्ने (काठमाडौँ/नेपालको अक्षांश-देशान्तर)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=27.7172&longitude=85.3240&hourly=rain,wind_speed_10m')
      .then((res) => res.json())
      .then((apiData) => {
        const currentRain = apiData.hourly?.rain?.[0] || 0;
        const currentWind = apiData.hourly?.wind_speed_10m?.[0] || 0;

        let currentStatus: 'safe' | 'warning' | 'danger' = 'safe';
        let alertMsg = '';

        // बाढी, पहिरो र आँधीहुरीको थ्रेसहोल्ड जाँच गर्ने
        if (currentRain > 15 || currentWind > 45) {
          currentStatus = 'danger';
          alertMsg = `🚨 उच्च जोखिम! भारी वर्षा (${currentRain}mm/hr) वा तीव्र हावाहुरी (${currentWind}km/h)। पहिरो र बाढीको जोखिम छ, सुरक्षित ठाउँमा बस्नुहोस्।`;
        } else if (currentRain > 3 || currentWind > 25) {
          currentStatus = 'warning';
          alertMsg = `⚠️ चेतावनी! मध्यम वर्षा (${currentRain}mm/hr) वा हुरीबतास (${currentWind}km/h)। सतर्कता अपनाउनुहोस्।`;
        } else {
          currentStatus = 'safe';
          alertMsg = `✅ सामान्य मौसम। हाल वर्षा (${currentRain}mm/hr) र हावाको गति (${currentWind}km/h) सुरक्षित सीमा भित्र छ।`;
        }

        const now = new Date().toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' });

        const updatedData: WeatherData = {
          rain: currentRain,
          windSpeed: currentWind,
          status: currentStatus,
          message: alertMsg,
          lastUpdated: now,
        };

        // नयाँ डाटा सेभ गर्ने
        setData(updatedData);
        localStorage.setItem('bipad_weather_cache', JSON.stringify(updatedData));
        setIsOffline(false);
      })
      .catch(() => {
        // इन्टरनेट नभएको बेला
        setIsOffline(true);
      });
  }, []);

  const getCardStyle = () => {
    if (data.status === 'danger') return 'bg-red-950/90 border-red-500 text-red-200';
    if (data.status === 'warning') return 'bg-amber-950/90 border-amber-500 text-amber-200';
    return 'bg-emerald-950/90 border-emerald-500 text-emerald-200';
  };

  return (
    <div className={`w-full max-w-sm mx-auto p-4 rounded-2xl border-2 text-left mb-6 transition-all ${getCardStyle()}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌩️</span>
          <h2 className="font-bold text-base text-white">मौसम, बाढी र आँधी अलर्ट</h2>
        </div>
        {isOffline && (
          <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-medium">
            अफलाइन मोड
          </span>
        )}
      </div>

      <p className="text-xs leading-relaxed font-medium mb-3">{data.message}</p>

      {data.lastUpdated && (
        <div className="text-[10px] text-slate-400 border-t border-slate-700/50 pt-2 flex justify-between">
          <span>अन्तिम अपडेट: {data.lastUpdated}</span>
          <span>{isOffline ? 'सुरक्षित अफलाइन डाटा' : 'अनलाइन सङ्ककलन'}</span>
        </div>
      )}
    </div>
  );
}