import React from 'react';
import { HistogramEntry } from '../types/quantum';
import { Info } from 'lucide-react';

interface MeasurementHistogramProps {
  histogram?: HistogramEntry[];
  shots?: number;
  mode?: string;
}

export const MeasurementHistogram: React.FC<MeasurementHistogramProps> = ({
  histogram = [],
  shots = 1024,
  mode = 'ideal'
}) => {
  const states = histogram.length === 8 ? histogram : [
    { state: "000", count: Math.round(shots * 0.5), frequency: 0.5, ideal_frequency: 0.5 },
    { state: "001", count: 0, frequency: 0.0, ideal_frequency: 0.0 },
    { state: "010", count: 0, frequency: 0.0, ideal_frequency: 0.0 },
    { state: "011", count: 0, frequency: 0.0, ideal_frequency: 0.0 },
    { state: "100", count: 0, frequency: 0.0, ideal_frequency: 0.0 },
    { state: "101", count: 0, frequency: 0.0, ideal_frequency: 0.0 },
    { state: "110", count: 0, frequency: 0.0, ideal_frequency: 0.0 },
    { state: "111", count: Math.round(shots * 0.5), frequency: 0.5, ideal_frequency: 0.5 },
  ];

  const maxFreq = Math.max(0.6, ...states.map(s => s.frequency));

  return (
    <div className="bg-nex-card border border-nex-border rounded-lg p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-nex-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white tracking-wide">Measurement Outcome Distribution</h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              mode === 'ideal' 
                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {mode.toUpperCase()} MODE ({shots.toLocaleString()} SHOTS)
            </span>
          </div>
          <p className="text-xs text-nex-textMuted mt-0.5">
            Empirical Z-basis measurement frequencies over 8 computational states
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-sky-500 border border-sky-400" />
            <span className="text-slate-200">Observed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-800 border border-dashed border-slate-400" />
            <span className="text-slate-400">Ideal Target</span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart Container */}
      <div className="w-full bg-nex-surface p-4 rounded border border-nex-border">
        <div className="h-60 flex items-end justify-between gap-2 pt-6 pb-2 px-2 relative">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none text-[10px] font-mono text-nex-textDim border-b border-nex-border/40">
            <div className="border-b border-nex-border/30 w-full flex justify-end pr-1">{(maxFreq * 100).toFixed(0)}%</div>
            <div className="border-b border-nex-border/30 w-full flex justify-end pr-1">{(maxFreq * 50).toFixed(0)}%</div>
            <div className="border-b border-nex-border/30 w-full flex justify-end pr-1">0%</div>
          </div>

          {states.map((item) => {
            const obsHeightPct = (item.frequency / maxFreq) * 100;
            const idealHeightPct = (item.ideal_frequency / maxFreq) * 100;
            const isTargetState = item.state === "000" || item.state === "111";

            return (
              <div key={item.state} className="flex-1 flex flex-col items-center h-full justify-end z-10 group relative">
                {/* Tooltip */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 px-2.5 py-1 rounded text-[11px] font-mono text-white shadow-lg pointer-events-none whitespace-nowrap z-30">
                  <div className="font-semibold text-sky-400">|{item.state}⟩</div>
                  <div>Count: {item.count}</div>
                  <div>Observed: {(item.frequency * 100).toFixed(2)}%</div>
                  <div>Ideal: {(item.ideal_frequency * 100).toFixed(1)}%</div>
                </div>

                {/* Bars column */}
                <div className="w-full max-w-[36px] flex items-end justify-center relative h-full">
                  {/* Ideal target outline */}
                  {item.ideal_frequency > 0 && (
                    <div 
                      className="absolute bottom-0 w-full border-2 border-dashed border-slate-400/60 bg-slate-400/10 rounded-t z-0"
                      style={{ height: `${Math.max(4, idealHeightPct)}%` }}
                    />
                  )}
                  {/* Observed Bar */}
                  <div 
                    className={`w-full rounded-t transition-all duration-300 z-10 ${
                      isTargetState 
                        ? 'bg-sky-500 border-t border-x border-sky-300' 
                        : 'bg-rose-500/80 border-t border-x border-rose-400'
                    }`}
                    style={{ height: `${Math.max(item.count > 0 ? 3 : 0, obsHeightPct)}%` }}
                  />
                </div>

                {/* State & Freq Labels */}
                <div className="mt-2 text-[11px] font-mono font-medium text-slate-200 text-center">
                  |{item.state}⟩
                </div>
                <div className="text-[10px] font-mono text-nex-textDim">
                  {(item.frequency * 100).toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="mt-3 flex items-start gap-2.5 p-3 rounded bg-nex-surface border border-nex-border text-xs text-nex-textMuted font-sans">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">State Vector Analysis: </span>
          <span>
            In an ideal 3-qubit GHZ state, measurement in the Z-basis yields outcomes <strong className="text-sky-300 font-mono">000</strong> and <strong className="text-sky-300 font-mono">111</strong> with equal probability ($50\%$ each), while all non-entangled basis states have zero theoretical amplitude.
          </span>
        </div>
      </div>
    </div>
  );
};
