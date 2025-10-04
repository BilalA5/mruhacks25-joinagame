import React from "react";
import { useNavigate } from "react-router-dom";
//test
export default function HostOrJoin({ selectedSport }) {
    // use react router to move between pages
    const navigate = useNavigate();

    // capitalize the sport name for better display
    const sportDisplay = selectedSport
    ? selectedSport.charAt(0).toUpperCase() + selectedSport.slice(1)
    : "Sport";

    return (
    // main container for the page layout
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-blue-800 text-white px-6">

      {/* show selected sport name at the top */}
      <h1 className="text-3xl font-extrabold mb-4">
        {sportDisplay} 
      </h1>

      {/* short message below the sport name */}
      <p className="text-slate-300 text-sm mb-10">
        what would you like to do for {sportDisplay} today?
      </p>

      {/* button for hosting a game */}
      <button
        onClick={() => navigate(`/host/${selectedSport}`)}
        className="w-64 py-3 mb-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-lg font-semibold shadow-lg transition-transform active:scale-95"
      >
        host a game
      </button>

      {/* button for joining a game */}
      <button
        onClick={() => navigate(`/join/${selectedSport}`)}
        className="w-64 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-lg font-semibold shadow-lg transition-transform active:scale-95"
      >
        join a game
      </button>

      {/* small footer text */}
      <p className="mt-10 text-xs text-slate-400">
        connecting players in your city 💪
      </p>
    </div>
  );
}