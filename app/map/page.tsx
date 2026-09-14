"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

/* =========================================================
   TYPES
========================================================= */

type Location = {
  latitude: number;
  longitude: number;
};

type SafeZone = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
  type: string;
  ward: number;
};

type Ward = {
  id: number;
  name: string;
  center: [number, number];
  polygon: [number, number][];
  population: string;
  risk: string;
};

type RiskZone = {
  id: number;
  name: string;
  type: "landslide" | "flood" | "slope";
  color: string;
  polygon: [number, number][];
  description: string;
};

type SensorStation = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  sensors: string;
  status: "online" | "offline";
};

/* =========================================================
   JALJALA CENTER
========================================================= */

const JALJALA_CENTER: [number, number] = [28.23, 83.65];

/* =========================================================
   WARDS
========================================================= */

const WARDS: Ward[] = [
  {
    id: 1,
    name: "वडा नं. १",
    center: [28.245, 83.635],
    polygon: [
      [28.255, 83.625],
      [28.258, 83.645],
      [28.246, 83.658],
      [28.235, 83.647],
      [28.238, 83.628],
    ],
    population: "Prototype",
    risk: "पहिरो / slope",
  },
  {
    id: 2,
    name: "वडा नं. २",
    center: [28.235, 83.635],
    polygon: [
      [28.238, 83.628],
      [28.246, 83.658],
      [28.232, 83.667],
      [28.221, 83.652],
      [28.223, 83.635],
    ],
    population: "Prototype",
    risk: "पहिरो / बस्ती",
  },
  {
    id: 3,
    name: "वडा नं. ३",
    center: [28.225, 83.645],
    polygon: [
      [28.223, 83.635],
      [28.221, 83.652],
      [28.21, 83.661],
      [28.201, 83.648],
      [28.207, 83.632],
    ],
    population: "Prototype",
    risk: "Flood / erosion",
  },
  {
    id: 4,
    name: "वडा नं. ४",
    center: [28.245, 83.665],
    polygon: [
      [28.246, 83.658],
      [28.258, 83.675],
      [28.248, 83.692],
      [28.232, 83.683],
      [28.232, 83.667],
    ],
    population: "Prototype",
    risk: "Slope",
  },
  {
    id: 5,
    name: "वडा नं. ५",
    center: [28.225, 83.675],
    polygon: [
      [28.232, 83.667],
      [28.232, 83.683],
      [28.219, 83.694],
      [28.206, 83.681],
      [28.21, 83.661],
    ],
    population: "Prototype",
    risk: "पहिरो / slope",
  },
  {
    id: 6,
    name: "वडा नं. ६",
    center: [28.205, 83.675],
    polygon: [
      [28.21, 83.661],
      [28.206, 83.681],
      [28.195, 83.691],
      [28.184, 83.678],
      [28.19, 83.658],
    ],
    population: "Prototype",
    risk: "Flood / erosion",
  },
  {
    id: 7,
    name: "वडा नं. ७",
    center: [28.255, 83.695],
    polygon: [
      [28.258, 83.675],
      [28.272, 83.689],
      [28.268, 83.71],
      [28.248, 83.71],
      [28.248, 83.692],
    ],
    population: "Prototype",
    risk: "High slope",
  },
  {
    id: 8,
    name: "वडा नं. ८",
    center: [28.225, 83.705],
    polygon: [
      [28.248, 83.692],
      [28.248, 83.71],
      [28.231, 83.724],
      [28.214, 83.715],
      [28.219, 83.694],
    ],
    population: "Prototype",
    risk: "पहिरो",
  },
  {
    id: 9,
    name: "वडा नं. ९",
    center: [28.198, 83.7],
    polygon: [
      [28.219, 83.694],
      [28.214, 83.715],
      [28.197, 83.721],
      [28.184, 83.704],
      [28.195, 83.691],
    ],
    population: "Prototype",
    risk: "Kali Gandaki / erosion",
  },
];

/* =========================================================
   SAFE ZONES
========================================================= */

