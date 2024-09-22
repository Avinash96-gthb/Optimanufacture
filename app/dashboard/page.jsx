'use client';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { logout } from '../logout/actions';
import { useState, useEffect } from 'react';

export default function PrivatePage() {
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [customPrediction, setCustomPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
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

    const fetchCurrentPrediction = async () => {
      setLoading(true);
      try {
        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
        const currentYear = currentDate.getFullYear();
        
        const formData = new FormData();
        formData.append('query', `What will be the steel price trend in ${currentMonth} ${currentYear} for district chennai`);

        const response = await fetch('http://127.0.0.1:5000/', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch current steel price data');
        }

        const data = await response.json();
        setCurrentPrediction(data);
      } catch (error) {
        console.error('Error fetching current steel price data:', error);
        setError('Failed to fetch current steel price data');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
    fetchCurrentPrediction();
  }, []);

  const fetchCustomPrediction = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('query', `What will be the steel price trend in ${selectedMonth} ${selectedYear} for district chennai`);

      const response = await fetch('http://127.0.0.1:5000/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch custom steel price data');
      }

      const data = await response.json();
      setCustomPrediction(data);
    } catch (error) {
      console.error('Error fetching custom steel price data:', error);
      setError('Failed to fetch custom steel price data');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // or a loading spinner

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-4">Hello, {user.email}</span>
              <form action={logout}>
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Current Month Steel Price Prediction</h2>
            {loading && !currentPrediction ? (
              <p>Loading current prediction...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : currentPrediction ? (
              <div>
                <p className="mb-2"><strong>Message:</strong> {currentPrediction.message}</p>
                <p className="mb-2"><strong>Predicted Close:</strong> {currentPrediction.predicted_close.toFixed(2)} $</p>
                <p><strong>Result:</strong> {currentPrediction.result}</p>
              </div>
            ) : (
              <p>No current prediction available</p>
            )}
          </div>

          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Custom Steel Price Prediction</h2>
            
            <form onSubmit={fetchCustomPrediction} className="mb-4">
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
  );
}