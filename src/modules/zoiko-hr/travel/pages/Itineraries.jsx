import { useState } from "react";
import { Plane, Building2, Bus, Calendar } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { useItineraries } from "../hooks/useTravel";
import { formatDate } from "../utils/helpers";

export default function TravelItineraries() {
  const { data: itineraries, loading } = useItineraries();
  const [expanded, setExpanded] = useState(null);

  if (loading) return <div className="p-6 text-gray-400">Loading itineraries...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trip Itineraries</h1>
        <p className="text-sm text-gray-500 mt-1">View detailed trip schedules and arrangements</p>
      </div>

      <div className="space-y-6">
        {itineraries.map((trip) => (
          <div key={trip.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{trip.destination}</h3>
                    <StatusBadge status={trip.status} />
                  </div>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Employee:</span> {trip.employee} &middot;
                    <span className="font-medium"> Ref:</span> {trip.tripRef}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Plane className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-700 uppercase">Flights</span>
                  </div>
                  {trip.flights.map((f, i) => (
                    <p key={i} className="text-xs text-gray-700">{f.airline} {f.flightNo}: {f.departure} &rarr; {f.arrival}</p>
                  ))}
                </div>

                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-700 uppercase">Hotel</span>
                  </div>
                  <p className="text-xs text-gray-700">{trip.hotel.name}</p>
                  <p className="text-xs text-gray-500">Check-in: {formatDate(trip.hotel.checkIn)} &middot; Check-out: {formatDate(trip.hotel.checkOut)}</p>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Bus className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-700 uppercase">Transport</span>
                  </div>
                  <p className="text-xs text-gray-700">{trip.transport}</p>
                </div>
              </div>

              <button
                onClick={() => setExpanded(expanded === trip.id ? null : trip.id)}
                className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                <Calendar className="w-4 h-4" />
                {expanded === trip.id ? "Hide Schedule" : "View Day-by-Day Schedule"}
              </button>

              {expanded === trip.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Day</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Activities</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {trip.schedule.map((day) => (
                          <tr key={day.day} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm font-medium text-gray-700">Day {day.day}</td>
                            <td className="px-4 py-2 text-sm text-gray-500">{formatDate(day.date)}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{day.activities}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {itineraries.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No itineraries found</div>
        )}
      </div>
    </div>
  );
}
