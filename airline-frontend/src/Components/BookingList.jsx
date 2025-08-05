import React, { useEffect, useState } from 'react';
import {
    Search, Calendar, Users, Mail, Phone, CreditCard, CheckCircle, Clock, XCircle,
} from 'lucide-react';

const ViewBookingTab = () => {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetch('http://localhost:8080/api/bookings')
            .then(res => res.json())
            .then(data => setBookings(data))
            .catch(err => console.error('Failed to fetch bookings:', err));
    }, []);

    const filteredBookings = bookings
        .filter(booking => {
            const search = searchTerm.toLowerCase();
            const matchesSearch =
                booking.id.toString().includes(search) ||
                booking.flight?.flightNo?.toLowerCase().includes(search) ||
                booking.passengerName?.toLowerCase().includes(search) ||
                booking.email?.toLowerCase().includes(search);
            const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => a.id - b.id); // ✅ Sorted by ID

    const totalRevenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + (parseFloat(b.totalAmount) || 0), 0);

    const updateBookingStatus = (bookingId, newStatus) => {
        fetch(`http://localhost:8080/bookings/${bookingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to update status');
                return res.json();
            })
            .then(updated => {
                setBookings(prev =>
                    prev.map(b => (b.id === bookingId ? { ...b, status: updated.status } : b))
                );
            })
            .catch(err => console.error('Error updating status:', err));
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Failed to cancel booking");
            }

            setBookings(prev => prev.filter(b => b.id !== bookingId));
        } catch (error) {
            console.error(error);
            alert("Error cancelling booking. Please try again.");
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-600" />;
            case 'cancelled':
                return <XCircle className="h-4 w-4 text-red-600" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return '';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
                    <p className="text-gray-600">View and manage all flight bookings</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard icon={<Calendar className="h-6 w-6 text-blue-600" />} title="Total Bookings" value={bookings.length} />
                <StatCard icon={<CheckCircle className="h-6 w-6 text-green-600" />} title="Confirmed" value={bookings.filter(b => b.status === 'confirmed').length} />
                <StatCard icon={<Clock className="h-6 w-6 text-yellow-600" />} title="Pending" value={bookings.filter(b => b.status === 'pending').length} />
                <StatCard icon={<CreditCard className="h-6 w-6 text-green-600" />} title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} />
            </div>

            {/* Bookings List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookings.map((booking, index) => (
                    <div
                        key={booking.id}
                        className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900">Booking #{index + 1}</span>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(booking.status)}`}
                            >
                                {getStatusIcon(booking.status)}
                                <span className="capitalize">{booking.status}</span>
                            </span>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg mb-4">
                            <div className="text-sm font-medium text-blue-900 mb-1">Flight {booking.flightNo}</div>
                            <div className="text-xs text-blue-700">
                                Departure: {new Date(booking.bookingDate).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <InfoRow icon={<Users className="h-4 w-4 text-gray-400" />} text={booking.passengerName} />
                            <InfoRow icon={<Mail className="h-4 w-4 text-gray-400" />} text={booking.email} />
                            <InfoRow icon={<Phone className="h-4 w-4 text-gray-400" />} text={booking.phone} />
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Seats:</span>
                                <span className="text-sm font-medium">{booking.seatsBooked}</span>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm text-gray-600">Total:</span>
                                <span className="text-sm font-bold text-green-600">₹{booking.totalAmount}</span>
                            </div>

                            <div className="flex space-x-2">
                                {booking.status === 'pending' && (
                                    <>
                                        <ActionButton text="Confirm" color="green" onClick={() => updateBookingStatus(booking.id, 'confirmed')} />
                                        <ActionButton text="Cancel" color="red" onClick={() => {
                                            if (window.confirm('Are you sure you want to cancel this booking?')) {
                                                updateBookingStatus(booking.id, 'cancelled');
                                            }
                                        }} />
                                    </>
                                )}
                                {booking.status === 'confirmed' && (
                                    <ActionButton text="Cancel Booking" color="red" onClick={() => {
                                        if (window.confirm('Are you sure you want to cancel this booking?')) {
                                            handleCancelBooking(booking.id);
                                        }
                                    }} />
                                )}
                                {booking.status === 'cancelled' && (
                                    <ActionButton text="Restore" color="green" onClick={() => updateBookingStatus(booking.id, 'confirmed')} />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-600">No bookings match your current search and filter criteria.</p>
                </div>
            )}
        </div>
    );
};

// Reusable components
const StatCard = ({ icon, title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center">
        <div className="bg-gray-100 p-3 rounded-lg">{icon}</div>
        <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const InfoRow = ({ icon, text }) => (
    <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm text-gray-600">{text}</span>
    </div>
);

const ActionButton = ({ text, color, onClick }) => {
    const base = `flex-1 py-2 px-3 rounded-lg text-xs font-medium text-white hover:opacity-90`;
    const bg = color === 'green' ? 'bg-green-600' : 'bg-red-600';
    return (
        <button onClick={onClick} className={`${base} ${bg}`}>
            {text}
        </button>
    );
};

export default ViewBookingTab;
