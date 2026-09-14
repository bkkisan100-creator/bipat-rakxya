export default function EmergencyPage() {
  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-md mx-auto">

        <h1 className="text-3xl font-bold text-center mb-6">
          🚨 Emergency Help
        </h1>

        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white text-2xl font-bold py-8 rounded-2xl mb-6"
        >
          🆘 HELP ME
        </button>

        <div className="bg-zinc-900 border border-red-500 rounded-xl p-4 mb-4">
          <h2 className="font-bold text-red-400">
            🔴 Current Risk
          </h2>
          <p>High Risk Area</p>
        </div>

        <div className="bg-zinc-900 rounded-xl p-4 mb-4">
          <h2 className="font-bold text-green-400">
            📍 Safe Location
          </h2>
          <p>Nearest Shelter: 500m</p>
        </div>

        <div className="bg-zinc-900 rounded-xl p-4">
          <h2 className="font-bold mb-3">
            Emergency Contacts
          </h2>

          <div className="space-y-3">
            <a
              href="tel:100"
              className="block bg-blue-600 text-center py-3 rounded-lg"
            >
              🚓 Police 100
            </a>

            <a
              href="tel:102"
              className="block bg-green-600 text-center py-3 rounded-lg"
            >
              🚑 Ambulance 102
            </a>

            <a
              href="tel:101"
              className="block bg-orange-600 text-center py-3 rounded-lg"
            >
              🚒 Fire Brigade 101
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}