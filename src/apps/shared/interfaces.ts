export type ChartSeries = ChartSeriesItem[];

export interface ChartSeriesItem {
    name: string;
    data: ChartDataItem[];
}

export interface ChartDataItem {
    x: number;
    y: number;
    fillColor?: string;
    label?: string;
}
