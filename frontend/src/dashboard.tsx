import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface DashboardData {
  totalMessages: number;
  normalMessages: number;
  injectionMessages: number;
  weeklyData: {
    day: string;
    normal: number;
    injection: number;
  }[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    totalMessages: 1247,
    normalMessages: 1189,
    injectionMessages: 58,
    weeklyData: [
      { day: 'Mon', normal: 48, injection: 4 },
      { day: 'Tue', normal: 36, injection: 6 },
      { day: 'Wed', normal: 60, injection: 8 },
      { day: 'Thu', normal: 40, injection: 2 },
      { day: 'Fri', normal: 52, injection: 5 },
      { day: 'Sat', normal: 24, injection: 1 },
      { day: 'Sun', normal: 20, injection: 1 }
    ]
  });
  
  // Tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: '',
    x: 0,
    y: 0
  });

  // Calculate percentages
  const normalPercent = (data.normalMessages / data.totalMessages) * 100;
  const injectionPercent = (data.injectionMessages / data.totalMessages) * 100;

  // TODO: In future, fetch data from API
  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       const response = await fetch('http://localhost:8000/api/v1/dashboard', {
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`
  //         }
  //       });
  //       const data = await response.json();
  //       setData(data);
  //     } catch (error) {
  //       console.error('Error fetching dashboard data:', error);
  //     }
  //   };
  //   fetchDashboardData();
  // }, []);

  return (
    <div className="relative">
      {/* Tooltip component */}
      {tooltip.visible && (
        <div
          className="absolute bg-gray-800 text-white py-1 px-2 rounded text-xs z-50 pointer-events-none"
          style={{
            left: tooltip.x - 60, // Offset to center the tooltip
            top: tooltip.y - 25,
            transform: 'translateX(50%)'
          }}
        >
          {tooltip.text}
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      
      {/* Top row with stats and pie chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Total Messages Stat */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Total Messages</h3>
          <div className="flex items-center justify-center flex-col">
            <div className="text-8xl font-bold text-blue-600 leading-none mb-4">
              {data.totalMessages.toLocaleString()}
            </div>
            <div className="flex items-center text-green-500 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span>12.5% increase from last month</span>
            </div>
          </div>
        </div>
        
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Message Types</h3>
          <div className="w-full h-64 flex justify-center items-center">
            {/* SVG Pie Chart */}
            <svg width="200" height="200" viewBox="0 0 42 42" className="donut">
              <circle className="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
              <circle className="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#d2d3d4" strokeWidth="3"></circle>
              
              {/* Normal messages segment */}
              <circle 
                className="donut-segment" 
                cx="21" 
                cy="21" 
                r="15.91549430918954" 
                fill="transparent" 
                stroke="#0074D9" 
                strokeWidth="3" 
                strokeDasharray={`${normalPercent.toFixed(1)} ${(100-normalPercent).toFixed(1)}`} 
                strokeDashoffset="0"
              ></circle>
              
              {/* Injection segment */}
              <circle 
                className="donut-segment" 
                cx="21" 
                cy="21" 
                r="15.91549430918954" 
                fill="transparent" 
                stroke="#FF4136" 
                strokeWidth="3" 
                strokeDasharray={`${injectionPercent.toFixed(1)} ${(100-injectionPercent).toFixed(1)}`} 
                strokeDashoffset={`-${normalPercent.toFixed(1)}`}
              ></circle>
              
              <g className="chart-text">
                <text x="50%" y="50%" className="chart-number" textAnchor="middle" alignmentBaseline="middle">
                  {normalPercent.toFixed(1)}%
                </text>
                <text x="50%" y="50%" className="chart-label" textAnchor="middle" alignmentBaseline="middle" dy="1.2em">
                  normal
                </text>
              </g>
            </svg>
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex items-center mr-6">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">Normal ({normalPercent.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">Injections ({injectionPercent.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom row with weekly chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Messages Last Week</h3>
        {/* Bar chart */}
        <div className="w-full p-4">
          {/* Y-axis and chart grid */}
          <div className="flex" style={{ height: '400px' }}>
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between pr-2 text-right">
              <span className="text-xs text-gray-600">80</span>
              <span className="text-xs text-gray-600">60</span>
              <span className="text-xs text-gray-600">40</span>
              <span className="text-xs text-gray-600">20</span>
              <span className="text-xs text-gray-600">0</span>
            </div>
            
            {/* Chart area with grid lines */}
            <div className="flex-1 relative">
              {/* Grid lines */}
              <div className="absolute inset-0">
                <div className="absolute top-0 w-full border-t border-gray-200"></div>
                <div className="absolute top-1/4 w-full border-t border-gray-200"></div>
                <div className="absolute top-2/4 w-full border-t border-gray-200"></div>
                <div className="absolute top-3/4 w-full border-t border-gray-200"></div>
                <div className="absolute bottom-0 w-full border-t border-gray-400"></div>
              </div>
              
              {/* Bars container */}
              <div className="flex justify-between h-full items-end">
                {data.weeklyData.map((day, index) => (
                  <div key={index} className="flex flex-col items-center mx-2" style={{ width: '40px' }}>
                    <div 
                      className="w-full bg-blue-500 rounded-t bar-chart" 
                      style={{ height: `${day.normal * 5}px` }} 
                      data-value={day.normal}
                      onMouseOver={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          visible: true,
                          text: `${day.normal} normal messages`,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 5
                        });
                      }}
                      onMouseOut={() => setTooltip({ ...tooltip, visible: false })}
                    ></div>
                    <div 
                      className="w-full bg-red-500 rounded-b mt-0.5 bar-chart" 
                      style={{ height: `${day.injection * 5}px` }} 
                      data-value={day.injection}
                      onMouseOver={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          visible: true,
                          text: `${day.injection} potential injections`,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 5
                        });
                      }}
                      onMouseOut={() => setTooltip({ ...tooltip, visible: false })}
                    ></div>
                    <p className="text-xs mt-2 font-medium">{day.day}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <div className="flex items-center mr-6">
            <div className="w-4 h-4 bg-blue-500 mr-2"></div>
            <span className="text-sm">Normal Messages</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2"></div>
            <span className="text-sm">Potential Injections</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Initialize the Dashboard component
document.addEventListener('DOMContentLoaded', () => {
  const dashboardRoot = document.getElementById('dashboard-react-root');
  if (dashboardRoot) {
    const root = createRoot(dashboardRoot);
    root.render(<Dashboard />);
  }
});

export default Dashboard;