// src/Components/StatsCard.jsx
import React from "react";

const StatsCard = ({ title, value, icon }) => {
    return (
        <div className="p-4 bg-white rounded-xl shadow-md flex items-center justify-between">
            <div>
                <h4 className="text-sm font-medium text-gray-500">{title}</h4>
                <p className="text-2xl font-semibold text-gray-800">{value}</p>
            </div>
            <div className="text-blue-500">{icon}</div>
        </div>
    );
};

export default StatsCard;
