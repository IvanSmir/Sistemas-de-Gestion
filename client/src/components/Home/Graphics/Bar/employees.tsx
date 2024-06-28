'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Employee } from '@/types/graphics'; // Ajusta el path según tu estructura de proyecto

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

interface Employees {
    employees: Employee[];
}

const BarChart: React.FC<Employees> = ({ employees }) => {
    console.log(employees);
    const chartData = {
        labels: employees.map(item => item.name),
        datasets: [
            {
                label: 'Salario por Empleado',
                data: employees.map(item => item.amountTotal),
                backgroundColor: [
                    '#E7648C',
                    '#B2385E',
                    '#6C132F',
                    '#ffa3c4',


                ],
                borderColor: [
                    '#b05c7c',
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
