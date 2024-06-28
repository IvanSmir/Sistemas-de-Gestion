import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { m } from 'framer-motion';
import { DataPayments } from "@/types/graphics";
ChartJS.register(ArcElement, Tooltip, Legend);



const DoughnutChart: React.FC<DataPayments> = ({ totalIps, totalSalary, totalBonification, totalIncome }) => {
    console.log(totalIps, totalSalary, totalBonification, totalIncome);
    const chartData = {
        labels: ['IPS', 'Salario', 'Bonificaciones', 'Ingresos'],
        datasets: [
            {
                label: 'Income Distribution',
                data: [totalIps, totalSalary, totalBonification, totalIncome],
                backgroundColor: [
                    '#E7648C',
                    '#B2385E',
                    '#6C132F',
                    '#ffa3c4',


                ],
                borderColor: [
                    '#b05c7c',
                ],
                spacing: 10,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
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
