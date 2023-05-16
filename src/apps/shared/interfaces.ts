export interface ChartDataItem {
    x: number,
    y: number
}

export interface ChartSeriesItem {
    name: string,
    data: ChartDataItem[]
}

export type ChartSeries = ChartSeriesItem[];
