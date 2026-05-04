import React, { useEffect, useRef } from "react";
import {
  createChart,
  LineSeries,
  AreaSeries,
  type LineData,
  type IChartApi
} from "lightweight-charts";

type EquityPoint = {
  label: string;
  value: number;
};

export default function EquityChart({ data }: { data: EquityPoint[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const chart = createChart(ref.current, {
      width: ref.current.clientWidth,
      height: 260,
      layout: {
        background: { color: "#000" },
        textColor: "#aaa",
      },
      grid: {
        vertLines: { color: "#111" },
        horzLines: { color: "#111" },
      },
    });

    chartRef.current = chart;

    // ✅ NEW API
    const series = chart.addSeries(AreaSeries, {
      topColor: "rgba(240,185,11,0.25)",
      bottomColor: "rgba(240,185,11,0.02)",
      lineColor: "#f0b90b",
      lineWidth: 2,
    });

    const formatted: LineData[] = data.map((d, i) => ({
      time: i as any,
      value: d.value,
    }));

    series.setData(formatted);

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (ref.current) {
        chart.applyOptions({
          width: ref.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return (
    <div
      style={{
        background: "#070707",
        border: "1px solid #171717",
        borderRadius: 14,
        padding: 10,
      }}
    >
      <div ref={ref} style={{ width: "100%", height: 260 }} />
    </div>
  );
}