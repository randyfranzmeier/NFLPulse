"use client"

import dynamic from 'next/dynamic';
import { ChartOptions } from 'chart.js';
import { NflStat } from '@/types/nflStats';

const Bar = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), { ssr: false });


export default function BarChart({
    labels,
    barChartData,
    title,
    xName,
    yName
}: NflStat) {

    const data = {
        labels: labels,
        datasets: [{
          data: barChartData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)', // Red
            'rgba(54, 162, 235, 0.8)', // Blue
            'rgba(255, 205, 86, 0.8)', // Yellow
            'rgba(75, 192, 192, 0.8)', // Teal
            'rgba(153, 102, 255, 0.8)',// Purple
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
          ],
          borderWidth: 1
        }]
      };
    
      const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 24,
              weight: 'bold',
              family: 'sans-serif'
            },
            color: '#333',
            padding: {
              top: 10,
              bottom: 30
            }
          },
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleFont: {
              size: 16,
              weight: 'bold'
            },
            bodyFont: {
              size: 14
            },
            padding: 10,
            cornerRadius: 6
          }
        },
        scales: {
          y: {
            type: 'linear',
            beginAtZero: true,
            title: {
              display: true,
              text: yName,
              font: {
                size: 16,
                weight: 'bold'
              },
              color: '#555'
            },
            grid: {
              display: false
            }
          },
          x: {
            type: 'category',
            title: {
              display: true,
              text: xName,
              font: {
                size: 16,
                weight: 'bold'
              },
              color: '#555'
            },
            grid: {
              display: false
            }
          }
        }
      };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-96">
            <div className="w-full h-full">
                <Bar data={data} options={chartOptions} />
            </div>
        </div>
    );
}