'use client';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { logout } from '@/app/logout/actions';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


export default function PersonalDetails() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const chatContainerRef = useRef(null);

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
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const fetchCustomPrediction = async (event) => {
    event.preventDefault();
    if (!userMessage.trim()) return;
 
    setLoading(true);
    setError(null);
 
    // Add user's message to the chat
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: userMessage },
    ]);
 
    try {
      // Make a request to your API route
      const response = await fetch('http://127.0.0.1:8000/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          prompt: userMessage,
          start_date: "01-01-2019", // Example start date (you may want to dynamically set this)
          end_date: "01-10-2024"   // Example end date (you may want to dynamically set this
        }),
      });
 
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
 
      const botMessage = await response.json();
   
    // Ensure proper line breaks in the LLM output by adding double line breaks for paragraphs
      const formattedBotMessage = botMessage["llm_output"];
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { role: 'bot', content: formattedBotMessage },
      ]); 
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { role: 'bot', content: `Error: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
      setUserMessage('');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-800">Chatbot</h1>
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
              <Link href="/dashboard" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                Home
              </Link>
              <Link href="/dashboard/Graphs" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300">
                Graphs
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Chatbot</h2>
            <div
              ref={chatContainerRef}
              className="h-96 overflow-y-auto border border-gray-300 p-4 mb-4 rounded-lg bg-white"
            >
              {chatMessages.map((message, index) => (
                <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                    <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-left">
                  <p className="inline-block p-2 bg-gray-300 text-black rounded-lg">
                    Bot is typing...
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={fetchCustomPrediction} className="flex">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="border rounded px-4 py-2 flex-1"
                placeholder="Type your message..."
                disabled={loading}
                required
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2 transition duration-300"
                disabled={loading}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}