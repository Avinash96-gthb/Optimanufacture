'use client';
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/client'
import { logout } from '@/app/logout/actions'
import { useState, useEffect } from 'react'
import Link from 'next/link';

export default function personalDetails(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [currentPrediction, setCurrentPrediction] = useState(null);
    const [customPrediction, setCustomPrediction] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [SelectedSteel, setSelectedSteel] = useState('');
    const [SelectedLocation, setSelectedLocation] = useState('');

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
    
    const steels = [
        'crude steel', 'hot rolled steel', 'cold rolled steel', 'stainless steel', 'rebar',
        'alloy steel'
    ];

    const locations = [
        'Tamil Nadu', 'Kerela', 'Karnataka', 'Andhra Pradesh', 'Telengana', 'Maharashtra', 'Odisha', 
        'Madhya Pradesh', 'Gujarat', 'Rajasthan', 'Punjab', 'Haryana', 'Delhi', 'Bihar', 'Uttar Pradesh',
        'Himachal Pradesh', 'Uttarakhand', 'Jarkhand', 'Chattisgarh', 'West Bengal', 'Manipur', 'Assam',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Arunachal Pradesh', 'Sikkhim', 'Ladakh', 'J&K'
    ];


    
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 5}, (_, i) => currentYear + i);

    useEffect(() => {
        const checkUser = async () => {
          const supabase = createClient();
          const { data, error } = await supabase.auth.getUser();
          if (error || !data?.user) {
            redirect('/login');
          } else {
            setUser(data.user);
          }
        };
        checkUser();
    },[]);

    if (!user) return null;
    return(

        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0 flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">Prediction</h1>
                        </div>
                        <div className="flex items-center">

                            <span className="text-gray-600 mr-4">Hello, {user.email}</span>
                            <form action={logout}>
                                <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                                    Logout
                                </button>
                            </form>
                            <Link href="/dashboard" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                            home
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Custom Steel Price Prediction</h2>
            
            <form onSubmit={logout} className="mb-4">
              <div className="flex space-x-4">
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border rounded px-2 py-1"
                  required
                >
                  <option value="">Select Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select value = {SelectedSteel} onChange={(e) => setSelectedSteel(
                    e.target.value
                )} className="border rounded px-2 py-1" required>
                    <option value ="">Select Steel</option>
                    {steels.map(steel => (
                        <option key={steel} value={steel}>{steel}</option>
                    ))}
                </select>
                <select value = {SelectedLocation} onChange={(e) => setSelectedLocation(
                    e.target.value
                )} className="border rounded px-2 py-1" required>
                    <option value ="">Select location</option>
                    {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                    ))}
                </select>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="border rounded px-2 py-1"
                  required
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <button 
                  type="submit" 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Get Prediction'}
                </button>
              </div>
            </form>

            {customPrediction && (
              <div>
                <p className="mb-2"><strong>Message:</strong> {customPrediction.message}</p>
                <p className="mb-2"><strong>Predicted Close:</strong> {customPrediction.predicted_close.toFixed(2)} $</p>
                <p><strong>Result:</strong> {customPrediction.result}</p>
              </div>
            )}
          </div>
                </div>
            </main>
        </div>
    )
}