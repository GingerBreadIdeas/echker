import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div id="dashboard-page" className="page active">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      
      {/* Top row with stats and pie chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Total Messages Stat */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Total Messages</h3>
          <div className="flex items-center justify-center flex-col">
            <div className="text-8xl font-bold text-blue-600 leading-none mb-4" id="total-messages-count">1,247</div>
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
            {/* SVG Pie Chart (mock) - corrected segment positions */}
            <svg width="200" height="200" viewBox="0 0 42 42" className="donut">
              <circle className="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
              <circle className="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#d2d3d4" strokeWidth="3"></circle>
              {/* Normal messages segment (95.3%) - starts at top (0 degrees) */}
              <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#0074D9" strokeWidth="3" strokeDasharray="95.3 4.7" strokeDashoffset="0"></circle>
              {/* Injection segment (4.7%) - continues where normal segment ends */}
              <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#FF4136" strokeWidth="3" strokeDasharray="4.7 95.3" strokeDashoffset="-95.3"></circle>
              <g className="chart-text">
                <text x="50%" y="50%" className="chart-number" textAnchor="middle" alignmentBaseline="middle">
                  95.3%
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
              <span className="text-sm">Normal (95.3%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">Injections (4.7%)</span>
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
                {/* Monday */}
                <div className="flex flex-col items-center mx-2" style={{ width: "40px" }}>
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: "240px" }} data-value="48"></div>
                  <div className="w-full bg-red-500 rounded-b mt-0.5" style={{ height: "20px" }} data-value="4"></div>
                  <p className="text-xs mt-2 font-medium">Mon</p>
                </div>
                
                {/* Tuesday */}
                <div className="flex flex-col items-center mx-2" style={{ width: "40px" }}>
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: "180px" }} data-value="36"></div>
                  <div className="w-full bg-red-500 rounded-b mt-0.5" style={{ height: "30px" }} data-value="6"></div>
                  <p className="text-xs mt-2 font-medium">Tue</p>
                </div>
                
                {/* Wednesday */}
                <div className="flex flex-col items-center mx-2" style={{ width: "40px" }}>
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: "300px" }} data-value="60"></div>
                  <div className="w-full bg-red-500 rounded-b mt-0.5" style={{ height: "40px" }} data-value="8"></div>
                  <p className="text-xs mt-2 font-medium">Wed</p>
                </div>
                
                {/* Thursday */}
                <div className="flex flex-col items-center mx-2" style={{ width: "40px" }}>
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: "200px" }} data-value="40"></div>
                  <div className="w-full bg-red-500 rounded-b mt-0.5" style={{ height: "10px" }} data-value="2"></div>
                  <p className="text-xs mt-2 font-medium">Thu</p>
                </div>
                
                {/* Friday */}
                <div className="flex flex-col items-center mx-2" style={{ width: "40px" }}>
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: "260px" }} data-value="52"></div>
                  <div className="w-full bg-red-500 rounded-b mt-0.5" style={{ height: "25px" }} data-value="5"></div>
                  <p className="text-xs mt-2 font-medium">Fri</p>
                </div>
                
                {/* Saturday */}
                <div className="flex flex-col items-center mx-2" style={{ width: "40px" }}>
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: "120px" }} data-value="24"></div>
                  <div className="w-full bg-red-500 rounded-b mt-0.5" style={{ height: "5px" }} data-value="1"></div>
                  <p className="text-xs mt-2 font-medium">Sat</p>
                </div>
                
                {/* Sunday */}
                <div className="flex flex-col items-center mx-2" style={{ width: "40px" }}>
                  <div className="w-full bg-blue-500 rounded-t" style={{ height: "100px" }} data-value="20"></div>
                  <div className="w-full bg-red-500 rounded-b mt-0.5" style={{ height: "5px" }} data-value="1"></div>
                  <p className="text-xs mt-2 font-medium">Sun</p>
                </div>
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