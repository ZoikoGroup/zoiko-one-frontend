export function getItineraries() {
  return [
    {
      id: 1,
      tripRef: "TRP-2026-001",
      destination: "Berlin, DE",
      employee: "Sarah Chen",
      status: "completed",
      flights: [
        { airline: "Lufthansa", flightNo: "LH401", departure: "2026-06-20 08:00", arrival: "2026-06-20 14:30" },
        { airline: "Lufthansa", flightNo: "LH402", departure: "2026-06-24 16:00", arrival: "2026-06-24 22:15" },
      ],
      hotel: { name: "Hotel Berlin Central", checkIn: "2026-06-20", checkOut: "2026-06-24" },
      transport: "Airport transfer via Uber",
      schedule: [
        { day: 1, date: "2026-06-20", activities: "Arrival, hotel check-in, evening welcome reception" },
        { day: 2, date: "2026-06-21", activities: "Keynote sessions, networking lunch, workshop A" },
        { day: 3, date: "2026-06-22", activities: "Panel discussion, product demo, team dinner" },
        { day: 4, date: "2026-06-23", activities: "Workshop B, closing ceremony, city tour" },
        { day: 5, date: "2026-06-24", activities: "Check-out, airport transfer, departure" },
      ],
    },
    {
      id: 2,
      tripRef: "TRP-2026-002",
      destination: "Tokyo, JP",
      employee: "Mike Johnson",
      status: "approved",
      flights: [
        { airline: "Japan Airlines", flightNo: "JL005", departure: "2026-06-25 22:00", arrival: "2026-06-26 16:30" },
        { airline: "Japan Airlines", flightNo: "JL006", departure: "2026-07-02 18:00", arrival: "2026-07-02 23:00" },
      ],
      hotel: { name: "Shinjuku Gran Hotel", checkIn: "2026-06-26", checkOut: "2026-07-02" },
      transport: "JR Rail Pass + Taxi",
      schedule: [
        { day: 1, date: "2026-06-26", activities: "Arrival, hotel check-in, rest" },
        { day: 2, date: "2026-06-27", activities: "Client meeting, office tour, team lunch" },
        { day: 3, date: "2026-06-28", activities: "Strategy session, product review" },
        { day: 4, date: "2026-06-29", activities: "Market research, partner visit" },
        { day: 5, date: "2026-06-30", activities: "Contract negotiation, dinner with client" },
        { day: 6, date: "2026-07-01", activities: "Free day, sightseeing" },
        { day: 7, date: "2026-07-02", activities: "Check-out, airport transfer, departure" },
      ],
    },
    {
      id: 3,
      tripRef: "TRP-2026-003",
      destination: "London, UK",
      employee: "Emily Davis",
      status: "pending",
      flights: [
        { airline: "British Airways", flightNo: "BA178", departure: "2026-07-05 07:30", arrival: "2026-07-05 13:00" },
        { airline: "British Airways", flightNo: "BA179", departure: "2026-07-08 15:00", arrival: "2026-07-08 20:30" },
      ],
      hotel: { name: "The Kensington Hotel", checkIn: "2026-07-05", checkOut: "2026-07-08" },
      transport: "Tube + Walking",
      schedule: [
        { day: 1, date: "2026-07-05", activities: "Arrival, conference registration, keynote" },
        { day: 2, date: "2026-07-06", activities: "Sessions, workshops, networking event" },
        { day: 3, date: "2026-07-07", activities: "Sessions, panel, closing ceremony" },
        { day: 4, date: "2026-07-08", activities: "Check-out, sightseeing, departure" },
      ],
    },
  ];
}
