import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { translations, type Language } from '@/lib/translations';

Chart.register(...registerables);

interface AQIChartProps {
  data: Array<{ time: string; aqi: number }>;
  language: Language;
}

export function AQIChart({ data, language }: AQIChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const t = translations[language];

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(item => item.time),
        datasets: [{
          label: 'AQI',
          data: data.map(item => item.aqi),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: '#3b82f6',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: (context) => `AQI: ${context.parsed.y}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 300,
            grid: {
              color: 'rgba(156, 163, 175, 0.2)'
            },
            ticks: {
              color: '#6b7280'
            }
          },
          x: {
            grid: {
              color: 'rgba(156, 163, 175, 0.2)'
            },
            ticks: {
              color: '#6b7280',
              maxTicksLimit: 8
            }
          }
        },
        elements: {
          point: {
            hoverRadius: 8
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutCubic'
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (!data.length) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.aqiTrend}</h3>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <div>Loading chart data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 animate-in slide-in-from-bottom-4 duration-500 delay-1000">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.aqiTrend}</h3>
      <div className="h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
