import React from 'react';
import { WeatherData } from './widgetsService';

interface WeatherWidgetProps {
  weather: WeatherData;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  return (
    <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between">
      <div>
        <span className="text-[10px] uppercase font-bold text-slate-400">Environment</span>
        <div className="text-xl font-bold text-white mt-1">{weather.temperature}°F</div>
        <p className="text-xs text-slate-300">{weather.condition}</p>
      </div>
      <div className="text-right text-xs text-slate-400">
        <div>{weather.location}</div>
        <div className="mt-1">
          H: {weather.high}° L: {weather.low}°
        </div>
      </div>
    </div>
  );
};