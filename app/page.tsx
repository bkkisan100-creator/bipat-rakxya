"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Language = "ne" | "en";
type ActiveTab = "home" | "information";

type SensorData = {
  rainfall: number;
  soilMoisture: number;
  groundMovement: number;
  porePressure: number;
  tilt: number;
};

const emergencyContacts = [
  {
    title: "प्रहरी",
    english: "Police",
    number: "100",
    icon: "👮",
  },
  {
    title: "एम्बुलेन्स",
    english: "Ambulance",
    number: "102",
    icon: "🚑",
  },
  {
    title: "आगलागी",
    english: "Fire",
    number: "101",
    icon: "🚒",
  },
  {
    title: "विपद् व्यवस्थापन",
    english: "Disaster",
    number: "1149",
    icon: "🛡️",
  },
];

const translations = {
  ne: {
    appName: "BIPATRAKSHYA",
    tagline: "आपतकालमा छिटो निर्णय, छिटो सहायता।",

    safe: "सुरक्षित",
    location: "तपाईंको स्थान",
    currentLocation: "हालको स्थान",
    gpsActive: "GPS सक्रिय",

    emergencyHelp: "आपतकालीन सहायता",
    emergencySub: "तत्काल आवश्यक परेमा एक क्लिकमै",

    emergencyCall: "Emergency Call",
    emergencyCallNepali: "आपतकालीन फोन",

    emergencyAlert: "Emergency Alert",
    emergencyAlertNepali: "आपतकालीन सूचना पठाउनुहोस्",

    locationTrack: "Location Track",
    locationTrackNepali: "आफ्नो स्थान साझा गर्नुहोस्",

    offlineAlert: "Offline Alert",
    offlineAlertNepali: "इन्टरनेट नभए पनि सहायता",

    safeRoute: "Safe Route",
    safeRouteNepali: "सुरक्षित स्थान / मार्ग",

    helpline: "Helpline",
    helplineNepali: "महत्वपूर्ण सम्पर्क नम्बर",

    safeNow: "अहिले तपाईं सुरक्षित हुनुहुन्छ",
    safeInfo: "हाल उपलब्ध जोखिम जानकारी अनुसार",
    lastUpdate: "अन्तिम अपडेट",

    risk: "हालको जोखिम",
    lowRisk: "कम जोखिम",
    dashboard: "विस्तृत Dashboard",

    rain: "वर्षा",
    landslide: "पहिरो",
    flood: "बाढी",
    normal: "सामान्य",
    low: "न्यून",

    sensors: "सेन्सर अवस्था",
    aiAnalysis: "AI जोखिम विश्लेषण",
    monitoring: "निगरानी क्षेत्र",

    information: "महत्वपूर्ण सूचना",

    safePlace: "सुरक्षित स्थान",
    findSafe: "नजिकको सुरक्षित स्थान खोज्नुहोस्",
    route: "सुरक्षित मार्ग हेर्नुहोस्",

    offline: "Offline Mode",
    online: "ONLINE",
    offlineText: "OFFLINE",

    home: "गृहपृष्ठ",
    notice: "सूचना",
    info: "जानकारी",
    map: "नक्सा",
    safeZone: "सुरक्षित स्थान",
    more: "थप",

    alertSent: "आपतकालीन सूचना तयार भयो।",
    gpsError: "GPS location प्राप्त गर्न सकिएन।",
    smsReady: "SMS पठाउन तयार छ।",
    notificationBlocked:
      "Browser notification अनुमति उपलब्ध छैन।",
  },

  en: {
    appName: "BIPATRAKSHYA",
    tagline: "Fast decisions, fast assistance during emergencies.",

    safe: "SAFE",
    location: "Your Location",
    currentLocation: "Current Location",
    gpsActive: "GPS Active",

    emergencyHelp: "Emergency Assistance",
    emergencySub: "One click when immediate help is needed",

    emergencyCall: "Emergency Call",
    emergencyCallNepali: "Emergency phone",

    emergencyAlert: "Emergency Alert",
    emergencyAlertNepali: "Send emergency alert",

    locationTrack: "Location Track",
    locationTrackNepali: "Share your location",

    offlineAlert: "Offline Alert",
    offlineAlertNepali: "Help even without internet",

    safeRoute: "Safe Route",
    safeRouteNepali: "Safe place / route",

    helpline: "Helpline",
    helplineNepali: "Important contact numbers",

    safeNow: "You are currently safe",
    safeInfo: "According to currently available risk information",
    lastUpdate: "Last Update",

    risk: "Current Risk",
    lowRisk: "Low Risk",
    dashboard: "Detailed Dashboard",

    rain: "Rain",
    landslide: "Landslide",
    flood: "Flood",
    normal: "Normal",
    low: "Low",

    sensors: "Sensor Status",
    aiAnalysis: "AI Risk Analysis",
    monitoring: "Monitoring Areas",

    information: "Important Information",

    safePlace: "Safe Place",
    findSafe: "Find nearest safe place",
    route: "View safe route",

    offline: "Offline Mode",
    online: "ONLINE",
    offlineText: "OFFLINE",

    home: "Home",
    notice: "Notice",
    info: "Information",
    map: "Map",
    safeZone: "Safe Zone",
    more: "More",

    alertSent: "Emergency alert prepared.",
    gpsError: "Could not obtain GPS location.",
    smsReady: "SMS is ready to send.",
    notificationBlocked:
      "Browser notification permission is unavailable.",
  },
};

