'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Employee } from '@/types/period/employee'; // Ajusta el path según tu estructura de proyecto

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

interface BarChartProps {
    data: Employee[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.name),
        datasets: [
            {
                label: 'Salario por Empleado',
                data: data.map(item => item.amount),
                backgroundColor: [
                    'rgba(20, 20, 20, 0.6)',
                    'rgba(50, 50, 50, 0.6)',
                    'rgba(80, 80, 80, 0.6)',
                    'rgba(100, 100, 100, 0.6)',
                    'rgba(105, 105, 105, 0.6)'
                ],
                borderColor: [
                    'white'
                ],
                borderWidth: 1, // Hacer más visible el espacio entre los segmentos
                spacing: 10, // Hacer más visible el espacio entre los segmentos
            }
        ]
    };

    const options = {
        responsive: true,
        cutout: '2%', // Para hacer el doughnut más fino

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
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Empleados',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Salario',
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
}

export default BarChart;
