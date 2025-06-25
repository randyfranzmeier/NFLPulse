export type NflStat = {
    labels: Array<string>,
    barChartData: Array<number>,
    title: string,
    xName: string,
    yName: string,
    aiResponse?: string; 
};

export type PageState = 'success' | 'error' | 'loading' | 'default';