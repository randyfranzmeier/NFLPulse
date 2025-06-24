export async function fetchNFLStats(params: any) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`/api/nfl/stats?${queryParams}`);
    const parsedResponse = await response.json();
   
    if (parsedResponse.error) {
        throw new Error(`Encountered an error calling the NFL stat endpoint: ${parsedResponse.error}`);
    }

    return parsedResponse;
}