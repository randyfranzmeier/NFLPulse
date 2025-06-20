"use client"

import React, { useState } from 'react';

function NFLStatPlatform() {
  const [isTeamOrPlayerOpen, setIsTeamOrPlayerOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [hearInsights, setHearInsights] = useState(true);
  const [aiResponse, setAiResponse] = useState("Click generate to hear some fun footbal facts!")

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold text-gray-700 mt-3">The Worlds Best NFL Stat Platform</h1>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">

          {/* Left Column */}
          <div className="flex flex-col items-center md:items-start space-y-6 md:pl-8 lg:pl-16">
            {/* Teams or Players */}
            <div className="w-64">
              <p className="text-xl font-medium text-gray-700 mb-2">Teams or Players</p>
              <div className="relative inline-block text-left w-full">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-6 py-4 bg-white text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  id="menu-team-player"
                  aria-expanded={isTeamOrPlayerOpen}
                  aria-haspopup="true"
                  onClick={() => {
                    setIsTeamOrPlayerOpen(!isTeamOrPlayerOpen);
                  }}
                >
                  Select
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isTeamOrPlayerOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                  >
                    <div className="py-1" role="none">
                      {/* Dropdown items */}
                      <p
                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                        role="menuitem"
                        id="menu-item-0"
                      >
                        Teams
                      </p>
                      <p
                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                        role="menuitem"
                        id="menu-item-1"
                      >
                        Players
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="w-64">
              <p className="text-xl font-medium text-gray-700 mb-2">Category</p>
              <div className="relative inline-block text-left w-full">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-6 py-4 bg-white text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  id="menu-category"
                  aria-expanded={isTeamOrPlayerOpen}
                  aria-haspopup="true"
                  onClick={() => {
                    setIsCategoryOpen(!isCategoryOpen);
                  }}
                >
                  Select
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isCategoryOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                  >
                    <div className="py-1" role="none">
                      {/* Dropdown items */}
                      <p
                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                        role="menuitem"
                        id="menu-item-0"
                      >
                        Category 1
                      </p>
                      <p
                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                        role="menuitem"
                        id="menu-item-1"
                      >
                        Category 2
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Year */}
            <div className="w-64">
              <p className="text-xl font-medium text-gray-700 mb-2">Year</p>
              <div className="relative inline-block text-left w-full">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-6 py-4 bg-white text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  id="menu-year"
                  aria-expanded={isTeamOrPlayerOpen}
                  aria-haspopup="true"
                  onClick={() => {
                    setIsYearOpen(!isYearOpen);
                  }}
                >
                  Select
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {isYearOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                  >
                    <div className="py-1" role="none">
                      {/* Dropdown items */}
                      <p
                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                        role="menuitem"
                        id="menu-item-0"
                      >
                        2024
                      </p>
                      <p
                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                        role="menuitem"
                        id="menu-item-1"
                      >
                        2023
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Button*/}
            <div className="w-64">
              <button type="button" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-4 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Generate
              </button>

            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-8 pr-8 lg:pr-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-5 mb-4">
                <p className="text-lg font-semibold text-gray-800">Hear insights from FirstDown Frank</p>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox"
                    value=""
                    className="sr-only peer"
                    checked={hearInsights}
                    onChange={() => { setHearInsights(!hearInsights) }}
                  ></input>
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {hearInsights &&
                <p className="text-gray-800 text-lg font-semibold justify-center">{aiResponse}</p>
              }
            </div>

            {/* Graph TODO convert to component */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-800">Display Graph here!</p>
              <div className="bg-gray-200 h-64 flex items-center justify-center text-gray-600 rounded">
                <p>Graph</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFLStatPlatform;