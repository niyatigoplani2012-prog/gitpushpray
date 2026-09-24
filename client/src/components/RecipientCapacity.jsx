import React, { useState } from 'react';
import CountdownTimer from './CountdownTimer';

export default function RecipientCapacity({ socket }) {
  const [capacity, setCapacity] = useState(100);
  const [incomingMatches, setIncomingMatches] = useState([]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMatch = (data) => {
      const { donation, match } = data;
      const newMatch = {
        id: match._id,
        foodType: donation.food_type,
        quantity: donation.quantity,
        unit: donation.unit,
        safeUntil: donation.expiry_window.safe_until,
        donor: 'Donor ' + donation.donor_id.substring(0,6), 
        status: match.status
      };
      
      setIncomingMatches(prev => {
        if (prev.find(m => m.id === newMatch.id)) return prev;
        return [newMatch, ...prev];
      });
    };

    const handleStatusChange = (data) => {
      const { match } = data;
      if (match) {
        setIncomingMatches(prev => 
          prev.map(m => m.id === match._id ? { ...m, status: match.status } : m)
        );
      }
    };

    socket.on('donation_incoming_match', handleNewMatch);
    socket.on('donation_status_changed', handleStatusChange);

    return () => {
      socket.off('donation_incoming_match', handleNewMatch);
      socket.off('donation_status_changed', handleStatusChange);
    };
  }, [socket]);

  const handleCapacityUpdate = (e) => {
    e.preventDefault();
    console.log("Updated capacity to:", capacity);
  };

  const respondToMatch = (id, response) => {
    console.log(`Match ${id} ${response}`);
    setIncomingMatches(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-background flex w-full justify-center sm:py-6">
      <div className="w-full max-w-[375px] sm:max-w-md bg-transparent flex flex-col gap-6">
        
        {/* Capacity Manager Card */}
        <div className="bg-surface p-5 sm:rounded-xl shadow-sm flex flex-col">
          <header className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Current Intake Capacity</h2>
            <p className="text-sm text-gray-700 mt-1">Update this live so dispatch knows exactly what you can accept right now.</p>
          </header>
          
          <form onSubmit={handleCapacityUpdate} className="flex gap-4">
            <div className="flex-1 flex flex-col">
              <input 
                type="number"
                className="min-h-touch px-3 border border-gray-300 rounded-md bg-white text-gray-900 text-sm font-semibold focus:ring-2 focus:ring-primary outline-none"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min="0"
                required
              />
            </div>
            <button 
              type="submit"
              className="min-h-touch px-6 bg-gray-900 text-white text-sm font-bold rounded-md hover:bg-gray-800 transition shadow-sm"
            >
              Update
            </button>
          </form>
        </div>

        {/* Incoming Matches Card */}
        <div className="bg-surface p-5 sm:rounded-xl shadow-sm flex flex-col flex-1">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Incoming Matches</h2>
            <span className="bg-status-matched text-white text-sm font-bold min-h-[24px] px-2 rounded-full flex items-center justify-center">
              {incomingMatches.length}
            </span>
          </header>

          {incomingMatches.length === 0 ? (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6">
              <p className="text-sm text-gray-500 text-center font-medium">No active matches.<br/>You will be notified when surplus becomes available.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {incomingMatches.map(match => (
                <div key={match.id} className="border border-status-posted/40 bg-status-posted/10 p-4 rounded-lg flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{match.quantity} {match.unit} of {match.foodType}</h3>
                      <p className="text-sm text-gray-700">{match.donor}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-sm text-gray-700 font-semibold mb-1">Expires in</span>
                      <CountdownTimer targetDate={match.safeUntil} />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-2">
                    <button 
                      onClick={() => respondToMatch(match.id, 'Declined')}
                      className="flex-1 min-h-touch bg-white text-gray-700 text-sm font-bold border border-gray-300 rounded-md hover:bg-gray-50 transition"
                    >
                      Decline
                    </button>
                    <button 
                      onClick={() => respondToMatch(match.id, 'Accepted')}
                      className="flex-1 min-h-touch bg-status-matched text-white text-sm font-bold rounded-md hover:bg-blue-700 transition shadow-sm"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
