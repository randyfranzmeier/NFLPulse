# NFLPulse
![Screenshot 2025-07-01 212556](https://github.com/user-attachments/assets/52e18ba5-223b-480f-9c1e-34af1e917e48)

## Overview
This project uses Next.js, Tailwind, Playwright, and the OpenAI API to display NFL statistics and insights!

## How it Works
Playwright is a library intented for web content parsing and testing, and it's being used in this project to abstract data from a table at `https://www.nfl.com/stats/`. It's also optionally used to take a screenshot of the entire table and sent to the Open AI model `o4-mini-2025-04-16` for some insights. After this, the graph data and (optional) AI response text is sent to the frontend for an appealing chart and comprehensive statistical analysis.

## Set up
Getting your local dev environment set up is pretty simple, thanks to Next.js:
1. Navigate to the directory "nfl-pulse" and run `npm install`
2. Run the command `npm run dev`
3. To use the OpenAI API, enter your credentials in an untracked .env file in the root directory. Be sure to define the two variables `OPENAI_API_KEY` and `OPENAI_ORGANIZATION_ID`
