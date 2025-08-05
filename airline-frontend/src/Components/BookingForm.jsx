import React, { useState } from 'react';
import {
    Calendar, MapPin, Users, CreditCard, User, Mail, Phone, Plane
} from 'lucide-react';

const BookFlightTab = ({ flights = [], bookings = [], onAddBooking }) => {
    const [selectedFlight, setSelectedFlight] = useState('');
    const [formData, setFormData] = useState({
        passengerName: '',
        email: '',
        phone: '',
        seats: 1,
        specialRequests: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Fallback default flight info
    const selectedFlightData = flights.find(f => f.flightNo === selectedFlight) || {
        flightNo: "Eg: AI101",
        origin: "Eg: Delhi",
        destination: "Eg: Mumbai",
        departure: "Eg: 09:30 AM",
        duration: "Eg: 2h 30m",
        aircraft: "Eg: Airbus A320",
        price: 5500
    };

    const totalPrice = selectedFlightData?.price * (formData.seats || 1);

    const totalRevenue = bookings
        .filter((b) => b.status === "confirmed")
        .reduce((sum, b) => sum + (parseFloat(b.totalAmount) || 0), 0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'seats' ? parseInt(value) : value
        }));
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        console.log("🔁 Submitting form");


        setIsSubmitting(true);

        const selectedFlightObj = flights.find(f => f.flightNo === selectedFlight);
        console.log("🎯 Selected flight:", selectedFlightObj);

        if (!selectedFlightObj || !selectedFlightObj.id) {
            alert("⚠️ Please select a valid flight.");
            setIsSubmitting(false);
            return;
        }

        const bookingPayload = {
            passengerName: formData.passengerName,
            email: formData.email,
            phone: formData.phone,
            seatsBooked: parseInt(formData.seats),
            status: "confirmed",
            totalAmount: selectedFlightObj.price * parseInt(formData.seats),
            bookingDate: new Date().toISOString().split('T')[0], // ✅ yyyy-mm-dd format
            flight: {
                id: selectedFlightObj.id
            }
        };


        console.log("📦 Sending booking payload:", bookingPayload);

        try {
            const response = await fetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingPayload)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Server error: ${text}`);
            }

            const saved = await response.json();
            console.log("✅ Booking saved:", saved);
            alert("✅ Booking successful!");

            onAddBooking?.(saved);

            setShowSuccess(true);
            setFormData({
                passengerName: '',
                email: '',
                phone: '',
                seats: 1,
                specialRequests: ''
            });
            setSelectedFlight('');
        } catch (err) {
            console.error("❌ Booking failed:", err);
            alert("❌ Booking failed: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {showSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                        <Plane className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-green-800 font-medium">Booking Confirmed!</h3>
                        <p className="text-green-600 text-sm">Your flight has been successfully booked. Check your email for confirmation details.</p>
                    </div>
                </div>
            )}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Book Your Flight</h2>
                <p className="text-gray-600">Select a flight and provide your details to complete the booking</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <form onSubmit={handleBookingSubmit} className="space-y-6">
                            <div>
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                                    <Plane className="h-4 w-4" />
                                    <span>Select Flight</span>
                                </label>
                                <select
                                    name="flight"
                                    value={selectedFlight}
                                    onChange={(e) => {
                                        console.log("Before editing:", e.target.value);
                                        setSelectedFlight(e.target.value);
                                    }}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Choose a flight...</option>
                                    {flights?.length > 0 ? (
                                        flights.map((flight) => (
                                            <option key={flight.flightNo} value={flight.flightNo}>
                                                {flight.flightNo} - {flight.origin} to {flight.destination} ({flight.departure}) - ₹{flight.price}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No flights available</option>
                                    )}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                                        <User className="h-4 w-4" />
                                        <span>Full Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="passengerName"
                                        placeholder="Enter full name"
                                        value={formData.passengerName}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                                        <Mail className="h-4 w-4" />
                                        <span>Email Address</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter email"
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="h-4 w-4" />
                                        <span>Phone Number</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter phone number"
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                                        <Users className="h-4 w-4" />
                                        <span>Seats</span>
                                    </label>
                                    <select
                                        name="seats"
                                        value={formData.seats}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map((num) => (
                                            <option key={num} value={num}>
                                                {num}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Special Requests
                                </label>
                                <textarea
                                    name="specialRequests"
                                    value={formData.specialRequests}
                                    onChange={handleInputChange}
                                    placeholder="Optional requests..."
                                    rows={3}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!selectedFlight || isSubmitting}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                            >
                                <CreditCard className="h-4 w-4" />
                                <span>{isSubmitting ? 'Processing...' : 'Book Flight'}</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/*Booking Summary*/}
                <div className="lg:col-span-1">
                    <div id="ticket-summary" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">

                        <div className="ticket-header">
                            <h3 className="ticket-title text-lg font-semibold text-gray-900 mb-2 flex items-center justify-center">
                                <Plane className="h-5 w-5 mr-2" />
                                AirlineMax
                            </h3>
                            <p className="ticket-subtitle text-sm text-gray-500">Electronic Ticket</p>
                        </div>

                        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center print:hidden">
                            <Calendar className="h-5 w-5 mr-2" />
                            Booking Summary
                        </h4>

                        {selectedFlightData ? (
                            <div className="space-y-4">
                                {/* Flight Route Display */}
                                <div className="flight-route bg-blue-50 p-4 rounded-lg">
                                    {/* Flight Number - Print Only */}
                                    <div className="hidden print:block text-center mb-4">
                                        <div className="flex items-center justify-center space-x-2 mb-2">
                                            <span className="text-lg font-bold text-blue-900">Flight {selectedFlightData.flightNo}</span>
                                        </div>
                                    </div>

                                    {/* Flight Number - Screen Only */}
                                    <div className="print:hidden route-city">
                                        <div className="route-city-code text-xl font-bold text-blue-900">
                                            <span className="font-medium text-blue-900">{selectedFlightData.flightNo}</span>
                                        </div>
                                    </div>
                                    <div className="route-city">

                                        <div className="route-city-name text-xs text-blue-700">
                                            {selectedFlightData.origin.split('(')[0]?.trim() || selectedFlightData.origin}
                                        </div>
                                    </div>
                                    <div className="route-arrow text-blue-600">✈</div>
                                    <div className="route-city">

                                        <div className="route-city-name text-xs text-blue-700">
                                            {selectedFlightData.destination.split('(')[0]?.trim() || selectedFlightData.destination}
                                        </div>
                                    </div>

                                </div>



                                {/* Ticket Details */}
                                <div className="ticket-details space-y-3 text-sm">
                                    <div className="detail-item flex justify-between print:block">
                                        <span className="detail-label text-gray-600">Departure Time:</span>
                                        <span className="detail-value font-medium">{selectedFlightData.departure}</span>
                                    </div>
                                    <div className="detail-item flex justify-between print:block">
                                        <span className="detail-label text-gray-600">Flight Duration:</span>
                                        <span className="detail-value font-medium">{selectedFlightData.duration}</span>
                                    </div>
                                    <div className="detail-item flex justify-between print:block">
                                        <span className="detail-label text-gray-600">Aircraft Type:</span>
                                        <span className="detail-value font-medium">{selectedFlightData.aircraft}</span>
                                    </div>
                                    <div className="detail-item flex justify-between print:block">
                                        <span className="detail-label text-gray-600">Price per Seat:</span>
                                        <span className="detail-value font-medium">₹{selectedFlightData.price}</span>
                                    </div>
                                    <div className="detail-item flex justify-between print:block">
                                        <span className="detail-label text-gray-600">Number of Seats:</span>
                                        <span className="detail-value font-medium">{formData.seats}</span>
                                    </div>
                                </div>

                                {/* Passenger Info - Print Only */}
                                {formData.passengerName && (
                                    <div className="hidden print:block ticket-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Passenger Name:</span>
                                            <span className="detail-value">{formData.passengerName}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Contact:</span>
                                            <span className="detail-value">{formData.email}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Total Amount */}
                                <div className="ticket-total">
                                    <hr className="my-3 print:hidden" />
                                    <div className="flex justify-between text-lg font-bold print:block print:text-center">
                                        <span>Total:</span>
                                        <span className="total-amount text-green-600">₹{totalPrice}</span>
                                    </div>
                                </div>

                                {/* Barcode - Print Only */}
                                <div className="hidden print:block barcode">
                                    <div>||||| |||| | |||| ||||| || ||| ||||</div>
                                    <div className="mt-1">{selectedFlightData.flightNo}-{formData.seats || '1'}-{new Date().getTime().toString().slice(-6)}</div>
                                </div>

                                {/* Footer - Print Only */}
                                <div className="hidden print:block ticket-footer">
                                    <p>Please arrive at the airport 2 hours before domestic flights.</p>
                                    <p>This is an electronic ticket. Please carry a valid photo ID.</p>
                                    <p className="mt-2">Thank you for choosing AirlineMax!</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Example Display */}
                                <div className="flight-route bg-blue-50 p-4 rounded-lg">
                                    <div className="route-city">
                                        <div className="route-city-code text-xl font-bold text-blue-900">DEL</div>
                                        <div className="route-city-name text-xs text-blue-700">Delhi</div>
                                    </div>
                                    <div className="route-arrow text-blue-600">✈</div>
                                    <div className="route-city">
                                        <div className="route-city-code text-xl font-bold text-blue-900">BOM</div>
                                        <div className="route-city-name text-xs text-blue-700">Mumbai</div>
                                    </div>
                                </div>

                                <div className="ticket-details space-y-3 text-sm">
                                    <div className="detail-item flex justify-between">
                                        <span className="detail-label text-gray-600">Flight:</span>
                                        <span className="detail-value font-medium text-gray-400">AI101</span>
                                    </div>
                                    <div className="detail-item flex justify-between">
                                        <span className="detail-label text-gray-600">Departure:</span>
                                        <span className="detail-value font-medium text-gray-400">09:30 AM</span>
                                    </div>
                                    <div className="detail-item flex justify-between">
                                        <span className="detail-label text-gray-600">Duration:</span>
                                        <span className="detail-value font-medium text-gray-400">2h 30m</span>
                                    </div>
                                    <div className="detail-item flex justify-between">
                                        <span className="detail-label text-gray-600">Price per Seat:</span>
                                        <span className="detail-value font-medium text-gray-400">₹5,500</span>
                                    </div>
                                    <div className="detail-item flex justify-between">
                                        <span className="detail-label text-gray-600">Seats:</span>
                                        <span className="detail-value font-medium text-gray-400">2</span>
                                    </div>
                                </div>

                                <div className="ticket-total">
                                    <hr className="my-3" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total Amount:</span>
                                        <span className="total-amount text-green-600">₹11,000</span>
                                    </div>
                                </div>

                                <p className="text-gray-500 text-center py-4 text-sm">Select a flight to see actual booking details</p>
                            </div>
                        )}

                        {/* Print Button */}
                        <button
                            onClick={() => window.print()}
                            className="mt-6 w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all duration-200 flex items-center justify-center space-x-2 print:hidden"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span>Print Ticket</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookFlightTab;
