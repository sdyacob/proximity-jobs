"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Users, MapPin, Briefcase } from "lucide-react";

export default function RecruiterDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="flex items-center justify-between p-4 bg-white shadow-sm">
                <h1 className="text-xl font-bold flex items-center gap-2">📍 ProximityJobs <span className="text-sm font-normal text-gray-500">Recruiter</span></h1>
                <div className="flex items-center gap-4">
                    <Link href="/recruiter/post" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">
                        + Post a Job
                    </Link>
                    <UserButton />
                </div>
            </header>

            <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Briefcase size={24} /></div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Active Jobs</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">3</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Users size={24} /></div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Applicants</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">124</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><MapPin size={24} /></div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Avg Candidate Distance</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">18km</h3>
                        </div>
                    </div>
                </div>

                {/* Pipeline Map/List UI skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex-1 h-[400px] flex items-center justify-center text-gray-400">
                    Applicant Pipeline (Map + List implementation for Phase 2B/2C)
                </div>
            </main>
        </div>
    );
}
