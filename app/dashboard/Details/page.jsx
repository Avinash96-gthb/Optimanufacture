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
        </div>
    )
}