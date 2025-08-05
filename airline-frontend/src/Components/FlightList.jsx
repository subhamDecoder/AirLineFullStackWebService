import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plane, Search, Users, Clock, MapPin } from "lucide-react";

const FlightsTab = () => {
  const [flights, setFlights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [currentView, setCurrentView] = useState("list");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [sortField, setSortField] = useState("flightNo");
  const [sortDirection, setSortDirection] = useState("asc");

  // Dropdown options
  const flightNumbers = ["AI101", "AI102", "AI103", "AI104", "AI105", "FL101", "FL102", "FL103", "FL104", "FL105"];
  const origins = ["Kolkata", "New York (EDT)", "London (BST)", "Berlin (CEST)", "Mumbai (IST)", "Tokyo (JST)"];
  const destinations = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Delhi"];
  const departureTimes = ["2025-08-26T10:30AM", "2025-08-01T06:30-04:00", "2025-08-01T11:30+01:00", "2025-08-01T12:30+02:00", "2025-08-01T16:00+05:30", "2025-08-01T19:30+09:00"];
  const seatOptions = [100, 150, 200];
  const durations = ["1h", "2h", "3h"];
  const priceTiers = [2000, 5000, 8000,];
  const aircrafts = ["Airbus A320", "Boeing 737", "Embraer 190"];

  const [newFlight, setNewFlight] = useState({
    flightNo: "",
    origin: "",
    destination: "",
    departure: "",
    seats: "",
    duration: "",
    price: "",
    aircraft: "",
  });

  const fetchFlights = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/flights");
      console.log("API Response data:", res.data);
      setFlights(res.data || []);
      setFilteredFlights(res.data || []);
    } catch (err) {
      console.error("Failed to fetch flights", err);
    }
  };


  useEffect(() => {
    fetchFlights();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const lowerSearch = searchTerm.trim().toLowerCase();
      const filtered = flights.filter((flight) => {
        const flightNo = (flight.flightNo || "").toLowerCase();
        const origin = (flight.origin || "").toLowerCase();
        const destination = (flight.destination || "").toLowerCase();
        return (
          flightNo.startsWith(lowerSearch) ||
          origin.includes(lowerSearch) ||
          destination.includes(lowerSearch)
        );
      });
      setFilteredFlights(filtered);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, flights]);

  const handleAddFlight = async () => {
    const required = ["flightNo", "origin", "destination", "departure", "seats", "duration", "price", "aircraft"];
    const valid = required.every((k) => newFlight[k] !== undefined && newFlight[k].toString().trim() !== "");
    if (!valid) {
      alert("❗ Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/flights", newFlight);
      const added = res.data;
      const updated = [...flights, added];
      setFlights(updated);
      setFilteredFlights(updated);
      resetForm();
    } catch (err) {
      console.error("Error adding flight:", err);
      alert("⚠️ Failed to add flight.");
    }
  };

  const handleEditFlight = async () => {
    try {
      const res = await axios.put(`http://localhost:8080/api/flights/${newFlight.flightNo}`, newFlight);
      const updated = res.data;
      const all = flights.map((f) => (f.flightNo === updated.flightNo ? updated : f));
      setFlights(all);
      setFilteredFlights(all);
      resetForm();
      alert("✅ Flight updated successfully.");
    } catch (err) {
      console.error("Edit error:", err);
      alert("⚠️ Failed to update flight.");
    }
  };

  const resetForm = () => {
    setNewFlight({
      flightNo: "",
      origin: "",
      destination: "",
      departure: "",
      seats: "",
      duration: "",
      price: "",
      aircraft: "",
    });
    setSelectedFlight(null);
    setCurrentView("list");
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === "string") {
      return sortDirection === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return sortDirection === "asc" ? valA - valB : valB - valA;
    }
  });

  const getOptions = (field) => {
    switch (field) {
      case "flightNo": return flightNumbers;
      case "origin": return origins;
      case "destination": return destinations;
      case "departure": return departureTimes;
      case "seats": return seatOptions;
      case "duration": return durations;
      case "price": return priceTiers;
      case "aircraft": return aircrafts;
      default: return [];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Flight Schedule</h2>
          <p className="text-gray-500">Manage and view all available flights</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Flight"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            onClick={() => setCurrentView("add")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Flight
          </button>

          <button
            onClick={() => {
              if (!selectedFlight) {
                alert("⚠️ Please select a flight from the table.");
                return;
              }
              setNewFlight({ ...selectedFlight });
              setCurrentView("edit");
            }}
            className={`px-4 py-2 rounded ${selectedFlight
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            disabled={!selectedFlight}
          >
            Edit Flight
          </button>

          <button
            onClick={() => {
              if (!selectedFlight) {
                alert("⚠️ Please select a flight to delete.");
                return;
              }
              const confirmDelete = window.confirm(`Are you sure you want to delete flight "${selectedFlight.flightNo}"?`);
              if (confirmDelete) {
                axios
                  .delete(`http://localhost:8080/api/flights/${selectedFlight.flightNo}`)
                  .then(() => {
                    const updated = flights.filter((f) => f.flightNo !== selectedFlight.flightNo);
                    setFlights(updated);
                    setFilteredFlights(updated);
                    setSelectedFlight(null);
                    alert("🗑️ Flight deleted successfully.");
                  })
                  .catch((err) => {
                    console.error("Delete error:", err);
                    alert("❌ Failed to delete flight.");
                  });
              }
            }}
            className={`px-4 py-2 rounded ${selectedFlight
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            disabled={!selectedFlight}
          >
            Delete Flight
          </button>

        </div>
      </div>

      {/* Form */}
      {(currentView === "add" || currentView === "edit") && (
        <div className="bg-white p-6 rounded-lg shadow border w-full max-w-4xl mx-auto space-y-4">
          <h2 className="text-xl font-semibold">
            {currentView === "add" ? "Add New Flight" : "Edit Flight"}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {["flightNo", "origin", "destination", "departure", "seats", "duration", "price", "aircraft"].map((field) => {
              const options = getOptions(field);
              return (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                  <select
                    value={newFlight[field]}
                    onChange={(e) => setNewFlight({ ...newFlight, [field]: e.target.value })}
                    disabled={field === "flightNo" && currentView === "edit"}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select {field}</option>
                    {options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
          <div className="text-right space-x-2">
            <button
              onClick={resetForm}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => (currentView === "add" ? handleAddFlight() : handleEditFlight())}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {currentView === "add" ? "Submit" : "Update"}
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {currentView === "list" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Plane className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Flights</p>
                  <p className="text-2xl font-bold text-gray-900">{flights.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Seats</p>
                  <p className="text-2xl font-bold text-gray-900">{flights.reduce((sum, f) => sum + f.seats, 0)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Destinations</p>
                  <p className="text-2xl font-bold text-gray-900">{new Set(flights.map(f => f.destination)).size}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                  <p className="text-2xl font-bold text-gray-900">3h 15m</p>
                </div>
              </div>
            </div>
          </div>

          {/* Flights Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['flightNo', 'origin', 'destination', 'departure', 'seats'].map((field) => (
                      <th
                        key={field}
                        onClick={() => handleSort(field)}
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-1">
                          <span>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                          {sortField === field && (
                            <span className="text-blue-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aircraft</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedFlights.map((flight) => (
                    <tr
                      key={flight.flightNo}
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedFlight && selectedFlight.flightNo === flight.flightNo ? "bg-blue-50" : ""}`}
                      onClick={() => setSelectedFlight(flight)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-lg mr-3">
                            <Plane className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{flight.flightNo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{flight.origin}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{flight.destination}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{flight.departure}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{flight.seats}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {flight.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-green-600">₹{flight.price}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {flight.aircraft}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

export default FlightsTab;