const SAFE_ZONES: SafeZone[] = [
  {
    id: 1,
    name: "Jaljala मुख्य सुरक्षित खुला क्षेत्र",
    latitude: 28.232,
    longitude: 83.652,
    capacity: 800,
    type: "Open Safe Area",
    ward: 2,
  },
  {
    id: 2,
    name: "सुरक्षित विद्यालय क्षेत्र",
    latitude: 28.245,
    longitude: 83.642,
    capacity: 400,
    type: "School Safe Area",
    ward: 1,
  },
  {
    id: 3,
    name: "सामुदायिक सुरक्षित क्षेत्र",
    latitude: 28.215,
    longitude: 83.675,
    capacity: 500,
    type: "Community Safe Area",
    ward: 5,
  },
  {
    id: 4,
    name: "आपतकालीन सुरक्षित मैदान",
    latitude: 28.255,
    longitude: 83.695,
    capacity: 1000,
    type: "Emergency Open Ground",
    ward: 7,
  },
  {
    id: 5,
    name: "दक्षिण सुरक्षित क्षेत्र",
    latitude: 28.195,
    longitude: 83.7,
    capacity: 600,
    type: "Open Safe Area",
    ward: 9,
  },
];

/* =========================================================
   RISK ZONES
========================================================= */

const RISK_ZONES: RiskZone[] = [
  {
    id: 1,
    name: "Prototype Landslide Zone A",
    type: "landslide",
    color: "#dc2626",
    polygon: [
      [28.245, 83.655],
      [28.253, 83.666],
      [28.247, 83.679],
      [28.235, 83.671],
      [28.236, 83.657],
    ],
    description:
      "सम्भावित पहिरो जोखिम क्षेत्र। Field verification आवश्यक।",
  },
  {
    id: 2,
    name: "Prototype High Slope Zone",
    type: "slope",
    color: "#f97316",
    polygon: [
      [28.257, 83.682],
      [28.268, 83.693],
      [28.262, 83.707],
      [28.249, 83.704],
      [28.248, 83.691],
    ],
    description:
      "High-risk slope prototype area। Sensor monitoring आवश्यक।",
  },
  {
    id: 3,
    name: "Kali Gandaki Flood / Erosion Zone",
    type: "flood",
    color: "#2563eb",
    polygon: [
      [28.205, 83.63],
      [28.214, 83.642],
      [28.205, 83.657],
      [28.194, 83.67],
      [28.184, 83.658],
      [28.19, 83.642],
    ],
    description:
      "नदी बाढी तथा कटान prototype monitoring zone।",
  },
  {
    id: 4,
    name: "Prototype Landslide Zone B",
    type: "landslide",
    color: "#dc2626",
    polygon: [
      [28.215, 83.681],
      [28.226, 83.689],
      [28.22, 83.701],
      [28.207, 83.697],
      [28.206, 83.684],
    ],
    description:
      "सम्भावित पहिरो क्षेत्र। वास्तविक boundary field survey पछि update हुनेछ।",
  },
];

/* =========================================================
   SENSOR STATIONS
========================================================= */

const SENSOR_STATIONS: SensorStation[] = [
  {
    id: 1,
    name: "Sensor Station #01",
    latitude: 28.245,
    longitude: 83.665,
    sensors: "Rain • Soil • Tilt • Vibration",
    status: "online",
  },
  {
    id: 2,
    name: "Sensor Station #02",
    latitude: 28.218,
    longitude: 83.681,
    sensors: "Rain • Soil • Tilt",
    status: "online",
  },
  {
    id: 3,
    name: "Kali Gandaki Station",
    latitude: 28.198,
    longitude: 83.65,
    sensors: "Water Level • Rain • Vibration",
    status: "offline",
  },
];

/* =========================================================
   DISTANCE
========================================================= */

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const earthRadius = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

/* =========================================================
   PAGE
========================================================= */

