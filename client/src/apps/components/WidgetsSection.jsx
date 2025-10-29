// components/appmaterial/WidgetsSection.jsx
import React from 'react';
import PeopleIcon from '@mui/icons-material/People';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import './WidgetsSection.css';

export default function WidgetsSection() {
  const widgets = [
    { title: 'Users', value: 1200, icon: <PeopleIcon fontSize="large" /> },
    { title: 'Sessions', value: 3000, icon: <ShowChartIcon fontSize="large" /> },
    { title: 'Sales', value: 950, icon: <AttachMoneyIcon fontSize="large" /> },
    { title: 'Revenue', value: '$20K', icon: <QueryStatsIcon fontSize="large" /> },
  ];

  return (
    <div className="app-mat-widgets-section">
      <h2 className="app-mat-widgets-title">Analytics Widgets</h2>
      <div className="app-mat-widgets-grid">
        {widgets.map((w, i) => (
          <div className="app-mat-widget-card" key={i}>
            <div className="app-mat-widget-icon">{w.icon}</div>
            <div className="app-mat-widget-info">
              <div className="app-mat-widget-title">{w.title}</div>
              <div className="app-mat-widget-value">{w.value}</div>
            </div>
          </div>
        ))}
        <div className="app-mat-widget-chart">
          <img
            src="https://via.placeholder.com/1200x300.png?text=Analytics+chart"
            alt="chart"
            className="app-mat-widget-chart-img"
          />
        </div>
      </div>
    </div>
  );
}
