'use client';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { logout } from '../logout/actions';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PrivatePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for user fetch

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        redirect('/login');
      } else {
        setUser(data.user);
      }
      setLoading(false); // Stop loading after checking user
    };

    checkUser();
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading message while fetching user

  if (!user) return null;

  // Sample article data
  const latestNews = [
    {
      title: "Latest Steel Market Trends",
      imageUrl: "https://example.com/news1.jpg",
      link: "https://example.com/news1",
    },
    {
      title: "Steel Price Forecast for 2024",
      imageUrl: "https://example.com/news2.jpg",
      link: "https://example.com/news2",
    },
  ];

  const reportsOfTheMonth = [
    {
      title: "January Steel Report",
      imageUrl: "https://example.com/report1.jpg",
      link: "https://example.com/report1",
    },
    {
      title: "February Steel Report",
      imageUrl: "https://example.com/report2.jpg",
      link: "https://example.com/report2",
    },
  ];

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
              <Link href="dashboard/Details" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                Model
              </Link>
              <Link href="dashboard/Graphs" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                Graphs
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-4">Important Articles</h2>
          
          {/* Latest News Section */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Latest News</h3>
            <div className="flex space-x-4 overflow-x-auto">
              {latestNews.map((article, index) => (
                <Link key={index} href={article.link} className="flex-shrink-0">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="h-40 w-64 object-cover rounded-lg"
                  />
                  <p className="text-center mt-2">{article.title}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Reports of the Month Section */}
          <div>
            <h3 className="text-xl font-bold mb-2">Reports of the Month</h3>
            <div className="flex space-x-4 overflow-x-auto">
              {reportsOfTheMonth.map((report, index) => (
                <Link key={index} href={report.link} className="flex-shrink-0">
                  <img 
                    src={report.imageUrl} 
                    alt={report.title} 
                    className="h-40 w-64 object-cover rounded-lg"
                  />
                  <p className="text-center mt-2">{report.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
