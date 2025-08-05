import React, { useEffect, useState } from 'react';
import { Plane, Calendar, Users, Clock } from 'lucide-react'; // ✅ FIXED: Added Clock here
import FlightsTab from './FlightList';
import BookFlightTab from './BookingForm';
import ViewBookingTab from './BookingList';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('flights');
    const [flights, setFlights] = useState([]);
    const [bookings, setBookings] = useState([]);

    // ✅ Fetch flights from backend
    useEffect(() => {
        fetch('http://localhost:8080/api/flights')
            .then(res => res.json())
            .then(data => setFlights(data))
            .catch(err => console.error("Error fetching flights:", err));
    }, []);

    // ✅ Fetch bookings from backend
    useEffect(() => {
        fetch('http://localhost:8080/api/bookings')
            .then(res => res.json())
            .then(data => {
                const sortedData = data.sort((a, b) => a.id - b.id);
                setBookings(sortedData);
            })
            .catch(err => console.error("Error fetching bookings:", err));
    }, []);

    // ✅ Send booking to backend


    const tabs = [
        { id: 'flights', label: 'Flights', icon: Plane },
        { id: 'book', label: 'Book Flight', icon: Calendar },
        { id: 'bookings', label: 'View Bookings', icon: Users }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Plane className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">AirlineMax</h1>
                                <p className="text-sm text-gray-500">Management System</p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-fadeIn">
                    {activeTab === 'flights' && <FlightsTab flights={flights} />}
                    {activeTab === 'book' && <BookFlightTab flights={flights} />}
                    {activeTab === 'bookings' && <ViewBookingTab bookings={bookings} setBookings={setBookings} />}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
