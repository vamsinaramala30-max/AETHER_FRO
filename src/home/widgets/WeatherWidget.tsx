import React from 'react';
import { WeatherData } from './widgetsService';

interface WeatherWidgetProps {
  weather: WeatherData;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 p-4">
      <div>
        <span className="text-[10px] font-bold uppercase text-slate-400">Environment</span>
        <div className="mt-1 text-xl font-bold text-white">{weather.temperature}°F</div>
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
