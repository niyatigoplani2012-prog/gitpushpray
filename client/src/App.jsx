import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Login from './components/Login';
import DonorPost from './components/DonorPost';
import RecipientCapacity from './components/RecipientCapacity';
import DriverDispatch from './components/DriverDispatch';
import ImpactDashboard from './components/ImpactDashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [socket, setSocket] = useState(null);
  const [view, setView] = useState('dashboard');

  useEffect(() => {
    if (token && user) {
      // Connect specifically asserting the JWT token in Auth handshake
      const newSocket = io('http://localhost:5000', {
        auth: { token }
      });
      
      newSocket.on('connect', () => {
        console.log('Socket locally connected:', newSocket.id);
      });

      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
        if (err.message.includes('Authentication error')) {
           handleLogout();
        }
      });

      setSocket(newSocket);

      // Default view based on seeded role
      if (user.role === 'donor') setView('donor');
      else if (user.role === 'recipient_org') setView('recipient');
      else if (user.role === 'driver') setView('driver');
      else setView('dashboard');

      return () => newSocket.close();
    }
  }, [token]);

  const handleLoginSuccess = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    if (socket) socket.close();
  };

  if (!token || !user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background text-gray-900 font-sans flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
          <div className="flex overflow-x-auto">
            {['donor', 'recipient', 'driver', 'dashboard'].map(v => (
              <button 
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-3 text-sm font-bold capitalize whitespace-nowrap border-b-2 transition ${view === v ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                {v} View
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
             <span className="hidden sm:inline bg-gray-100 px-3 py-1 rounded-full text-xs">Logged in as {user.name}</span>
             <button onClick={handleLogout} className="text-red-600 hover:underline font-bold">Logout</button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex overflow-auto">
        {view === 'donor' && <DonorPost socket={socket} user={user} />}
        {view === 'recipient' && <RecipientCapacity socket={socket} user={user} />}
        {view === 'driver' && <DriverDispatch socket={socket} user={user} />}
        {view === 'dashboard' && <ImpactDashboard socket={socket} />}
      </main>
    </div>
  );
}

export default App;
