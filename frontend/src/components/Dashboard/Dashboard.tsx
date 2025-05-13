import React, { useEffect, useState } from 'react';

// Mock data type definitions
interface WeeklyData {
  day: string;
  normal: number;
  injection: number;
}

interface DashboardData {
  totalMessages: number;
  normalMessages: number;
  injectionMessages: number;
  weeklyData: WeeklyData[];
}

const Dashboard: React.FC = () => {
  // State for dashboard data
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

  // Calculate percentages
  const totalPercent = (data.normalMessages / data.totalMessages) * 100;
  const injectionPercent = (data.injectionMessages / data.totalMessages) * 100;

  // Initialize dashboard data when component mounts
  useEffect(() => {
    // In the future, this could fetch real data from an API
    // For now, we're using the mock data initialized in the state
    
    // You could add an API call here, for example:
    // async function fetchDashboardData() {
    //   try {
    //     const response = await fetch('/api/v1/dashboard/stats');
    //     const apiData = await response.json();
    //     setData(apiData);
    //   } catch (error) {
    //     console.error('Error fetching dashboard data:', error);
    //   }
    // }
    // fetchDashboardData();
    
    // Check server status
    fetch('http://localhost:8000/api/health')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(statusData => {
        const serverStatusElement = document.getElementById('serverStatus');
        if (serverStatusElement) {
          serverStatusElement.textContent = `Server Status: ${statusData.status || 'Online'}`;
        }
      })
      .catch(error => {
        console.error('Error checking server status:', error);
        const serverStatusElement = document.getElementById('serverStatus');
        if (serverStatusElement) {
          serverStatusElement.textContent = `Server Status: Error - ${error.message}`;
        }
      });
  }, []);

  return (
    <div id="dashboard-page" className="page active">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      
      {/* Top row with stats and pie chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Total Messages Stat */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Total Messages</h3>
          <div className="flex items-center justify-center flex-col">
            <div className="text-8xl font-bold text-blue-600 leading-none mb-4" id="total-messages-count">
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
          <div className="w-full h-64 flex justify-center items-center" id="pie-chart-container">
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
                strokeDasharray={`${totalPercent} ${100-totalPercent}`} 
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
                strokeDasharray={`${injectionPercent} ${100-injectionPercent}`} 
                strokeDashoffset={`-${totalPercent}`}
              ></circle>
              <g className="chart-text">
                <text x="50%" y="50%" className="chart-number" textAnchor="middle" alignmentBaseline="middle">
                  {totalPercent.toFixed(1)}%
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
              <span className="text-sm">Normal ({totalPercent.toFixed(1)}%)</span>
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
        {/* Simplified bar chart with explicit heights */}
        <div className="w-full p-4">
          {/* Y-axis and chart grid */}
          <div className="flex" style={{ height: "400px" }}>
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
                {data.weeklyData.map((dayData, index) => (
                  <div className="flex flex-col items-center mx-2" style={{ width: "40px" }} key={index}>
                    <div 
                      className="w-full bg-blue-500 rounded-t bar-chart" 
                      style={{ height: `${dayData.normal * 5}px` }} 
                      data-value={dayData.normal}
                      title={`${dayData.normal} normal messages`}
                    ></div>
                    <div 
                      className="w-full bg-red-500 rounded-b mt-0.5 bar-chart" 
                      style={{ height: `${dayData.injection * 5}px` }} 
                      data-value={dayData.injection}
                      title={`${dayData.injection} potential injections`}
                    ></div>
                    <p className="text-xs mt-2 font-medium">{dayData.day}</p>
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
        
        <p id="serverStatus" className="text-gray-500 mt-6 text-sm">Server Status: Online</p>
      </div>
    </div>
  );
};

export default Dashboard;