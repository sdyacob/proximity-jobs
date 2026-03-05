"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { Search, MapPin, Bell } from "lucide-react";

export default function SavedSearches() {
    const [searches] = useState([
        { id: 1, title: "Software Engineer", location: "OMR, Chennai", radius: 20, active: true },
        { id: 2, title: "Product Manager", location: "Remote/Hybrid", radius: 50, active: false }
    ]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="flex items-center justify-between p-4 bg-white shadow-sm">
                <h1 className="text-xl font-bold flex items-center gap-2">📍 ProximityJobs</h1>
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Map Search</Link>
                    <UserButton />
                </div>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto p-6 mt-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Saved Searches & Alerts</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors">
                        <Search size={16} /> New Search
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {searches.map((search) => (
                        <div key={search.id} className="p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">{search.title}</h3>
                                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {search.location}</span>
                                    <span>Within {search.radius}km</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only" checked={search.active} readOnly />
                                        <div className={`block w-10 h-6 outline-none rounded-full transition-colors ${search.active ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${search.active ? 'transform translate-x-4' : ''}`}></div>
                                    </div>
                                    <div className="ml-3 text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <Bell size={14} className={search.active ? "text-blue-600" : "text-gray-400"} /> Alerts
                                    </div>
                                </label>
                                <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View Results →</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
