import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="w-full bg-white px-8 py-3 shadow-md flex justify-between items-center font-sans">
      {/* Logo */}
      <div className="text-xl font-bold text-gray-700">
        LOGO
      </div>

      {/* Center section */}
      <div className="flex items-center gap-10">
        {/* Temperature */}
        <div className="flex flex-col items-center">
          <span className="text-gray-500 text-xs">Outside Temperature</span>
          <span className="text-2xl font-semibold">35ºF</span>
        </div>

        {/* Compass Direction */}
        <div className="flex flex-col items-center">
          <span className="text-gray-500 text-xs">Direction</span>
          <span className="text-2xl font-semibold">N</span>
        </div>

        {/* Lap navigation */}
        <div className="flex items-center gap-4">
          <ChevronLeft className="text-gray-400 cursor-pointer" />
          <span className="font-semibold text-lg">LAP </span>
          <span className="text-2xl font-semibold">03</span>

          <ChevronRight className="text-gray-400 cursor-pointer" />
        </div>
      </div>

      {/* Farm info box */}
      <div className="border rounded-md px-4 py-2 flex flex-col items-center text-sm">
        <div className="flex gap-2">
          <span className="text-gray-600 font-medium">Farm:</span>
          <span className="text-gray-800">Barn id: 0.201566</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-600 font-medium">Date:</span>
          <span className="text-gray-800">16-07-2025</span>
        </div>
      </div>
      
    </div>
  );
};

export default Navbar;