export default function MapPage() {
  const [location, setLocation] = useState<Location | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [tracking, setTracking] = useState(false);

  const [nearestZone, setNearestZone] =
    useState<SafeZone | null>(null);

  const [nearestDistance, setNearestDistance] =
    useState<number | null>(null);

  const [selectedWard, setSelectedWard] =
    useState<Ward | null>(null);

  const [isOnline, setIsOnline] = useState(true);

  const [routeDistance, setRouteDistance] =
    useState<number | null>(null);

  const [routeLoading, setRouteLoading] =
    useState(false);

  const leafletRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  const userMarkerRef = useRef<any>(null);

  const wardLayersRef = useRef<any[]>([]);
  const riskLayersRef = useRef<any[]>([]);
  const routeLayerRef = useRef<any>(null);

  const safeMarkersRef = useRef<any[]>([]);
  const sensorMarkersRef = useRef<any[]>([]);

  const watchIdRef = useRef<number | null>(null);

  /* =======================================================
     ONLINE / OFFLINE
  ======================================================= */

  useEffect(() => {
    const updateOnline = () => {
      setIsOnline(navigator.onLine);
    };

    updateOnline();

    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);

    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, []);

  /* =======================================================
     SELECT WARD
  ======================================================= */

  const selectWard = (ward: Ward) => {
    setSelectedWard(ward);

    const map = mapRef.current;

    if (map) {
      map.flyTo(ward.center, 14, {
        duration: 1,
      });
    }

    wardLayersRef.current.forEach((layer) => {
      const layerWardId = (layer as any).__wardId;

      if (layerWardId === ward.id) {
        layer.setStyle({
          color: "#facc15",
          weight: 4,
          fillColor: "#facc15",
          fillOpacity: 0.3,
        });

        layer.bringToFront();
      } else {
        layer.setStyle({
          color: "#64748b",
          weight: 2,
          fillColor: "#475569",
          fillOpacity: 0.12,
        });
      }
    });
  };

  /* =======================================================
     INITIALIZE MAP
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const initMap = async () => {
      try {
        const L = (await import("leaflet")).default;

        if (cancelled) return;

        leafletRef.current = L;

        if (mapRef.current) return;

        const map = L.map("bipat-map", {
          zoomControl: true,
          attributionControl: true,
        }).setView(JALJALA_CENTER, 12);

        mapRef.current = map;

        /* =================================================
           TILE LAYER
        ================================================= */

        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
              "&copy; OpenStreetMap contributors",
          }
        ).addTo(map);

        /* =================================================
           WARD POLYGONS
        ================================================= */

        WARDS.forEach((ward) => {
          const polygon = L.polygon(ward.polygon, {
            color: "#64748b",
            weight: 2,
            fillColor: "#475569",
            fillOpacity: 0.12,
          }).addTo(map);

          /* FIX: STORE WARD ID */
          (polygon as any).__wardId = ward.id;

          polygon.bindTooltip(
            `<strong>${ward.name}</strong><br/>Risk: ${ward.risk}`,
            {
              permanent: true,
              direction: "center",
              className: "ward-label",
            }
          );

          polygon.on("click", () => {
            selectWard(ward);
          });

          wardLayersRef.current.push(polygon);
        });

        /* =================================================
           SAFE ZONES
        ================================================= */

        const safeIcon = L.divIcon({
          className: "safe-zone-marker",
          html: `
            <div style="
              width:44px;
              height:44px;
              border-radius:50%;
              background:#16a34a;
              border:4px solid white;
              box-shadow:0 4px 15px rgba(0,0,0,.35);
              display:flex;
              align-items:center;
              justify-content:center;
              color:white;
              font-size:23px;
              font-weight:bold;
            ">
              🛡️
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });

        SAFE_ZONES.forEach((zone) => {
          const marker = L.marker(
            [zone.latitude, zone.longitude],
            {
              icon: safeIcon,
            }
          ).addTo(map);

          marker.bindPopup(`
            <div style="min-width:220px">
              <strong style="font-size:16px;">
                🛡️ ${zone.name}
              </strong>

              <hr style="margin:8px 0"/>

              <div>📍 वडा: ${zone.ward}</div>
              <div>👥 Capacity: ${zone.capacity}</div>
              <div>🏕️ ${zone.type}</div>

              <div style="
                margin-top:8px;
                padding:6px;
                background:#dcfce7;
                color:#166534;
                border-radius:6px;
                font-weight:bold;
              ">
                सुरक्षित क्षेत्र
              </div>
            </div>
          `);

          safeMarkersRef.current.push(marker);
        });

        /* =================================================
           RISK ZONES
        ================================================= */

        RISK_ZONES.forEach((risk) => {
          const polygon = L.polygon(risk.polygon, {
            color: risk.color,
            weight: 3,
            fillColor: risk.color,
            fillOpacity: 0.2,
            dashArray: "8 6",
          }).addTo(map);

          polygon.bindPopup(`
            <div style="min-width:230px">
              <strong style="font-size:16px;">
                ⚠️ ${risk.name}
              </strong>

              <hr style="margin:8px 0"/>

              <div>
                <strong>Risk:</strong> ${risk.type}
              </div>

              <div style="margin-top:8px;">
                ${risk.description}
              </div>

              <div style="
                margin-top:8px;
                padding:6px;
                background:#fee2e2;
                color:#991b1b;
                border-radius:6px;
                font-weight:bold;
              ">
                जोखिम क्षेत्र
              </div>
            </div>
          `);

          riskLayersRef.current.push(polygon);
        });

        /* =================================================
           SENSOR STATIONS
        ================================================= */

        SENSOR_STATIONS.forEach((sensor) => {
          const statusColor =
            sensor.status === "online"
              ? "#7c3aed"
              : "#64748b";

          const sensorIcon = L.divIcon({
            className: "sensor-marker",
            html: `
              <div style="
                width:40px;
                height:40px;
                border-radius:50%;
                background:${statusColor};
                border:3px solid white;
                box-shadow:0 4px 14px rgba(0,0,0,.35);
                display:flex;
                align-items:center;
                justify-content:center;
                color:white;
                font-size:19px;
              ">
                📡
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });

          const marker = L.marker(
            [sensor.latitude, sensor.longitude],
            {
              icon: sensorIcon,
            }
          ).addTo(map);

          marker.bindPopup(`
            <div style="min-width:230px">
              <strong style="font-size:16px;">
                📡 ${sensor.name}
              </strong>

              <hr style="margin:8px 0"/>

              <div>
                <strong>Sensors:</strong>
              </div>

              <div style="margin-top:4px;">
                ${sensor.sensors}
              </div>

              <div style="
                margin-top:8px;
                color:${
                  sensor.status === "online"
                    ? "#15803d"
                    : "#64748b"
                };
                font-weight:bold;
              ">
                ● ${sensor.status.toUpperCase()}
              </div>
            </div>
          `);

          sensorMarkersRef.current.push(marker);
        });

        setTimeout(() => {
          map.invalidateSize();
        }, 200);
      } catch (error) {
        console.error(
          "Leaflet map initialization failed:",
          error
        );
      }
    };

    initMap();

    return () => {
      cancelled = true;

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(
          watchIdRef.current
        );

        watchIdRef.current = null;
      }

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      leafletRef.current = null;

      wardLayersRef.current = [];
      riskLayersRef.current = [];
      safeMarkersRef.current = [];
      sensorMarkersRef.current = [];
      routeLayerRef.current = null;
      userMarkerRef.current = null;
    };
  }, []);

  /* =======================================================
     UPDATE USER LOCATION
  ======================================================= */

  const updateUserLocation = (
    latitude: number,
    longitude: number
  ) => {
    const L = leafletRef.current;
    const map = mapRef.current;

    if (!L || !map) return;

    const userLocation: Location = {
      latitude,
      longitude,
    };

    setLocation(userLocation);

    const userIcon = L.divIcon({
      className: "user-location-marker",
      html: `
        <div style="
          width:48px;
          height:48px;
          border-radius:50%;
          background:#2563eb;
          border:4px solid white;
          box-shadow:
            0 0 0 8px rgba(37,99,235,.20),
            0 5px 20px rgba(0,0,0,.4);
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:21px;
        ">
          📍
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([
        latitude,
        longitude,
      ]);
    } else {
      userMarkerRef.current = L.marker(
        [latitude, longitude],
        {
          icon: userIcon,
          zIndexOffset: 1000,
        }
      ).addTo(map);

      userMarkerRef.current.bindPopup(`
        <strong>📍 तपाईंको स्थान</strong>
      `);
    }

    /* =====================================================
       FIND NEAREST SAFE ZONE
    ===================================================== */

    let nearest: SafeZone | null = null;
    let shortest = Infinity;

    SAFE_ZONES.forEach((zone) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        zone.latitude,
        zone.longitude
      );

      if (distance < shortest) {
        shortest = distance;
        nearest = zone;
      }
    });

    setNearestZone(nearest);
    setNearestDistance(
      shortest === Infinity ? null : shortest
    );
  };

  /* =======================================================
     GET LOCATION
  ======================================================= */

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert(
        "तपाईंको browser ले GPS support गर्दैन।"
      );
      return;
    }

    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateUserLocation(
          position.coords.latitude,
          position.coords.longitude
        );

        setGpsLoading(false);

        const map = mapRef.current;

        if (map) {
          map.flyTo(
            [
              position.coords.latitude,
              position.coords.longitude,
            ],
            15,
            {
              duration: 1.5,
            }
          );
        }
      },
      (error) => {
        console.error(error);

        setGpsLoading(false);

        alert(
          "GPS location प्राप्त हुन सकेन। Browser location permission Allow गर्नुहोस्।"
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  /* =======================================================
     START GPS TRACKING
  ======================================================= */

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("GPS support छैन।");
      return;
    }

    if (watchIdRef.current !== null) {
      return;
    }

    setTracking(true);

    watchIdRef.current =
      navigator.geolocation.watchPosition(
        (position) => {
          updateUserLocation(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 3000,
          timeout: 10000,
        }
      );
  };

  /* =======================================================
     STOP TRACKING
  ======================================================= */

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(
        watchIdRef.current
      );

      watchIdRef.current = null;
    }

    setTracking(false);
  };

  /* =======================================================
     CLEAR ROUTE
  ======================================================= */

  const clearRoute = () => {
    if (
      routeLayerRef.current &&
      mapRef.current
    ) {
      mapRef.current.removeLayer(
        routeLayerRef.current
      );

      routeLayerRef.current = null;
    }

    setRouteDistance(null);
  };

  /* =======================================================
     SAFE ROUTE
  ======================================================= */

  const showSafeRoute = async () => {
    if (!location) {
      getLocation();

      alert(
        "पहिले GPS location प्राप्त गर्दैछु। फेरि Safe Route थिच्नुहोस्।"
      );

      return;
    }

    if (!nearestZone) {
      alert("नजिकको Safe Zone भेटिएन।");
      return;
    }

    const L = leafletRef.current;
    const map = mapRef.current;

    if (!L || !map) return;

    setRouteLoading(true);

    clearRoute();

    const startLon = location.longitude;
    const startLat = location.latitude;

    const endLon = nearestZone.longitude;
    const endLat = nearestZone.latitude;

    try {
      /* ===============================================
         ONLINE ROUTING
      =============================================== */

      if (navigator.onLine) {
        const url =
          `https://router.project-osrm.org/route/v1/foot/` +
          `${startLon},${startLat};${endLon},${endLat}` +
          `?overview=full&geometries=geojson`;

        const response = await fetch(url);

        const data = await response.json();

        if (
          data &&
          data.routes &&
          data.routes.length > 0
        ) {
          const route = data.routes[0];

          const coordinates =
            route.geometry.coordinates.map(
              (point: [number, number]) => [
                point[1],
                point[0],
              ]
            );

          routeLayerRef.current =
            L.polyline(coordinates, {
              color: "#16a34a",
              weight: 7,
              opacity: 0.9,
            }).addTo(map);

          map.fitBounds(
            routeLayerRef.current.getBounds(),
            {
              padding: [40, 40],
            }
          );

          setRouteDistance(
            route.distance / 1000
          );

          setRouteLoading(false);

          return;
        }
      }

      /* ===============================================
         OFFLINE FALLBACK
      =============================================== */

      const directDistance =
        calculateDistance(
          startLat,
          startLon,
          endLat,
          endLon
        );

      routeLayerRef.current =
        L.polyline(
          [
            [startLat, startLon],
            [endLat, endLon],
          ],
          {
            color: "#f59e0b",
            weight: 6,
            dashArray: "12 10",
            opacity: 0.9,
          }
        ).addTo(map);

      map.fitBounds(
        routeLayerRef.current.getBounds(),
        {
          padding: [50, 50],
        }
      );

      setRouteDistance(directDistance);
    } catch (error) {
      console.error(
        "Safe route error:",
        error
      );

      const directDistance =
        calculateDistance(
          startLat,
          startLon,
          endLat,
          endLon
        );

      routeLayerRef.current =
        L.polyline(
          [
            [startLat, startLon],
            [endLat, endLon],
          ],
          {
            color: "#f59e0b",
            weight: 6,
            dashArray: "12 10",
          }
        ).addTo(map);

      map.fitBounds(
        routeLayerRef.current.getBounds(),
        {
          padding: [50, 50],
        }
      );

      setRouteDistance(directDistance);
    } finally {
      setRouteLoading(false);
    }
  };

  /* =======================================================
     SHOW ENTIRE JALJALA
  ======================================================= */

  const showEntireJaljala = () => {
    const L = leafletRef.current;
    const map = mapRef.current;

    if (!L || !map) return;

    const allPoints: [number, number][] = [];

    WARDS.forEach((ward) => {
      ward.polygon.forEach((point) => {
        allPoints.push(point);
      });
    });

    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);

      map.fitBounds(bounds, {
        padding: [30, 30],
      });
    }
  };

  /* =======================================================
     GOOGLE ROUTE
  ======================================================= */

  const openGoogleRoute = () => {
    if (!location || !nearestZone) {
      getLocation();
      return;
    }

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${location.latitude},${location.longitude}` +
      `&destination=${nearestZone.latitude},${nearestZone.longitude}` +
      `&travelmode=walking`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="sticky top-0 z-[1000] border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-xl font-black shadow-lg">
              B
            </div>

            <div>
              <div className="text-lg font-black">
                BIPATRAKSHYA
              </div>

              <div className="text-xs text-slate-400">
                Disaster Safety System
              </div>
            </div>
          </Link>

          <div
            className={`rounded-full px-3 py-2 text-xs font-bold ${
              isOnline
                ? "bg-green-500/15 text-green-400"
                : "bg-red-500/15 text-red-400"
            }`}
          >
            {isOnline
              ? "● ONLINE"
              : "● OFFLINE"}
          </div>

        </div>
      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-6">

        <div className="mb-5">

          <div className="mb-2 inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
            🗺️ JALJALA SAFETY MAP
          </div>

          <h1 className="text-3xl font-black md:text-4xl">
            Jaljala Disaster Safety Map
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            वडा, सुरक्षित क्षेत्र, जोखिम क्षेत्र,
            sensor station र तपाईंको GPS location
            एउटै नक्सामा हेर्नुहोस्।
          </p>

        </div>

        {/* =================================================
            MAP
        ================================================= */}

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">

          <div
            id="bipat-map"
            className="h-[560px] w-full md:h-[680px]"
          />

          {/* MAP STATUS */}

          <div className="pointer-events-none absolute left-4 top-4 z-[500]">

            <div className="rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-xl backdrop-blur">

              <div className="text-xs font-bold text-slate-400">
                LOCATION
              </div>

              <div className="mt-1 text-sm font-black">
                Jaljala Rural Municipality
              </div>

              <div className="text-xs text-slate-500">
                Parbat, Gandaki Province
              </div>

            </div>

          </div>

          {/* MAP LEGEND */}

          <div className="absolute bottom-4 left-4 z-[500] max-w-[250px] rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-xl backdrop-blur">

            <div className="mb-3 text-sm font-black">
              Map Legend
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                Safe Zone
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-600" />
                Landslide
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-600" />
                Flood
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-orange-500" />
                Slope
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-purple-600" />
                Sensor
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-500" />
                You
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            MAP CONTROLS
        ================================================= */}

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">

          <button
            onClick={getLocation}
            disabled={gpsLoading}
            className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-4 text-left transition hover:bg-blue-500/20 disabled:opacity-50"
          >
            <div className="text-2xl">
              📍
            </div>

            <div className="mt-2 font-black">
              {gpsLoading
                ? "GPS खोज्दै..."
                : "मेरो Location"}
            </div>

            <div className="mt-1 text-xs text-slate-400">
              आफ्नो स्थान देखाउनुहोस्
            </div>
          </button>

          <button
            onClick={
              tracking
                ? stopTracking
                : startTracking
            }
            className={`rounded-2xl border px-4 py-4 text-left transition ${
              tracking
                ? "border-red-500/30 bg-red-500/10"
                : "border-purple-500/20 bg-purple-500/10"
            }`}
          >
            <div className="text-2xl">
              {tracking ? "⛔" : "🛰️"}
            </div>

            <div className="mt-2 font-black">
              {tracking
                ? "Tracking बन्द"
                : "Live Tracking"}
            </div>

            <div className="mt-1 text-xs text-slate-400">
              GPS movement monitor
            </div>
          </button>

          <button
            onClick={showSafeRoute}
            disabled={routeLoading}
            className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-4 text-left transition hover:bg-green-500/20 disabled:opacity-50"
          >
            <div className="text-2xl">
              🛡️
            </div>

            <div className="mt-2 font-black">
              {routeLoading
                ? "Route बनाउँदै..."
                : "Safe Route"}
            </div>

            <div className="mt-1 text-xs text-slate-400">
              नजिकको सुरक्षित ठाउँतर्फ
            </div>
          </button>

          <button
            onClick={showEntireJaljala}
            className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-4 text-left transition hover:bg-yellow-500/20"
          >
            <div className="text-2xl">
              🗺️
            </div>

            <div className="mt-2 font-black">
              पूरा Jaljala
            </div>

            <div className="mt-1 text-xs text-slate-400">
              सबै वडा देखाउनुहोस्
            </div>
          </button>

        </div>

        {/* =================================================
            LOCATION / SAFE ZONE
        ================================================= */}

        {location && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">

            <div className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-5">

              <div className="text-xs font-bold text-blue-400">
                📍 तपाईंको Location
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">

                <div>
                  <div className="text-xs text-slate-500">
                    Latitude
                  </div>

                  <div className="font-mono text-sm">
                    {location.latitude.toFixed(6)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500">
                    Longitude
                  </div>

                  <div className="font-mono text-sm">
                    {location.longitude.toFixed(6)}
                  </div>
                </div>

              </div>

            </div>

            {nearestZone && (
              <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-5">

                <div className="text-xs font-bold text-green-400">
                  🛡️ नजिकको Safe Zone
                </div>

                <div className="mt-2 text-lg font-black">
                  {nearestZone.name}
                </div>

                <div className="mt-2 text-sm text-slate-400">
                  वडा {nearestZone.ward} • Capacity{" "}
                  {nearestZone.capacity}
                </div>

                {nearestDistance !== null && (
                  <div className="mt-3 text-2xl font-black text-green-400">
                    {nearestDistance < 1
                      ? `${Math.round(
                          nearestDistance * 1000
                        )} m`
                      : `${nearestDistance.toFixed(
                          2
                        )} km`}
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">

                  <button
                    onClick={showSafeRoute}
                    className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold transition hover:bg-green-500"
                  >
                    🛡️ Safe Route
                  </button>

                  <button
                    onClick={openGoogleRoute}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold transition hover:bg-white/10"
                  >
                    Google Route
                  </button>

                  <button
                    onClick={clearRoute}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold transition hover:bg-white/10"
                  >
                    Route Clear
                  </button>

                </div>

                {routeDistance !== null && (
                  <div className="mt-3 rounded-xl bg-slate-950/60 p-3 text-sm">
                    🥾 Estimated route:
                    <strong className="ml-1 text-green-400">
                      {routeDistance.toFixed(2)} km
                    </strong>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* =================================================
            SELECTED WARD
        ================================================= */}

        {selectedWard && (
          <div className="mt-4 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-5">

            <div className="flex flex-wrap items-start justify-between gap-4">

              <div>
                <div className="text-xs font-bold text-yellow-400">
                  SELECTED WARD
                </div>

                <h2 className="mt-1 text-2xl font-black">
                  {selectedWard.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedWard(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold"
              >
                बन्द
              </button>

            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">

              <div className="rounded-2xl bg-slate-950/60 p-4">
                <div className="text-xs text-slate-500">
                  Risk
                </div>

                <div className="mt-1 font-bold">
                  {selectedWard.risk}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-950/60 p-4">
                <div className="text-xs text-slate-500">
                  Status
                </div>

                <div className="mt-1 font-bold text-yellow-400">
                  Prototype
                </div>
              </div>

              <div className="rounded-2xl bg-slate-950/60 p-4">
                <div className="text-xs text-slate-500">
                  Center
                </div>

                <div className="mt-1 font-mono text-xs">
                  {selectedWard.center[0].toFixed(4)},{" "}
                  {selectedWard.center[1].toFixed(4)}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =================================================
            WARD LIST
        ================================================= */}

        <div className="mt-6">

          <div className="mb-3">

            <h2 className="text-xl font-black">
              Jaljala Wards
            </h2>

            <p className="text-sm text-slate-500">
              वडा छान्दा नक्सामा तुरुन्त highlight हुन्छ।
            </p>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9">

            {WARDS.map((ward) => (
              <button
                key={ward.id}
                onClick={() => selectWard(ward)}
                className={`rounded-2xl border p-4 text-center transition ${
                  selectedWard?.id === ward.id
                    ? "border-yellow-400 bg-yellow-400/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >

                <div className="text-lg font-black">
                  {ward.id}
                </div>

                <div className="mt-1 text-xs text-slate-400">
                  वडा नं.
                </div>

                <div className="mt-2 line-clamp-2 text-[10px] text-slate-500">
                  {ward.risk}
                </div>

              </button>
            ))}

          </div>

        </div>

        {/* =================================================
            SAFE ZONES
        ================================================= */}

        <div className="mt-8">

          <h2 className="text-xl font-black">
            🛡️ Safe Zones
          </h2>

          <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">

            {SAFE_ZONES.map((zone) => (
              <div
                key={zone.id}
                className="rounded-2xl border border-green-500/15 bg-green-500/5 p-4"
              >

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-600 text-lg">
                    🛡️
                  </div>

                  <div>

                    <div className="font-black">
                      {zone.name}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      वडा {zone.ward} • Capacity{" "}
                      {zone.capacity}
                    </div>

                    <div className="mt-2 text-xs text-green-400">
                      {zone.type}
                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* =================================================
            RISK ZONES
        ================================================= */}

        <div className="mt-8">

          <h2 className="text-xl font-black">
            ⚠️ Risk Zones
          </h2>

          <div className="mt-3 grid gap-3 md:grid-cols-2">

            {RISK_ZONES.map((risk) => (
              <div
                key={risk.id}
                className="rounded-2xl border border-red-500/15 bg-red-500/5 p-4"
              >

                <div className="flex items-start gap-3">

                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                    style={{
                      backgroundColor:
                        risk.color,
                    }}
                  >
                    ⚠️
                  </div>

                  <div>

                    <div className="font-black">
                      {risk.name}
                    </div>

                    <div className="mt-1 text-xs uppercase text-slate-500">
                      {risk.type}
                    </div>

                    <div className="mt-2 text-sm text-slate-400">
                      {risk.description}
                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* =================================================
            SENSOR STATIONS
        ================================================= */}

        <div className="mt-8">

          <h2 className="text-xl font-black">
            📡 Sensor Stations
          </h2>

          <div className="mt-3 grid gap-3 md:grid-cols-3">

            {SENSOR_STATIONS.map((sensor) => (
              <div
                key={sensor.id}
                className="rounded-2xl border border-purple-500/15 bg-purple-500/5 p-4"
              >

                <div className="flex items-center justify-between">

                  <div className="font-black">
                    {sensor.name}
                  </div>

                  <div
                    className={`text-xs font-bold ${
                      sensor.status === "online"
                        ? "text-green-400"
                        : "text-slate-500"
                    }`}
                  >
                    ● {sensor.status}
                  </div>

                </div>

                <div className="mt-3 text-sm text-slate-400">
                  {sensor.sensors}
                </div>

              </div>
            ))}

          </div>

        </div>

        {/* =================================================
            DISCLAIMER
        ================================================= */}

        <div className="mt-8 rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-5">

          <div className="font-black text-yellow-400">
            ⚠️ Prototype Notice
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            यो Jaljala Safety Map हाल prototype
            demonstration का लागि तयार गरिएको हो।
            Risk zone, ward boundary, safe zone र
            sensor location हरू वास्तविक field survey,
            स्थानीय सरकारको data र GIS verification
            पछि मात्र official रूपमा प्रयोग गर्नुपर्छ।
          </p>

        </div>

      </section>

      {/* =================================================
          GLOBAL MAP STYLES
      ================================================= */}

      <style jsx global>{`
        #bipat-map {
          z-index: 1;
        }

        .leaflet-container {
          background: #0f172a;
          font-family: inherit;
        }

        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35) !important;
        }

        .leaflet-control-zoom a {
          background: #020617 !important;
          color: white !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }

        .leaflet-control-zoom a:hover {
          background: #1e293b !important;
        }

        .leaflet-popup-content-wrapper,
        .leaflet-popup-tip {
          background: #020617;
          color: white;
        }

        .leaflet-popup-content {
          margin: 14px;
        }

        .leaflet-tooltip.ward-label {
          background: rgba(2, 6, 23, 0.88);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          padding: 5px 8px;
          font-size: 11px;
          font-weight: 800;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
        }

        .leaflet-tooltip.ward-label::before {
          display: none;
        }

        .leaflet-control-attribution {
          background: rgba(2, 6, 23, 0.75) !important;
          color: #94a3b8 !important;
        }

        .leaflet-control-attribution a {
          color: #60a5fa !important;
        }
      `}</style>

    </main>
  );
}