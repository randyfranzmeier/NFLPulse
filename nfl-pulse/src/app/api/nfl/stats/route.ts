import { MAX_YEAR, MIN_YEAR, PLAYERS, PLAYERCATEGORIES, TEAMS, TEAMCATEGORIES } from "@/constants/nflStats";
import { NflStat } from "@/types/nflStats";
import { capitalizeString } from "@/utils/textDisplay";
import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { getAiResponse } from "./openAiApi";

const pageMap = {
    TEAMS: "Team Stats",
    PLAYERS: "Player Stats"
} as const;

type GraphMetaData = {
    title: string;
    xName: string;
    yName: string;
};

export async function GET(
    request: NextRequest
) {
    try {
        const teamOrPlayer = request.nextUrl.searchParams.get("teamsorplayers");
        const category = request.nextUrl.searchParams.get("category");
        const year = Number(request.nextUrl.searchParams.get("year"));
        const insights = request.nextUrl.searchParams.get("insights") ? true : false;

        if (!validateStatsRequest(teamOrPlayer, category, year)) {
            return NextResponse.json({ error: "Bad Request", status: 400 });
        }
        
        let response = await getNflDataWebCrawler(teamOrPlayer as string, category as string, year);

        if (insights) {
            response.aiResponse = await getAiResponse("screenshot.png", `Based on the title and image, give the user some football-related insights. TITLE\n${response.title}`);
        }

         return NextResponse.json(response);

    } catch (err) {
        console.log("Internal Error: ", err);
        return NextResponse.json({ error: "Internal server error", status: 500 });
    }
}

function validateStatsRequest(teamOrPlayer: string | null, category: string | null, year: number | null): boolean {
    if (!teamOrPlayer || !category || !year || year < MIN_YEAR || year > MAX_YEAR) {
        console.log("teamOrPlayer ", teamOrPlayer, "category ", category, "year ", year);
        return false;
    }

    if (teamOrPlayer == TEAMS) {
        return TEAMCATEGORIES.includes(category);
    } else if (teamOrPlayer == PLAYERS) {
        return PLAYERCATEGORIES.includes(category);
    } else {
        return false;
    }
}

async function getNflDataWebCrawler(teamsOrPlayers: string, category: string, year: number): Promise<NflStat> {
    switch(category) {
        case "fieldgoals": category = "Field Goals"; break;
        case "kickoffreturns": category = "Kickoff Returns"; break;
        case "puntreturns": category = "Punt Returns"; break;
        default: category = capitalizeString(category);
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto("https://www.nfl.com/stats/");

    // click on teams or players depending on the users selection
    const teamsOrPlayersText = teamsOrPlayers === TEAMS ? pageMap.TEAMS : pageMap.PLAYERS;
    const teamsOrPlayersLink = page.getByRole("link", { name: `${teamsOrPlayersText}` });
    if (!teamsOrPlayersLink) {
        throw new Error(`Unable to locate element ${teamsOrPlayersText} on page`);
    }
    await teamsOrPlayersLink.click();

    // Click on the category based on the users selection
    const categoryLink = page.getByRole("link", { name: `${category}` });
    if (!categoryLink) {
        throw new Error(`Unable to locate element ${category}`)
    }
    await categoryLink.click();

    await page.waitForLoadState('load');

    // selecting the year, a bit tricky since we need to handle select options instead of clickable elements
    await page.locator("select.d3-o-dropdown").selectOption({
        label: String(year)
    });
    // now we want to obtain two lists from the provided table
    let labelToData: any = {};
    const table = page.locator("table>tbody>tr");
    // wait for the table to display
    await table.first().waitFor({state: 'visible', timeout: 5000});

    // take screenshot if ai response is desired
    const acceptCookiesButton = page.getByRole("button", {name: "Accept Cookies"});
    await acceptCookiesButton.click();
    await page.locator("table").screenshot({path: 'screenshot.png'});

    const rows = await table.count();
    // the metric is displayed in a different column for each category
    const nameLocator = teamsOrPlayers === TEAMS ? "td>div>div.d3-o-club-fullname" : "td>div>div>a";
    const curTableMetricIndex = getCurrentTableMetricIndex(teamsOrPlayers, category);

    // TODO go to next page if the button exists to get all data
    for (let i = 0; i < rows; i++) {
        const row = table.nth(i);
        const name: string | null = await row.locator(nameLocator).textContent();
        if (!name) {
            throw new Error("Unable to read team or player name");
        }

        const metricCell = row.locator("td").nth(curTableMetricIndex);
        const metric: string | null = await metricCell.textContent();
        if (!metric) {
            throw new Error(`Unable to find metric in column ${curTableMetricIndex +1}`);
        }
        labelToData[cleanString(name)] = cleanString(metric);
       
    }

    let labels: Array<string> = [];
    let data: Array<number> = [];
    for (const [key, val] of Object.entries(labelToData)) {
        labels.push(key);
        data.push(Number(val));
    }
    // close the browser now that we're done
    await browser.close();

    // Metadata for the visual
    const metaData = getChartMetaData(teamsOrPlayers, category, year);
    const response: NflStat = {labels: labels, barChartData: data, xName: metaData.xName, yName: metaData.yName, title: metaData.title};
    return response;
}

function getChartMetaData(teamsOrPlayers:string, category: string, year: number): GraphMetaData {
    let title, xName, yName;

    xName = teamsOrPlayers === TEAMS ? "Team Name" : "Player Name";

    switch(category) {
        case "Passing": yName = "Passing Yards"; break;
        case "Rushing": yName = "Rushing Yards"; break;
        case "Receiving": yName = "Receiving Yards"; break;
        case "Scoring": yName = "Touchdowns"; break;
        case "Downs": yName = "Receiving 1st Downs"; break;
        case "Fumbles": yName = "Forced Fumbles"; break;
        case "Kickoffs": yName = "Total Kickoffs"; break;
        case "Kickoff Returns": yName = "Average Kickoff Return Yards";
        case "Punting": yName = "Average Punting Yards"; break;
        case "Punt Returns": yName = "Average Punt Return Yards"; break;
        default: yName = category;
    }

    title = `${yName} per ${xName === "Team Name"? "Team" : "Player"} in ${year}`;
    return {
        title: title,
        xName: xName,
        yName: yName
    } as GraphMetaData;
}

function getCurrentTableMetricIndex(teamsOrPlayers: string, category: string): number {
    // teams category column number or players category column number
    if (teamsOrPlayers === TEAMS) {
        switch(category) {
            case "Passing": return 5; // passing yards
            case "Rushing": return 2; // rushing yards
            case "Receiving": return 2; // receiving yards
            case "Scoring": return 3; // total touchdowns
            case "Downs": return 5; // receiving 1st, TODO allow for multiple columns in the future
        }
    } else {
        switch (category) {
            case "Passing": return 1; // passing yards
            case "Rushing": return 1; // rushing yards
            case "Receiving": return 2; // receiving yards
            case "Fumbles": return 1; // forced fumbles
            case "Tackles": return 1; // all tackles player made
            case "Interceptions": return 1; // all interceptions
            case "Field Goals": return 1; // field goals made
            case "Kickoffs": return 1; // total kickoffs
            case "Kickoff Returns": return 1; // average kickoff return yards
            case "Punting": return 1; // average punting yards (yards per punt)
            case "Punt Returns": return 1; //average yards per punt return
        }
    }

    // this should never happen
   throw new Error(`Invalid category ${category}`);
}

function cleanString(str: string): string {
    return str.replace(/,/g, "").trim();
}