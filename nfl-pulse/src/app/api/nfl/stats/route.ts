import { MAX_YEAR, MIN_YEAR, PLAYERS, PLAYERCATEGORIES, TEAMS, TEAMCATEGORIES } from "@/constants/nflStats";
import { NflStat } from "@/types/nflStats";
import { capitalizeString } from "@/utils/textDisplay";
import { NextRequest, NextResponse } from "next/server";
import { Browser, chromium, Page } from "playwright";

const pageMap = {
    TEAMS: "Team Stats",
    PLAYERS: "Player Stats"
} as const;

type GraphData = {
    labels: Array<string>;
    data: Array<number>;
};

export async function GET(
    request: NextRequest
) {
    try {
        const teamOrPlayer = request.nextUrl.searchParams.get("teamsorplayers");
        const category = request.nextUrl.searchParams.get("category");
        const year = Number(request.nextUrl.searchParams.get("year"));

        if (!validateStatsRequest(teamOrPlayer, category, year)) {
            return NextResponse.json({ error: "Bad Request", status: 400 });
        }

        const testData: NflStat = {
            xName: "Player Name",
            yName: "Passing yards",
            title: "Top 5 Passing Yard per Player",
            labels: [],
            barChartData: []
            // labels: ["Joe Burrow", "Jared Goff", "Baker Mayfield", "Geno Smith", "Sam Darnold"],
            // barChartData: [4918, 4629, 4500, 4320, 4319]
        }
        // TODO figure out title, xName, and yName based off selection
        const response = await getNflDataWebCrawler(teamOrPlayer as string, category as string, year);
        testData.labels = response.labels;
        testData.barChartData = response.data;
        console.log("Res: ", testData);
        return NextResponse.json(testData);

    } catch (err) {
        console.log("ERROR DUDE: ", err);
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

async function getNflDataWebCrawler(teamsOrPlayers: string, category: string, year: number): Promise<GraphData> {
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
    const rows = await table.count();
    // the metric is displayed in a different column for each category
    const nameLocator = teamsOrPlayers === TEAMS ? "td>div>div.d3-o-club-fullname" : "td>div>div>a";
    const curTableMetricIndex = getCurrentTableMetricIndex(teamsOrPlayers, category);

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

    const response: GraphData = {labels: labels, data: data};

    return response;
}

function getChartMetaData(teamsOrPlayers:string, category: string, year: number) {

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