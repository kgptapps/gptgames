import React from "react";
import "../styles/components/metrics.css";

/**
 * Performance Metrics component
 * Displays game performance metrics like match rate and efficiency
 */
function PerformanceMetrics({ metrics }) {
  const { matchRate, efficiency } = metrics;

  // Determine efficiency level class for styling
  const getEfficiencyClass = () => {
    if (efficiency >= 75) return "excellent";
    if (efficiency >= 50) return "good";
    if (efficiency >= 25) return "fair";
    return "poor";
  };

  return (
    <div className="performance-metrics">
      <div className="metric">
        <span className="metric-label">Match Rate:</span>
        <span className="metric-value">{(matchRate * 100).toFixed(0)}%</span>
      </div>

      <div className="metric">
        <span className="metric-label">Efficiency:</span>
        <div className={`efficiency-bar ${getEfficiencyClass()}`}>
          <div
            className="efficiency-fill"
            style={{ width: `${Math.min(100, efficiency)}%` }}
          ></div>
          <span className="efficiency-text">{efficiency}%</span>
        </div>
      </div>
    </div>
  );
}

export default PerformanceMetrics;
