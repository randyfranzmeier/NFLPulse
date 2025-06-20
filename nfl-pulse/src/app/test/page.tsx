"use client"; // Required for Next.js 13+ client components

import React, { useState } from 'react';

function NFLPulsePlatform() {
  // State for each dropdown's open/close status
  const [isTeamOrPlayerOpen, setIsTeamOrPlayerOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isAiInsightEnabled, setIsAiInsightEnabled] = useState(true); // State for the AI toggle

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Top Header: NFL Pulse */}
      <header className="bg-gray-800 text-white py-4 text-center">
        <h2 className="text-2xl font-semibold">NFL Pulse</h2>
      </header>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        {/* Main Title */}
        <div className="flex justify-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">The Worlds Best NFL Stat Platform</h1>
        </div>

        {/* Two-Column Layout: Controls on left, Insights/Graph on right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16"> {/* Adjust gap for larger screens */}

          {/* Left Column: Dropdowns and Generate Button */}
          {/* Using flex-col and items-center/start to stack and align items */}
          <div className="flex flex-col items-center md:items-start space-y-6 md:pl-8 lg:pl-16">
            {/* Teams or Players Dropdown */}
            <div className="w-64"> {/* Fixed width for consistent dropdown appearance */}
              <p className="text-xl font-medium text-gray-700 mb-2">Teams or Players</p>
              <div className="relative inline-block text-left w-full">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  id="team-player-button" // Unique ID
                  aria-expanded={isTeamOrPlayerOpen}
                  aria-haspopup="true"
                  onClick={() => setIsTeamOrPlayerOpen(!isTeamOrPlayerOpen)}
                >
                  Select...
                  {/* Dropdown Arrow Icon */}
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isTeamOrPlayerOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" // z-10 to ensure it's on top
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="team-player-button"
                    tabIndex="-1"
                  >
                    <div className="py-1" role="none">
                      <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">Teams</a>
                      <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">Players</a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="w-64">
              <p className="text-xl font-medium text-gray-700 mb-2">Category</p>
              <div className="relative inline-block text-left w-full">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  id="category-button" // Unique ID
                  aria-expanded={isCategoryOpen}
                  aria-haspopup="true"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  Select...
                  {/* Dropdown Arrow Icon */}
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isCategoryOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="category-button"
                    tabIndex="-1"
                  >
                    <div className="py-1" role="none">
                      <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">Offense</a>
                      <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">Defense</a>
                      <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">Special Teams</a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Year Dropdown */}
            <div className="w-64">
              <p className="text-xl font-medium text-gray-700 mb-2">Year</p>
              <div className="relative inline-block text-left w-full">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  id="year-button" // Unique ID
                  aria-expanded={isYearOpen}
                  aria-haspopup="true"
                  onClick={() => setIsYearOpen(!isYearOpen)}
                >
                  Select...
                  {/* Dropdown Arrow Icon */}
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {isYearOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="year-button"
                    tabIndex="-1"
                  >
                    <div className="py-1" role="none">
                      {/* Example years, you might generate these dynamically */}
                      <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">2023</a>
                      <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">2022</a>
                      <a href="#" className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">2021</a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <button className="mt-4 px-6 py-3 bg-blue-600 text-white text-lg font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-64">
              Generate
            </button>
          </div>

          {/* Right Column: AI Insights and Graph */}
          <div className="flex flex-col space-y-8 pr-8 lg:pr-16"> {/* Adjust padding for right alignment */}
            {/* AI Insights Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold text-gray-800">Hear insights from FirstDown Frank</p>
                {/* Simple Toggle Switch */}
                <label htmlFor="ai-toggle" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="ai-toggle"
                      className="sr-only" // sr-only makes it visually hidden but accessible
                      checked={isAiInsightEnabled}
                      onChange={() => setIsAiInsightEnabled(!isAiInsightEnabled)}
                    />
                    {/* Track */}
                    <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                    {/* Thumb */}
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform"
                         style={{ transform: isAiInsightEnabled ? 'translateX(100%)' : 'translateX(0)', backgroundColor: isAiInsightEnabled ? '#48bb78' : '#e2e8f0' }}>
                    </div>
                  </div>
                </label>
              </div>
              <div className="bg-red-500 h-64 flex items-center justify-center text-white text-xl rounded">
                Display AI insights here
              </div>
            </div>

            {/* Graph Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-lg font-semibold text-gray-800 mb-4">Statistical Graph</p>
              <div className="bg-gray-200 h-64 flex items-center justify-center text-gray-600 rounded">
                {/* Placeholder for the graph - integrate your charting library here */}
                (Graph will go here)
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default NFLPulsePlatform;