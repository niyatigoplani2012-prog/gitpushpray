import React, { useState } from 'react';
import CountdownTimer from './CountdownTimer';

export default function DriverDispatch({ socket }) {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (!socket) return;
    
    // In a real app we would fetch initial assignments
    // For MVP scope, we will push new assignments via socket
    const handleStatusChange = (data) => {
      const { donation, match } = data;
      if (!match) return;

      const assignmentObj = {
        id: match._id,
        recipientName: 'Org ' + match.recipient_id.substring(0,6),
        recipientAddress: 'Pending Address...',
        pickupAddress: donation.pickup_location?.address || 'Provided Pickup Address',
        foodType: donation.food_type,
        quantity: donation.quantity,
        unit: donation.unit,
        safeUntil: donation.expiry_window.safe_until,
        status: match.status
      };

      setAssignments(prev => {
        const exists = prev.find(a => a.id === assignmentObj.id);
        if (exists) {
          return prev.map(a => a.id === assignmentObj.id ? assignmentObj : a);
        }
        return [assignmentObj, ...prev];
      });
    };

    socket.on('donation_status_changed', handleStatusChange);
    return () => socket.off('donation_status_changed', handleStatusChange);
  }, [socket]);


  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/donations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        console.log(`Assignment ${id} updated to ${newStatus} on server`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background flex w-full justify-center sm:py-6">
      <div className="w-full max-w-[375px] sm:max-w-md bg-transparent flex flex-col gap-6">

        {/* Map Placeholder */}
        <div className="bg-gray-200 h-48 sm:rounded-xl shadow-sm flex items-center justify-center relative overflow-hidden border border-gray-300">
           <span className="text-gray-500 font-bold tracking-widest text-sm z-10 bg-white/80 px-3 py-1 rounded-full">MAP VIEW</span>
           <div className="absolute inset-0 opacity-20 bg-[url('https://maps.wikimedia.org/osm-intl/12/1209/1539.png')] bg-cover bg-center"></div>
        </div>

        {/* Assignments List */}
        <div className="bg-surface p-5 sm:rounded-xl shadow-sm flex flex-col flex-1">
          <header className="mb-4">
            <h1 className="text-xl font-bold text-gray-900">Active Dispatches</h1>
          </header>

          <div className="flex flex-col gap-4">
            {assignments.map(assignment => (
              <div key={assignment.id} className="border border-gray-200 bg-white p-4 rounded-lg flex flex-col gap-4 shadow-sm">
                
                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{assignment.quantity} {assignment.unit} of {assignment.foodType}</h3>
                    <p className="text-sm font-semibold text-primary mt-1">{assignment.status.replace('_', ' ').toUpperCase()}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-sm text-gray-700 font-semibold mb-1">Expires in</span>
                    <CountdownTimer targetDate={assignment.safeUntil} />
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm text-gray-700">
                  <div className="flex gap-2">
                    <span className="font-bold min-w-[60px]">Pickup:</span>
                    <span>{assignment.pickupAddress}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold min-w-[60px]">Dropoff:</span>
                    <span>{assignment.recipientName}<br/>{assignment.recipientAddress}</span>
                  </div>
                </div>
                
                <div className="mt-2 text-sm font-bold">
                  {assignment.status === 'matched' && (
                    <button 
                      onClick={() => handleStatusUpdate(assignment.id, 'picked_up')}
                      className="min-h-touch w-full bg-status-picked-up text-white rounded-md hover:bg-purple-700 transition"
                    >
                      Confirm Pickup
                    </button>
                  )}
                  {assignment.status === 'picked_up' && (
                    <button 
                      onClick={() => handleStatusUpdate(assignment.id, 'delivered')}
                      className="min-h-touch w-full bg-status-delivered text-white rounded-md hover:bg-emerald-700 transition"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  {assignment.status === 'delivered' && (
                    <div className="min-h-touch w-full bg-gray-100 text-gray-500 rounded-md flex items-center justify-center border border-gray-200">
                      Delivery Completed
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
