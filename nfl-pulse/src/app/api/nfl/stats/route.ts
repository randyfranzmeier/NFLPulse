import { MAX_YEAR, MIN_YEAR, PLAYERS, PLAYERCATEGORIES, TEAMS, TEAMCATEGORIES } from "@/constants/nflStats";
import { NflStat } from "@/types/nflStats";
import { capitalizeString } from "@/utils/textDisplay";
import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

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
        console.log(`Error retrieving stats: ${err}`);
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
    console.log("ARGUMENTS PASSED: 1, 2, 3: ", teamsOrPlayers, category, year);
    const browser = await chromium.launch({headless: false});
    const page = await browser.newPage();
    await page.goto("https://www.nfl.com/stats/");

    // click on teams or players depending on the users selection
    const teamsOrPlayersText = teamsOrPlayers === TEAMS ? pageMap.TEAMS : pageMap.PLAYERS;
    const teamsOrPlayersLink = page.locator("li.py-2>a", { hasText: `${teamsOrPlayersText}` });
    if (!teamsOrPlayersLink) {
        throw new Error(`Unable to locate element ${teamsOrPlayersText} on page`);
    }
    await teamsOrPlayersLink.click();

    page.waitForLoadState('domcontentloaded');
    // Click on the category based on the users selection
    const categoryLink = page.locator("a", { hasText: `${capitalizeString(category)}` });
    if (!categoryLink) {
        throw new Error(`Unable to locate element ${capitalizeString(category)}`)
    }
    await categoryLink.click().then(async () => {
        // selecting the year, a bit tricky since we need to handle select options instead of clickable elements
    await page.locator("select.d3-o-dropdown").selectOption({
        label: String(year)
    });
    })




    // now we want to obtain two lists from the provided table
    let labels: Array<string> = [];
    let data: Array<number> = [];
    const table = page.locator("table>tbody>tr");
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
        labels.push(name);

        const metricCell = row.locator("td").nth(curTableMetricIndex);
        const metric: string | null = await metricCell.textContent();
        if (!metric) {
            throw new Error(`Unable to find metric in column ${curTableMetricIndex +1}`);
        }
        data.push(Number(metric.replace(/,/g, "").trim()));
    }

    const response: GraphData = {labels: labels, data: data};

    return response;
}

function getChartMetaData(teamsOrPlayers:string, category: string, year: number) {

}

function getCurrentTableMetricIndex(teamsOrPlayers: string, category: string): number {
    // teams category column number or players category column number
    if (teamsOrPlayers === TEAMS) {
        switch(category) {
            case "passing": return 5; // passing yards
            case "rushing": return 2; // rushing yards
            case "receiving": return 2; // receiving yards
            case "scoring": return 3; // total touchdowns
            case "downs": return 5; // receiving 1st, TODO allow for multiple columns in the future
        }
    } else {
        switch (category) {
            case "passing": return 1; // passing yards
            case "rushing": return 1; // rushing yards
            case "receiving": return 2; // receiving yards
            case "fumbles": return 1; // forced fumbles
            case "tackles": return 1; // all tackles player made
            case "interceptions": return 1; // all interceptions
            case "fieldgoals": return 1; // field goals made
            case "kickoffs": return 1; // total kickoffs
            case "kickoffreturns": return 1; // average kickoff return yards
            case "punting": return 1; // average punting yards (yards per punt)
            case "puntreturns": return 1; //average yards per punt return
        }
    }

    // this should never happen
    return -1;
}