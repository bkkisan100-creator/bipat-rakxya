'use client';

export default function EmergencyContacts() {
  const contacts = [
    { name: 'नेपाल प्रहरी (Nepal Police)', number: '100', icon: '👮‍♂️' },
    { name: 'एम्बुलेन्स (Ambulance)', number: '102', icon: '🚑' },
    { name: 'दमकल (Fire Brigade)', number: '101', icon: '🚒' },
    { name: 'शस्त्र प्रहरी बल (APF)', number: '1114', icon: '🛡️' },
  ];

  return (
    <div className="w-full max-w-sm mx-auto mb-6 bg-slate-800 border border-slate-700 rounded-2xl p-4">
      <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
        <span>📞</span> आपत्कालीन टेलिफोन डाइरेक्टरी
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {contacts.map((contact, index) => (
          <a
            key={index}
            href={`tel:${contact.number}`}
            className="flex flex-col items-center justify-center p-3 bg-slate-700/60 hover:bg-slate-700 active:scale-95 border border-slate-600 rounded-xl text-center transition-all"
          >
            <span className="text-2xl mb-1">{contact.icon}</span>
            <span className="text-xs font-semibold text-slate-200 line-clamp-1">{contact.name}</span>
            <span className="text-sm font-black text-emerald-400 mt-1">{contact.number}</span>
          </a>
        ))}
      </div>
    </div>
  );
}