import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface PieChartData {
    ips: number;
    salary: number;
    otherIncomes: number;
    bonus: number;
}

export interface PieChartProps {
    data: PieChartData;
}

const DoughnutChart: React.FC<PieChartProps> = ({ data }) => {
    const chartData = {
        labels: ['IPS', 'Salary', 'Other Incomes', 'Bonus'],
        datasets: [
            {
                label: 'Income Distribution',
                data: [data.ips, data.salary, data.otherIncomes, data.bonus],
                backgroundColor: [
                    'rgba(20, 20, 20, 0.6)',  // White
                    'rgba(50, 50, 50, 0.6)',     // White
                    'rgba(80, 80, 80, 0.6)',     // Dark Gray
                    'rgba(100, 100, 100, 0.6)',  // Light Gray
                    'rgba(105, 105, 105, 0.6)'   // Dim Gray
                ],
                borderColor: [
                    'rgba(192, 192, 192, 1)',  // Silver
                    'rgba(128, 128, 128, 1)',  // Gray
                    'rgba(169, 169, 169, 1)',  // Dark Gray
                    'rgba(105, 105, 105, 1)'   // Dim Gray
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: any) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    },
                },
            },
        },
    };

    return <Doughnut data={chartData} options={options} />;
};

export default DoughnutChart;
