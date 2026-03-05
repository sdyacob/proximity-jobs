"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export default function PostJob() {
    const [radius, setRadius] = useState(30);
    const [enforceRadius, setEnforceRadius] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="flex items-center justify-between p-4 bg-white shadow-sm">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold">📍 ProximityJobs</h1>
                    <Link href="/recruiter" className="text-sm text-gray-500 hover:text-gray-900">Dashboard</Link>
                </div>
                <UserButton />
            </header>

            <main className="max-w-2xl mx-auto w-full p-6 mt-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Job Posting</h2>

                    <form className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                            <input type="text" className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Senior Frontend Engineer" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <input type="text" className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. TechCorp" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Office Address (Used to calculate commute)</label>
                            <input type="text" className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. OMR IT Park, Chennai, TN" />
                        </div>

                        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mt-4">
                            <h3 className="font-medium text-blue-900 mb-4 flex items-center gap-2"><span className="text-xl">📍</span> Candidate Commute Settings</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-blue-900 mb-1 flex justify-between">
                                    Target Radius
                                    <span className="font-bold">{radius} km</span>
                                </label>
                                <input
                                    type="range"
                                    min="5"
                                    max="100"
                                    value={radius}
                                    onChange={(e) => setRadius(parseInt(e.target.value))}
                                    className="w-full accent-blue-600"
                                />
                                <p className="text-xs text-blue-700 mt-1">Candidates outside this radius will be notified of the long commute.</p>
                            </div>

                            <div className="flex items-center gap-3 bg-white p-3 rounded border border-blue-100">
                                <input
                                    type="checkbox"
                                    id="enforceRadius"
                                    checked={enforceRadius}
                                    onChange={(e) => setEnforceRadius(e.target.checked)}
                                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="enforceRadius" className="text-sm text-gray-900 font-medium cursor-pointer">
                                    Strictly Enforce Radius (Reject applications automatically)
                                </label>
                            </div>
                        </div>

                        <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors w-full">
                            Post Job & Geocode Location
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
