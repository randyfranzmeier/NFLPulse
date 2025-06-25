"use client"

import React, { useState, useEffect } from 'react';
import { CategoryScale, LinearScale } from 'chart.js';
import Chart from 'chart.js/auto';
// Tell Next.js to let the graph load client-side
import BarChart from '@/components/barchart';
import Error from '@/components/error';
import { PLAYERS, PLAYERCATEGORIES, TEAMS, TEAMCATEGORIES, MAX_YEAR, MIN_YEAR } from '@/constants/nflStats';
import { capitalizeString } from '@/utils/textDisplay';
import { fetchNFLStats } from '@/lib/nflApi';
import { NflStat, PageState } from '@/types/nflStats';
import { DEFAULT, ERROR, LOADING, SUCCESS } from '@/constants/state';

const DEFAULT_AI_RESPONSE_MESSAGE = "Insights will appear here!";

function NFLStatPlatform() {

  useEffect(() => {
    Chart.register(CategoryScale, LinearScale);
  }, []);

  const [pageState, setPageState] = useState<PageState>(DEFAULT);
  const [isTeamOrPlayerOpen, setIsTeamOrPlayerOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [teamOrPlayerText, setIsTeamOrPlayerText] = useState("Select");
  const [categoryText, setCategoryText] = useState("Select");
  const [yearText, setYearText] = useState("Select");
  const [hearInsights, setHearInsights] = useState(true);
  const [aiResponse, setAiResponse] = useState(DEFAULT_AI_RESPONSE_MESSAGE)
  const [teamsOrPlayers, setTeamsOrPlayers] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState(0);
  // these fields are calculated from category and team or player selection
  const [nflStat, setNflStat] = useState<NflStat>({
    labels: [],
    title: "",
    xName: "",
    yName: "",
    barChartData: []
  }); // To customize the chart (sorted by top 5 for now)

  const [nflStatSorted, setNflStatSorted] = useState<NflStat>({
    labels: [],
    title: "",
    xName: "",
    yName: "",
    barChartData: []
  });
  //const title = 'Top 5 Passing Yards per Player in 2024';

  const handleTeamOrPlayerSelection = (selection: string) => {
    if (selection === TEAMS) {
      setTeamsOrPlayers(TEAMS);
      setIsTeamOrPlayerText(capitalizeString(TEAMS));
    } else if (selection === PLAYERS) {
      setTeamsOrPlayers(PLAYERS);
      setIsTeamOrPlayerText(capitalizeString(PLAYERS));
    } else {
      alert(`Expected team or player, got ${selection}`);
    }
    setIsTeamOrPlayerOpen(false);
    // Reset category to prevent an error
    setCategory("");
    setCategoryText("Select");
  }

  const handleSetCategory = (categorySelection: string) => {
    setCategory(categorySelection);
    setCategoryText(capitalizeString(categorySelection));
    setIsCategoryOpen(false);
  }

  const handleSetYear = (yearSelection: number) => {
    setYear(yearSelection);
    setYearText(String(yearSelection));
    setIsYearOpen(false);
  }

  const validateStatParams = () => {
    return teamsOrPlayers != "" && category != "" && year != 0;
  }

  const handleGenerateChart = async () => {
    try {
      if (validateStatParams()) {
        setAiResponse(DEFAULT_AI_RESPONSE_MESSAGE);
        setPageState(LOADING);
        const chartData = await fetchNFLStats({
          "teamsorplayers": teamsOrPlayers,
          "category": category,
          "year": year,
          "insights": hearInsights ? "true" : undefined}) as NflStat;

        setNflStat(chartData);
        // for now, filter by top 5 descending
        let labelToData: any = {};
        let n = chartData.labels.length;
        for (let i = 0; i < n; i++) {
          labelToData[chartData.labels[i]] = chartData.barChartData[i];
        }
        const tupleEntries = Object.entries<number>(labelToData);
        tupleEntries.sort((a, b) => b[1] - a[1])
        const top5Sorted = Object.fromEntries(tupleEntries.slice(0, 5))
        chartData.title = "Top 5 " + chartData.title;

        chartData.barChartData = Object.values(top5Sorted);
        chartData.labels = Object.keys(top5Sorted);
        setNflStatSorted(chartData);
        setPageState(SUCCESS);
        if (hearInsights && chartData.aiResponse) {
          setAiResponse(chartData.aiResponse)
        }
      } else {
        alert('Must select all options to generate stats!');
      }
    } catch (err) {
      console.log(err);
      setPageState(ERROR);
    }

  }


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
                  {teamOrPlayerText}
                  <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {(isTeamOrPlayerOpen) && (
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
                        onClick={() => {
                          handleTeamOrPlayerSelection(TEAMS)
                        }}
                      >
                        Teams
                      </p>
                      <p
                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                        role="menuitem"
                        id="menu-item-1"
                        onClick={() => {
                          handleTeamOrPlayerSelection(PLAYERS)
                        }}
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
                  {categoryText}
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
                      {teamsOrPlayers === TEAMS && TEAMCATEGORIES.map((teamCategory, index) => (
                        <p
                          key={teamCategory}
                          className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                          role="menuitem"
                          id={`menu-item-${index}`}
                          onClick={() => handleSetCategory(teamCategory)}
                        >
                          {teamCategory}
                        </p>))}
                      {teamsOrPlayers === PLAYERS && PLAYERCATEGORIES.map((playerCategory, index) => (
                        <p
                          key={playerCategory}
                          className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                          role="menuitem"
                          id={`menu-item-${index}`}
                          onClick={() => handleSetCategory(playerCategory)}
                        >
                          {playerCategory}
                        </p>))}
                      {teamsOrPlayers === "" && (
                        <p
                          className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                          role="menuitem"
                          id={`menu-item-invalid`}
                        >
                          Please select Teams or Players to view available categories
                        </p>)}
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
                  {yearText}
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
                    <div className="py-1 h-32 overflow-y-scroll" role="none">
                      {/* Dropdown items */}
                      {Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, index) => MIN_YEAR + index).reverse().map((yr, index) =>
                        <p
                          key={yr}
                          className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                          role="menuitem"
                          id={`menu-item-${index}`}
                          onClick={() => handleSetYear(yr)}
                        >
                          {yr}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Button*/}
            <div className="w-64">
              <button
                onClick={() => handleGenerateChart()}
                type="button"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-4 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
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
            {pageState === DEFAULT && (
              <div className="w-full h-64 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                <p>Select all options and generate to view your chart!</p>
              </div>
            )
            }
            {pageState === SUCCESS && (
              <BarChart
                labels={nflStatSorted.labels}
                barChartData={nflStatSorted.barChartData}
                title={nflStatSorted.title}
                xName={nflStatSorted.xName}
                yName={nflStatSorted.yName}
              />)}
            {pageState === LOADING && (
              <p className="w-full h-full text-gray-800">Generating NFL Stats!!!</p>
            )}
            {pageState == ERROR && (
              <Error msg={'Unable to load chart, please refresh the page and try again'} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFLStatPlatform;