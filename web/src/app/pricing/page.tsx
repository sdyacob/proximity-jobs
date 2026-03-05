"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Check, Zap } from "lucide-react";

export default function Pricing() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="flex items-center justify-between p-4 bg-white shadow-sm">
                <h1 className="text-xl font-bold">📍 ProximityJobs <span className="text-sm font-normal text-gray-500">Recruiter</span></h1>
                <div className="flex items-center gap-4">
                    <Link href="/recruiter" className="text-sm text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
                    <UserButton />
                </div>
            </header>

            <main className="max-w-5xl mx-auto w-full px-6 py-12">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Post jobs that candidates actually want to commute to</h2>
                    <p className="text-lg text-gray-600">Stop wasting time interviewing candidates who will reject your offer because of the location.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Starter Tier */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                        <p className="text-gray-500 mb-6">Perfect for growing startups</p>
                        <div className="mb-6">
                            <span className="text-4xl font-extrabold text-gray-900">$49</span>
                            <span className="text-gray-500">/mo</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex gap-3 text-gray-600"><Check className="text-green-500 shrink-0" /> 3 active job postings</li>
                            <li className="flex gap-3 text-gray-600"><Check className="text-green-500 shrink-0" /> Restrict applicants by Candidate Radius</li>
                            <li className="flex gap-3 text-gray-600"><Check className="text-green-500 shrink-0" /> Basic pipeline analytics</li>
                        </ul>

                        <button className="w-full bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg transition-colors">
                            Subscribe logic integrated via backend
                        </button>
                    </div>

                    {/* Growth Tier */}
                    <div className="bg-blue-600 rounded-2xl shadow-lg border border-blue-700 p-8 flex flex-col text-white relative">
                        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg flex items-center gap-1">
                            <Zap size={14} /> MOST POPULAR
                        </div>

                        <h3 className="text-2xl font-bold mb-2">Growth</h3>
                        <p className="text-blue-100 mb-6">For teams actively scaling</p>
                        <div className="mb-6">
                            <span className="text-4xl font-extrabold">$149</span>
                            <span className="text-blue-200">/mo</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex gap-3 text-blue-50"><Check className="text-blue-300 shrink-0" /> Unlimited active job postings</li>
                            <li className="flex gap-3 text-blue-50"><Check className="text-blue-300 shrink-0" /> Restrict applicants by Candidate Radius</li>
                            <li className="flex gap-3 text-blue-50"><Check className="text-blue-300 shrink-0" /> Candidate heatmap analytics</li>
                            <li className="flex gap-3 text-blue-50"><Check className="text-blue-300 shrink-0" /> ATS Integrations (Greenhouse, Lever)</li>
                        </ul>

                        <button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg transition-colors">
                            Subscribe via Stripe
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