export default function Home() {
  const [language, setLanguage] = useState<Language>("ne");

  const [activeTab, setActiveTab] =
    useState<ActiveTab>("home");

  const [sensor, setSensor] = useState<SensorData>({
    rainfall: 72,
    soilMoisture: 78,
    groundMovement: 4.2,
    porePressure: 38,
    tilt: 1.8,
  });

  const [risk, setRisk] = useState(72);

  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [gpsActive, setGpsActive] = useState(false);

  const [locationText, setLocationText] =
    useState("हालको स्थान");

  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission | "unsupported">(
      "unsupported"
    );

  // Large emergency alert + siren state
  const [emergencyActive, setEmergencyActive] = useState(false);
  const sirenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sirenIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sirenContextRef = useRef<AudioContext | null>(null);
  const sirenOscRef = useRef<OscillatorNode | null>(null);

  const t = translations[language];

  // --------------------------------------------------
  // INITIAL BROWSER STATE
  // --------------------------------------------------

  useEffect(() => {
    setMounted(true);

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    updateOnlineStatus();

    window.addEventListener(
      "online",
      updateOnlineStatus
    );

    window.addEventListener(
      "offline",
      updateOnlineStatus
    );

    if ("Notification" in window) {
      setNotificationPermission(
        Notification.permission
      );
    }

    return () => {
      window.removeEventListener(
        "online",
        updateOnlineStatus
      );

      window.removeEventListener(
        "offline",
        updateOnlineStatus
      );
    };
  }, []);

  // --------------------------------------------------
  // SIMULATED SENSOR UPDATE
  // --------------------------------------------------

  useEffect(() => {
    const interval = setInterval(() => {
      setSensor((previous) => ({
        rainfall: Math.max(
          0,
          Math.min(
            100,
            previous.rainfall +
              (Math.random() - 0.5) * 3
          )
        ),

        soilMoisture: Math.max(
          0,
          Math.min(
            100,
            previous.soilMoisture +
              (Math.random() - 0.5) * 2
          )
        ),

        groundMovement: Math.max(
          0,
          previous.groundMovement +
            (Math.random() - 0.5) * 0.3
        ),

        porePressure: Math.max(
          0,
          Math.min(
            100,
            previous.porePressure +
              (Math.random() - 0.5) * 2
          )
        ),

        tilt: Math.max(
          0,
          previous.tilt +
            (Math.random() - 0.5) * 0.1
        ),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // --------------------------------------------------
  // RISK CALCULATION
  // --------------------------------------------------

  useEffect(() => {
    const calculatedRisk = Math.round(
      sensor.rainfall * 0.25 +
        sensor.soilMoisture * 0.25 +
        Math.min(
          sensor.groundMovement * 10,
          100
        ) *
          0.2 +
        sensor.porePressure * 0.2 +
        Math.min(sensor.tilt * 20, 100) *
          0.1
    );

    setRisk(
      Math.max(
        0,
        Math.min(100, calculatedRisk)
      )
    );
  }, [sensor]);

  // --------------------------------------------------
  // RISK HELPERS
  // --------------------------------------------------

  const getRiskText = () => {
    if (risk >= 80) {
      return language === "ne"
        ? "उच्च जोखिम"
        : "High Risk";
    }

    if (risk >= 60) {
      return language === "ne"
        ? "मध्यम जोखिम"
        : "Moderate Risk";
    }

    return t.lowRisk;
  };

  const getRiskColor = () => {
    if (risk >= 80) return "text-red-400";
    if (risk >= 60) return "text-yellow-400";

    return "text-green-400";
  };

  // --------------------------------------------------
  // NOTIFICATION PERMISSION
  // --------------------------------------------------

  const requestNotification = async () => {
    if (!("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }

    try {
      const permission =
        await Notification.requestPermission();

      setNotificationPermission(permission);
    } catch {
      setNotificationPermission("denied");
    }
  };

  // --------------------------------------------------
  // EMERGENCY CALL
  // --------------------------------------------------

  const handleEmergencyCall = () => {
    window.location.href = "tel:100";
  };

  // --------------------------------------------------
  // GPS
  // --------------------------------------------------

  const getCurrentLocation = (
    callback?: (
      latitude: number,
      longitude: number
    ) => void
  ) => {
    if (!navigator.geolocation) {
      alert(t.gpsError);
      return;
    }

    setGpsActive(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {
          latitude,
          longitude,
        } = position.coords;

        setGpsActive(false);

        setLocationText(
          `${latitude.toFixed(
            5
          )}, ${longitude.toFixed(5)}`
        );

        if (callback) {
          callback(latitude, longitude);
        }
      },
      () => {
        setGpsActive(false);
        alert(t.gpsError);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  // --------------------------------------------------
  // EMERGENCY SIREN + ALERT
  // --------------------------------------------------

  const stopEmergencySiren = () => {
    if (sirenTimerRef.current) {
      clearTimeout(sirenTimerRef.current);
      sirenTimerRef.current = null;
    }

    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current);
      sirenIntervalRef.current = null;
    }

    try {
      sirenOscRef.current?.stop();
    } catch {}

    sirenOscRef.current = null;

    try {
      sirenContextRef.current?.close();
    } catch {}

    sirenContextRef.current = null;
  };

  const startEmergencySiren = () => {
    stopEmergencySiren();

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sawtooth";
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.24, ctx.currentTime + 0.05);

      const sweep = () => {
        if (ctx.state === "closed") return;
        const now = ctx.currentTime;
        oscillator.frequency.cancelScheduledValues(now);
        oscillator.frequency.setValueAtTime(650, now);
        oscillator.frequency.linearRampToValueAtTime(1200, now + 0.65);
        oscillator.frequency.linearRampToValueAtTime(650, now + 1.3);
      };

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();

      sirenContextRef.current = ctx;
      sirenOscRef.current = oscillator;

      sweep();
      sirenIntervalRef.current = setInterval(sweep, 1300);

      sirenTimerRef.current = setTimeout(() => {
        stopEmergencySiren();
      }, 10000);
    } catch (error) {
      console.warn("Emergency siren could not start:", error);
    }
  };

  const activateEmergencyAlert = () => {
    setEmergencyActive(true);
    startEmergencySiren();

    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "granted"
    ) {
      try {
        new Notification(
          language === "ne"
            ? "🚨 आपतकालीन सूचना"
            : "🚨 EMERGENCY ALERT",
          {
            body:
              language === "ne"
                ? "तत्काल सुरक्षित स्थानतर्फ जानुहोस्। सहायता आवश्यक भए 100 मा सम्पर्क गर्नुहोस्।"
                : "Move to a safe place immediately. Call 100 if you need emergency help.",
            requireInteraction: true,
          }
        );
      } catch {}
    }
  };

  // --------------------------------------------------
  // EMERGENCY SMS
  // --------------------------------------------------

  const handleEmergencyAlert = () => {
    // Show the large alarm + start siren immediately.
    activateEmergencyAlert();

    // Also prepare the emergency SMS with GPS location.
    getCurrentLocation(
      (latitude, longitude) => {
        const mapsUrl =
          `https://maps.google.com/?q=${latitude},${longitude}`;

        const message =
          language === "ne"
            ? `आकस्मिक मद्दत आवश्यक छ। म विपद् जोखिममा छु। मेरो लोकेशन: ${mapsUrl}`
            : `Emergency help required. I may be in danger. My location: ${mapsUrl}`;

        window.setTimeout(() => {
          window.location.href =
            `sms:100?body=${encodeURIComponent(message)}`;
        }, 350);
      }
    );
  };

  // --------------------------------------------------
  // SHARE LOCATION
  // --------------------------------------------------

  const handleLocationTrack = () => {
    getCurrentLocation(
      async (latitude, longitude) => {
        const url =
          `https://maps.google.com/?q=${latitude},${longitude}`;

        try {
          if (navigator.share) {
            await navigator.share({
              title:
                "BIPATRAKSHYA Location",

              text:
                language === "ne"
                  ? "मेरो हालको स्थान"
                  : "My current location",

              url,
            });
          } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(url);

            alert(
              language === "ne"
                ? "लोकेशन लिंक copy भयो।"
                : "Location link copied."
            );
          } else {
            window.prompt(
              language === "ne"
                ? "यो लोकेशन लिंक copy गर्नुहोस्:"
                : "Copy this location link:",
              url
            );
          }
        } catch {
          // User cancelled sharing.
        }
      }
    );
  };

  // --------------------------------------------------
  // OFFLINE SMS
  // --------------------------------------------------

  const handleOfflineAlert = () => {
    getCurrentLocation(
      (latitude, longitude) => {
        const mapsUrl =
          `https://maps.google.com/?q=${latitude},${longitude}`;

        const message =
          language === "ne"
            ? `BIPATRAKSHYA OFFLINE ALERT: मलाई सहायता चाहिएको छ। मेरो स्थान: ${mapsUrl}`
            : `BIPATRAKSHYA OFFLINE ALERT: I need help. My location: ${mapsUrl}`;

        window.location.href =
          `sms:100?body=${encodeURIComponent(
            message
          )}`;
      }
    );
  };

  // --------------------------------------------------
  // SAFE ROUTE
  // --------------------------------------------------

  const handleSafeRoute = () => {
    getCurrentLocation(
      (latitude, longitude) => {
        // Prototype safe-zone location
        const safeZoneLatitude = 27.7172;
        const safeZoneLongitude = 85.324;

        const routeUrl =
          `https://www.google.com/maps/dir/?api=1` +
          `&origin=${latitude},${longitude}` +
          `&destination=${safeZoneLatitude},${safeZoneLongitude}` +
          `&travelmode=walking`;

        window.open(
          routeUrl,
          "_blank",
          "noopener,noreferrer"
        );
      }
    );
  };

  // --------------------------------------------------
  // BROWSER NOTIFICATION
  // --------------------------------------------------

  const handleSendNotification =
    async () => {
      if (!("Notification" in window)) {
        alert(t.notificationBlocked);
        return;
      }

      let permission =
        Notification.permission;

      if (permission === "default") {
        permission =
          await Notification.requestPermission();

        setNotificationPermission(permission);
      }

      if (permission === "granted") {
        new Notification(
          "BIPATRAKSHYA",
          {
            body:
              language === "ne"
                ? "आपतकालीन सूचना प्रणाली सक्रिय छ।"
                : "Emergency alert system is active.",
          }
        );
      } else {
        alert(t.notificationBlocked);
      }
    };

  // --------------------------------------------------
  // SECTION SCROLL
  // --------------------------------------------------

  const scrollToSection = (
    id: string
  ) => {
    setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  // --------------------------------------------------
  // OPEN INFORMATION TAB
  // --------------------------------------------------

  const openInformation = (
    sectionId?: string
  ) => {
    setActiveTab("information");

    if (sectionId) {
      setTimeout(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const riskWidth = `${Math.max(
    5,
    Math.min(100, risk)
  )}%`;

  return (
    <main className="min-h-screen bg-[#050607] text-white pb-28">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/40 bg-red-500/10 text-xl">
              🛡️
            </div>

            <div>
              <h1 className="text-lg font-black tracking-wider md:text-xl">
                {t.appName}
              </h1>

              <p className="text-[10px] text-gray-400 md:text-xs">
                {t.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">

            {/* LANGUAGE */}

            <div className="hidden rounded-full border border-white/10 bg-white/5 p-1 text-xs sm:flex">

              <button
                onClick={() =>
                  setLanguage("ne")
                }
                className={`rounded-full px-3 py-1 ${
                  language === "ne"
                    ? "bg-blue-500 text-white"
                    : "text-gray-400"
                }`}
              >
                नेपाली
              </button>

              <button
                onClick={() =>
                  setLanguage("en")
                }
                className={`rounded-full px-3 py-1 ${
                  language === "en"
                    ? "bg-blue-500 text-white"
                    : "text-gray-400"
                }`}
              >
                English
              </button>

            </div>

            {/* ONLINE STATUS */}

            <div
              className={`rounded-full border px-3 py-1 text-[10px] font-bold ${
                !mounted
                  ? "border-gray-500/30 bg-gray-500/10 text-gray-400"
                  : isOnline
                  ? "border-green-500/30 bg-green-500/10 text-green-400"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}
            >
              <span className="mr-1">
                ●
              </span>

              {!mounted
                ? "..."
                : isOnline
                ? t.online
                : t.offlineText}
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="mx-auto max-w-6xl px-4 md:px-6">

        {/* ===================================================
            PREMIUM HOME TAB
        =================================================== */}

        {activeTab === "home" && (
          <div className="relative">
            {/* HERO */}
            <section className="relative mt-5 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#17191d] via-[#0b0c0f] to-black px-5 py-8 shadow-2xl md:px-8 md:py-10">
              <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-red-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-red-300">
                    Emergency Ready
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-gray-400">
                    Nepal • Early Warning
                  </span>
                </div>

                <h2 className="mt-7 max-w-4xl text-4xl font-black leading-[0.92] tracking-tight md:text-6xl lg:text-7xl">
                  <span className="block text-white">
                    संकट आउनुअघि
                  </span>
                  <span className="mt-2 block bg-gradient-to-r from-red-400 via-orange-300 to-yellow-200 bg-clip-text text-transparent">
                    तयार रहनुहोस्।
                  </span>
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-6 text-gray-400 md:text-base">
                  {language === "ne"
                    ? "जोखिमको संकेत देखिँदा छिटो निर्णय लिन, सहायता बोलाउन र सुरक्षित स्थानतर्फ जान BIPATRAKSHYA तयार छ।"
                    : "BIPATRAKSHYA helps you react quickly, call for assistance and move toward safety when danger appears."}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <div className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-bold ${
                    isOnline
                      ? "border-green-500/20 bg-green-500/10 text-green-300"
                      : "border-red-500/20 bg-red-500/10 text-red-300"
                  }`}>
                    <span className={isOnline ? "animate-pulse" : ""}>●</span>
                    {mounted ? (isOnline ? "SYSTEM ONLINE" : "OFFLINE MODE") : "CHECKING..."}
                  </div>

                  <button
                    onClick={() => getCurrentLocation()}
                    className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-bold text-cyan-300 transition hover:-translate-y-0.5 hover:bg-cyan-400/20"
                  >
                    📍 {gpsActive ? "GPS..." : "GPS LOCATION"}
                  </button>
                </div>
              </div>
            </section>

            {/* LOCATION + RISK */}
            <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl">
                      📍
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                        {t.location}
                      </p>
                      <p className="mt-1 truncate text-base font-bold text-cyan-200 md:text-lg">
                        {locationText}
                      </p>
                      <p className="mt-1 text-[10px] text-gray-500">
                        {gpsActive ? "● GPS locating..." : `◉ ${t.gpsActive}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => getCurrentLocation()}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold text-gray-300 transition hover:bg-white/10"
                  >
                    LOCATE
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[28px] border border-green-500/20 bg-gradient-to-br from-green-500/15 to-cyan-500/5 p-5">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green-400/10 blur-2xl" />
                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                      LIVE STATUS
                    </p>
                    <h3 className={`mt-2 text-lg font-black ${
                      risk >= 80 ? "text-red-300" : risk >= 60 ? "text-yellow-300" : "text-green-300"
                    }`}>
                      {risk >= 80 ? "⚠️ जोखिम बढेको छ" : t.safeNow}
                    </h3>
                    <p className="mt-1 text-[10px] leading-4 text-gray-500">
                      {t.safeInfo}
                    </p>
                  </div>

                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white/10 bg-black/30">
                    <div className={`absolute inset-1 rounded-full border-2 ${
                      risk >= 80 ? "border-red-400/40" : risk >= 60 ? "border-yellow-400/40" : "border-green-400/40"
                    }`} />
                    <div className="text-center">
                      <p className={`text-2xl font-black ${getRiskColor()}`}>{risk}</p>
                      <p className="text-[8px] text-gray-500">/100</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* EMERGENCY CENTER */}
            <section id="emergency" className="mt-5 overflow-hidden rounded-[32px] border border-red-500/30 bg-gradient-to-b from-red-500/[0.07] to-transparent p-4 shadow-2xl md:p-6">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-1 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.7)]" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-300">
                        EMERGENCY CENTER
                      </p>
                      <h2 className="mt-1 text-2xl font-black md:text-3xl">
                        {t.emergencyHelp}
                      </h2>
                    </div>
                  </div>
                  <p className="mt-3 pl-4 text-xs text-gray-500">
                    {t.emergencySub}
                  </p>
                </div>

                <div className="hidden rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-[9px] font-bold text-red-300 sm:block">
                  24 / 7 READY
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <button
                  onClick={handleEmergencyCall}
                  className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-left transition duration-300 hover:-translate-y-1 hover:bg-blue-500/20"
                >
                  <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-400/10 blur-2xl" />
                  <div className="relative flex items-start justify-between">
                    <span className="text-3xl">📞</span>
                    <span className="text-blue-300">↗</span>
                  </div>
                  <h3 className="relative mt-5 text-base font-black md:text-lg">{t.emergencyCall}</h3>
                  <p className="relative mt-1 text-[9px] leading-4 text-gray-400">{t.emergencyCallNepali}</p>
                </button>

                <button
                  onClick={handleEmergencyAlert}
                  className="group relative min-h-[165px] overflow-hidden rounded-2xl border-2 border-red-500/60 bg-gradient-to-br from-red-950/80 via-red-900/40 to-black p-5 text-left shadow-[0_0_30px_rgba(239,68,68,0.25)] transition duration-300 hover:-translate-y-1 hover:border-red-400 hover:shadow-[0_0_45px_rgba(239,68,68,0.5)] active:scale-[0.98] md:min-h-[185px]"
                >
                  <span className="absolute -right-8 -top-8 h-28 w-28 animate-ping rounded-full bg-red-500/15 blur-2xl" />
                  <span className="absolute inset-x-0 bottom-0 h-1 bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.95)]" />
                  <div className="relative flex items-start justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/40 bg-red-500/15 text-4xl shadow-[0_0_22px_rgba(239,68,68,0.3)]">
                      🚨
                    </span>
                    <span className="animate-pulse rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-[10px] font-black tracking-wider text-red-300">
                      🔊 SOS
                    </span>
                  </div>
                  <h3 className="relative mt-4 text-xl font-black text-white md:text-2xl">
                    {t.emergencyAlert}
                  </h3>
                  <p className="relative mt-1 text-xs leading-5 text-red-100/70">
                    {t.emergencyAlertNepali}
                  </p>
                  <div className="relative mt-3 flex items-center gap-2 text-[10px] font-black text-red-300">
                    <span>🔊</span>
                    <span>
                      {language === "ne"
                        ? "साइरन सहित आपतकालीन सूचना"
                        : "Emergency alert with siren"}
                    </span>
                  </div>
                </button>

                <button
                  onClick={handleLocationTrack}
                  className="group relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-left transition duration-300 hover:-translate-y-1 hover:bg-cyan-500/20"
                >
                  <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-cyan-400/10 blur-2xl" />
                  <div className="relative flex items-start justify-between">
                    <span className="text-3xl">📍</span>
                    <span className="text-cyan-300">↗</span>
                  </div>
                  <h3 className="relative mt-5 text-base font-black md:text-lg">{t.locationTrack}</h3>
                  <p className="relative mt-1 text-[9px] leading-4 text-gray-400">{t.locationTrackNepali}</p>
                </button>

                <button
                  onClick={handleOfflineAlert}
                  className="group relative overflow-hidden rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4 text-left transition duration-300 hover:-translate-y-1 hover:bg-purple-500/20"
                >
                  <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-purple-400/10 blur-2xl" />
                  <div className="relative flex items-start justify-between">
                    <span className="text-3xl">📡</span>
                    <span className="text-purple-300">↗</span>
                  </div>
                  <h3 className="relative mt-5 text-base font-black md:text-lg">{t.offlineAlert}</h3>
                  <p className="relative mt-1 text-[9px] leading-4 text-gray-400">{t.offlineAlertNepali}</p>
                </button>

                <button
                  onClick={handleSafeRoute}
                  className="group relative overflow-hidden rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-left transition duration-300 hover:-translate-y-1 hover:bg-green-500/20"
                >
                  <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-green-400/10 blur-2xl" />
                  <div className="relative flex items-start justify-between">
                    <span className="text-3xl">🛡️</span>
                    <span className="text-green-300">↗</span>
                  </div>
                  <h3 className="relative mt-5 text-base font-black md:text-lg">{t.safeRoute}</h3>
                  <p className="relative mt-1 text-[9px] leading-4 text-gray-400">{t.safeRouteNepali}</p>
                </button>

                <button
                  onClick={() => openInformation("helplines")}
                  className="group relative overflow-hidden rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-left transition duration-300 hover:-translate-y-1 hover:bg-orange-500/20"
                >
                  <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-400/10 blur-2xl" />
                  <div className="relative flex items-start justify-between">
                    <span className="text-3xl">☎️</span>
                    <span className="text-orange-300">↗</span>
                  </div>
                  <h3 className="relative mt-5 text-base font-black md:text-lg">{t.helpline}</h3>
                  <p className="relative mt-1 text-[9px] leading-4 text-gray-400">{t.helplineNepali}</p>
                </button>
              </div>
            </section>

            {emergencyActive && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="emergency-alert-title"
              >
                <div className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border-2 border-red-500 bg-gradient-to-b from-red-950 via-black to-red-950 p-6 text-center shadow-[0_0_90px_rgba(239,68,68,0.55)] md:p-10">
                  <div className="absolute inset-0 animate-pulse bg-red-500/[0.05]" />

                  <div className="relative">
                    <div className="mx-auto flex h-24 w-24 animate-pulse items-center justify-center rounded-full border-4 border-red-400 bg-red-500/15 text-6xl shadow-[0_0_50px_rgba(239,68,68,0.7)] md:h-32 md:w-32 md:text-7xl">
                      🚨
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-3 text-red-300">
                      <span className="h-2 w-10 animate-pulse rounded-full bg-red-500 md:w-16" />
                      <span className="text-xs font-black uppercase tracking-[0.3em] md:text-base">
                        EMERGENCY ALERT
                      </span>
                      <span className="h-2 w-10 animate-pulse rounded-full bg-red-500 md:w-16" />
                    </div>

                    <h2
                      id="emergency-alert-title"
                      className="mt-4 text-4xl font-black leading-tight text-white md:text-6xl"
                    >
                      {language === "ne"
                        ? "🚨 आपतकालीन सूचना!"
                        : "🚨 EMERGENCY ALERT!"}
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-base font-bold leading-7 text-red-100 md:text-xl">
                      {language === "ne"
                        ? "तत्काल सुरक्षित स्थानतर्फ जानुहोस्। वरिपरिका मानिसलाई पनि सचेत गराउनुहोस्।"
                        : "Move to a safe place immediately and warn people around you."}
                    </p>

                    <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-3 rounded-2xl border border-red-400/30 bg-red-500/10 px-5 py-4">
                      <span className="animate-pulse text-3xl">🔊</span>
                      <div className="text-left">
                        <p className="text-sm font-black text-red-200">
                          {language === "ne" ? "साइरन सक्रिय" : "SIREN ACTIVE"}
                        </p>
                        <p className="text-[11px] text-red-100/60">
                          {language === "ne"
                            ? "१० सेकेन्डसम्म चेतावनी ध्वनि"
                            : "10-second warning siren"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={() => {
                          stopEmergencySiren();
                          setEmergencyActive(false);
                        }}
                        className="rounded-2xl bg-red-600 px-6 py-4 text-base font-black text-white shadow-[0_0_28px_rgba(239,68,68,0.4)] transition hover:bg-red-500"
                      >
                        {language === "ne"
                          ? "ठीक छ — सुरक्षित स्थानतर्फ"
                          : "OK — Move to safety"}
                      </button>

                      <button
                        onClick={handleEmergencyCall}
                        className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-base font-black text-white transition hover:bg-white/10"
                      >
                        📞 {language === "ne" ? "100 मा फोन गर्नुहोस्" : "Call 100"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SIMPLE SAFETY STRIP */}
            <section className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400/10 text-lg">⚡</span>
                <p className="text-xs leading-5 text-gray-400">
                  {language === "ne"
                    ? "आपतकालमा पहिले सुरक्षित स्थान रोज्नुहोस्, त्यसपछि सहायता माग्नुहोस्।"
                    : "In an emergency, move toward safety first and then request assistance."}
                </p>
              </div>
              <button
                onClick={() => openInformation("information")}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold text-gray-300 transition hover:bg-white/10"
              >
                {t.info} →
              </button>
            </section>
          </div>
        )}

        {/* =====================================================
            INFORMATION TAB
        ===================================================== */}

        {activeTab === "information" && (
          <div>

            {/* INFORMATION HEADER */}

            <section className="mt-5 rounded-3xl border border-cyan-500/20 bg-cyan-500/[0.05] p-5">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-3xl">
                  ℹ️
                </div>

                <div>

                  <h2 className="text-xl font-bold">
                    {t.info}
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    {language === "ne"
                      ? "विपद्, जोखिम, सेन्सर र सुरक्षित स्थान सम्बन्धी जानकारी"
                      : "Disaster, risk, sensor and safe-zone information"}
                  </p>

                </div>

              </div>
            </section>

            {/* QUICK NOTIFICATION */}

            <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

              <button
                onClick={
                  handleSendNotification
                }
                className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-left transition hover:bg-yellow-500/15"
              >

                <div className="flex items-center gap-3">

                  <span className="text-2xl">
                    🔔
                  </span>

                  <div>

                    <p className="font-semibold">
                      Emergency Notification
                    </p>

                    <p className="text-xs text-gray-500">
                      Browser notification test
                    </p>

                  </div>

                </div>
              </button>

              <button
                onClick={
                  requestNotification
                }
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.06]"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="font-semibold">
                      Notification Permission
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {notificationPermission ===
                      "granted"
                        ? "Granted"
                        : notificationPermission ===
                          "denied"
                        ? "Denied"
                        : "Not requested"}
                    </p>

                  </div>

                  <span className="text-xl">
                    ⚙️
                  </span>

                </div>

              </button>

            </section>

            {/* HELPLINES */}

            <section
              id="helplines"
              className="mt-7 scroll-mt-24"
            >

              <div className="mb-4 flex items-center gap-3">

                <div className="h-8 w-1 rounded-full bg-red-500" />

                <div>

                  <h2 className="text-lg font-bold">
                    {t.helpline}
                  </h2>

                  <p className="text-[10px] text-gray-500">
                    एक क्लिकमा सम्पर्क गर्नुहोस्
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                {emergencyContacts.map(
                  (contact) => (
                    <a
                      key={contact.number}
                      href={`tel:${contact.number}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-1 hover:bg-white/[0.07]"
                    >

                      <div className="flex items-center justify-between">

                        <span className="text-2xl">
                          {contact.icon}
                        </span>

                        <span className="text-xs text-gray-500">
                          ☎
                        </span>

                      </div>

                      <p className="mt-4 text-sm font-semibold">
                        {contact.title}
                      </p>

                      <p className="text-[10px] text-gray-500">
                        {contact.english}
                      </p>

                      <p className="mt-2 text-2xl font-black">
                        {contact.number}
                      </p>

                    </a>
                  )
                )}

              </div>
            </section>

            {/* RISK */}

            <section
              id="dashboard"
              className="mt-8 scroll-mt-24"
            >

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-bold">
                    {t.risk}
                  </h2>
                </div>

                <button
                  onClick={() =>
                    scrollToSection(
                      "sensors"
                    )
                  }
                  className="text-xs text-cyan-400"
                >
                  {t.dashboard} →
                </button>

              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  <div className="flex items-center gap-4">

                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-8 border-green-500/20">

                      <div className="text-center">

                        <p
                          className={`text-2xl font-black ${getRiskColor()}`}
                        >
                          {risk}
                        </p>

                        <p className="text-[8px] text-gray-500">
                          / 100
                        </p>

                      </div>

                    </div>

                    <div>

                      <h3
                        className={`text-xl font-bold ${getRiskColor()}`}
                      >
                        {getRiskText()}
                      </h3>

                      <span className="mt-2 inline-block rounded-full bg-green-500/10 px-3 py-1 text-[10px] font-bold text-green-400">
                        {risk < 60
                          ? "LOW"
                          : risk < 80
                          ? "MEDIUM"
                          : "HIGH"}
                      </span>

                    </div>

                  </div>

                  <div className="grid grid-cols-3 gap-2">

                    <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-center">

                      <p className="text-xl">
                        🌧️
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        {t.rain}
                      </p>

                      <p className="text-xs text-green-400">
                        {sensor.rainfall < 80
                          ? t.normal
                          : "High"}
                      </p>

                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-center">

                      <p className="text-xl">
                        ⛰️
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        {t.landslide}
                      </p>

                      <p className="text-xs text-green-400">
                        {risk < 80
                          ? t.low
                          : "High"}
                      </p>

                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-center">

                      <p className="text-xl">
                        🌊
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        {t.flood}
                      </p>

                      <p className="text-xs text-green-400">
                        {t.low}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="mt-6">

                  <div className="mb-2 flex justify-between text-[10px] text-gray-500">

                    <span>
                      LOW
                    </span>

                    <span>
                      MEDIUM
                    </span>

                    <span>
                      HIGH
                    </span>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white/10">

                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        risk >= 80
                          ? "bg-red-500"
                          : risk >= 60
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: riskWidth,
                      }}
                    />

                  </div>

                </div>

              </div>
            </section>

            {/* SENSORS */}

            <section
              id="sensors"
              className="mt-8 scroll-mt-24"
            >

              <div className="mb-4">

                <h2 className="text-lg font-bold">
                  {t.sensors}
                </h2>

                <p className="text-xs text-gray-500">
                  Real-time prototype sensor monitoring
                </p>

              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-5">

                <SensorCard
                  icon="🌧️"
                  title="Rainfall"
                  value={sensor.rainfall.toFixed(
                    0
                  )}
                  unit="%"
                  status={
                    sensor.rainfall > 80
                      ? "High"
                      : "Normal"
                  }
                />

                <SensorCard
                  icon="💧"
                  title="Soil Moisture"
                  value={sensor.soilMoisture.toFixed(
                    0
                  )}
                  unit="%"
                  status={
                    sensor.soilMoisture > 80
                      ? "High"
                      : "Normal"
                  }
                />

                <SensorCard
                  icon="📳"
                  title="Ground Movement"
                  value={sensor.groundMovement.toFixed(
                    1
                  )}
                  unit="mm"
                  status={
                    sensor.groundMovement > 6
                      ? "High"
                      : "Stable"
                  }
                />

                <SensorCard
                  icon="💦"
                  title="Pore Pressure"
                  value={sensor.porePressure.toFixed(
                    0
                  )}
                  unit="%"
                  status={
                    sensor.porePressure > 70
                      ? "High"
                      : "Normal"
                  }
                />

                <SensorCard
                  icon="📐"
                  title="Tilt"
                  value={sensor.tilt.toFixed(
                    1
                  )}
                  unit="°"
                  status={
                    sensor.tilt > 3
                      ? "High"
                      : "Stable"
                  }
                />

              </div>
            </section>

            {/* AI ANALYSIS */}

            <section className="mt-8 rounded-3xl border border-purple-500/20 bg-purple-500/[0.06] p-5">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/15 text-2xl">
                  🤖
                </div>

                <div>

                  <h2 className="text-lg font-bold">
                    {t.aiAnalysis}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-300">

                    {risk >= 80
                      ? language === "ne"
                        ? "विभिन्न सेन्सरबाट प्राप्त तथ्यांकमा जोखिम बढेको संकेत देखिएको छ। तत्काल सतर्क रहनुहोस् र सुरक्षित स्थानतर्फ जान तयार हुनुहोस्।"
                        : "Sensor data indicates elevated risk. Stay alert and prepare to move toward a safe location."
                      : risk >= 60
                      ? language === "ne"
                        ? "वर्षा तथा माटोको चिस्यान सामान्यभन्दा माथि देखिएको छ। जोखिम क्षेत्रका मानिसले सतर्कता अपनाउनु राम्रो हुन्छ।"
                        : "Rainfall and soil moisture are above normal. People in risk areas should remain alert."
                      : language === "ne"
                      ? "हाल प्राप्त सेन्सर तथ्यांकअनुसार तत्काल ठूलो जोखिमको संकेत देखिएको छैन। प्रणालीले निरन्तर निगरानी गरिरहेको छ।"
                      : "Current sensor data does not indicate immediate high risk. The system continues monitoring."}

                  </p>

                </div>

              </div>
            </section>

            {/* SAFE ZONE */}

            <section
              id="safe-zone"
              className="mt-8 scroll-mt-24"
            >

              <div className="overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-r from-green-500/15 to-cyan-500/10">

                <div className="flex flex-col items-start justify-between gap-5 p-5 md:flex-row md:items-center">

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/15 text-3xl">
                      🛡️
                    </div>

                    <div>

                      <h2 className="text-lg font-bold text-green-300">
                        {t.safePlace}
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        {t.findSafe}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={
                      handleSafeRoute
                    }
                    className="rounded-xl bg-green-500 px-5 py-3 text-xs font-bold text-black transition hover:bg-green-400"
                  >
                    📍 {t.route}
                  </button>

                </div>
              </div>
            </section>

            {/* MONITORING */}

            <section className="mt-8">

              <div className="mb-4">

                <h2 className="text-lg font-bold">
                  {t.monitoring}
                </h2>

              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                {[
                  [
                    "Jaljala Risk Zone",
                    "Parbat",
                    "LOW",
                  ],
                  [
                    "River Corridor",
                    "Gandaki",
                    "LOW",
                  ],
                  [
                    "Mountain Slope",
                    "Risk Area",
                    "MEDIUM",
                  ],
                ].map(
                  ([
                    name,
                    place,
                    status,
                  ]) => (
                    <div
                      key={name}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >

                      <div className="flex items-center justify-between">

                        <span className="text-2xl">
                          📍
                        </span>

                        <span
                          className={`rounded-full px-2 py-1 text-[9px] ${
                            status === "LOW"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-yellow-500/10 text-yellow-400"
                          }`}
                        >
                          {status}
                        </span>

                      </div>

                      <h3 className="mt-4 font-semibold">
                        {name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {place}
                      </p>

                    </div>
                  )
                )}

              </div>
            </section>

            {/* IMPORTANT INFORMATION */}

            <section
              id="information"
              className="mt-8 scroll-mt-24"
            >

              <div className="mb-4 flex items-center gap-3">

                <div className="h-8 w-1 rounded-full bg-orange-500" />

                <div>

                  <h2 className="text-lg font-bold">
                    {t.information}
                  </h2>

                </div>

              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                <InfoCard
                  icon="🌧️"
                  title="Heavy Rain"
                  text="भारी वर्षा भएमा नदी तथा पहिरो जोखिम क्षेत्रबाट टाढा रहनुहोस्।"
                />

                <InfoCard
                  icon="⛰️"
                  title="Landslide"
                  text="पहिरोको संकेत देखिएमा तुरुन्त सुरक्षित स्थानतर्फ जानुहोस्।"
                />

                <InfoCard
                  icon="📢"
                  title="Emergency"
                  text="आपतकालमा 100, 102, 101 जस्ता आपतकालीन नम्बरमा सम्पर्क गर्नुहोस्।"
                />

              </div>
            </section>

            {/* OFFLINE INFO */}

            <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.025] p-5">

              <div className="flex items-start gap-4">

                <div className="text-3xl">
                  {mounted &&
                  isOnline
                    ? "🌐"
                    : "📡"}
                </div>

                <div>

                  <h2 className="font-bold">
                    {mounted &&
                    isOnline
                      ? "Internet Connected"
                      : "Offline Mode Active"}
                  </h2>

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    GPS location फोनको GPS hardware बाट प्राप्त गर्न सकिन्छ।
                    Internet नभएको अवस्थामा SMS fallback प्रयोग गर्न सकिन्छ,
                    यदि mobile network उपलब्ध छ भने।
                  </p>

                </div>

              </div>
            </section>

            {/* FOOTER */}

            <footer className="mt-10 border-t border-white/10 py-8 text-center">

              <div className="text-sm font-black tracking-widest">
                BIPATRAKSHYA
              </div>

              <p className="mt-2 text-xs text-gray-600">
                Disaster Early Warning & Emergency Assistance System
              </p>

              <p className="mt-4 text-[10px] text-gray-700">
                Prototype Version • Nepal
              </p>

            </footer>

          </div>
        )}

      </div>

      {/* =====================================================
          BOTTOM NAVIGATION
          6 BUTTONS
      ===================================================== */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#08090b]/95 backdrop-blur-xl">

        <div className="mx-auto grid max-w-4xl grid-cols-6">

          {/* HOME */}

          <BottomNavButton
            icon="⌂"
            label={t.home}
            active={
              activeTab === "home"
            }
            onClick={() => {
              setActiveTab("home");

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />

          {/* NOTICE - OLD BUTTON KEPT */}

          <BottomNavButton
            icon="🔔"
            label={t.notice}
            badge="3"
            active={false}
            onClick={() =>
              openInformation(
                "information"
              )
            }
          />

          {/* NEW INFORMATION BUTTON */}

          <BottomNavButton
            icon="ℹ️"
            label={t.info}
            active={
              activeTab ===
              "information"
            }
            onClick={() =>
              openInformation()
            }
          />

         {/* MAP - DIRECT MAP PAGE */}

<Link
  href="/map"
  className="relative flex min-w-0 flex-col items-center justify-center py-3 text-[9px] text-gray-500 transition hover:text-white sm:text-[10px]"
>
  <span className="relative text-lg">
    🗺️
  </span>

  <span className="mt-1 truncate px-1">
    {t.map}
  </span>
</Link>

          {/* SAFE ZONE */}

          <BottomNavButton
            icon="🛡️"
            label={t.safeZone}
            active={false}
            onClick={() =>
              openInformation(
                "safe-zone"
              )
            }
          />

          {/* MORE */}

          <BottomNavButton
            icon="☰"
            label={t.more}
            active={false}
            onClick={() =>
              openInformation(
                "dashboard"
              )
            }
          />

        </div>
      </nav>
    </main>
  );
}

/* ==========================================================
   SENSOR CARD
========================================================== */

function SensorCard({
  icon,
  title,
  value,
  unit,
  status,
}: {
  icon: string;
  title: string;
  value: string;
  unit: string;
  status: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">

      <div className="flex items-center justify-between">

        <span className="text-xl">
          {icon}
        </span>

        <span className="h-2 w-2 rounded-full bg-green-400" />

      </div>

      <p className="mt-4 text-[10px] text-gray-500">
        {title}
      </p>

      <div className="mt-1 flex items-end gap-1">

        <span className="text-xl font-black">
          {value}
        </span>

        <span className="mb-1 text-[9px] text-gray-500">
          {unit}
        </span>

      </div>

      <p className="mt-2 text-[9px] text-green-400">
        {status}
      </p>

    </div>
  );
}

/* ==========================================================
   INFO CARD
========================================================== */

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <span className="text-2xl">
        {icon}
      </span>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-gray-500">
        {text}
      </p>

    </div>
  );
}

/* ==========================================================
   BOTTOM NAV BUTTON
========================================================== */

function BottomNavButton({
  icon,
  label,
  active = false,
  badge,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex min-w-0 flex-col items-center justify-center py-3 text-[9px] transition sm:text-[10px] ${
        active
          ? "text-cyan-400"
          : "text-gray-500 hover:text-white"
      }`}
    >

      <span className="relative text-lg">

        {icon}

        {badge && (
          <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] text-white">
            {badge}
          </span>
        )}

      </span>

      <span className="mt-1 truncate px-1">
        {label}
      </span>

      {active && (
        <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-cyan-400" />
      )}

    </button>
  );
}