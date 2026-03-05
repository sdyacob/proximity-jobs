"use client";

import { useState } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl";
import * as turf from "@turf/turf";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  const [radius, setRadius] = useState<number>(30); // 30km default
  const [viewState, setViewState] = useState({
    longitude: 80.2496, // Chennai Default
    latitude: 12.9716,
    zoom: 10
  });

  // Calculate the geojson circle for the radius
  const center = [viewState.longitude, viewState.latitude];
  const options = { steps: 50, units: 'kilometers' as const };
  const circle = turf.circle(center, radius, options);

  return (
    <div className="flex flex-col h-screen w-full">
      <header className="flex items-center justify-between p-4 bg-white shadow-sm z-10">
        <h1 className="text-xl font-bold flex items-center gap-2">📍 ProximityJobs</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Commute Radius: {radius}km</span>
            <input
              type="range"
              min="5"
              max="50"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-32"
            />
          </div>
          <UserButton />
        </div>
      </header>

      <main className="flex-1 relative">
        <Map
          {...viewState}
          onMove={(evt: any) => setViewState(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          className="w-full h-full"
        >
          {/* Default User Location Marker */}
          <Marker longitude={viewState.longitude} latitude={viewState.latitude} color="red" />

          {/* Radius Circle */}
          <Source id="radius" type="geojson" data={circle}>
            <Layer
              id="radius-fill"
              type="fill"
              paint={{
                'fill-color': '#3b82f6',
                'fill-opacity': 0.1
              }}
            />
            <Layer
              id="radius-line"
              type="line"
              paint={{
                'line-color': '#3b82f6',
                'line-width': 2
              }}
            />
          </Source>
        </Map>

        {/* Floating Job List (Skeleton) */}
        <div className="absolute top-4 left-4 w-80 bg-white/90 backdrop-blur-md shadow-lg rounded-xl overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
          <div className="p-4 border-b border-gray-100 bg-white">
            <h2 className="font-semibold text-lg">Jobs near you</h2>
            <p className="text-sm text-gray-500">{radius}km radius criteria</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {/* Dummy Job Cards */}
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-medium text-gray-900">Software Engineer</h3>
                <p className="text-sm text-gray-500 mb-2">TechCorp • Chennai, TN</p>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-medium">
                    🚗 35 mins
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                    Within {radius}km
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
