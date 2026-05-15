import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useAdminStats } from "../../context/admin/AdminStatsContext";

const getWeekNumber = (d) => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

const aggregateRevenue = (orders, period) => {
  const grouped = {};
  orders.forEach((order) => {
    const d = new Date(order.date);
    let key = "";
    if (period === "day") {
      const d = new Date(order.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      key = `${year}-${month}-${day}`;
    } else if (period === "week")
      key = `${d.getFullYear()}-W${getWeekNumber(d)}`;
    else if (period === "month") {
      const month = String(d.getMonth() + 1).padStart(2, "0");
      key = `${d.getFullYear()}-${month}`;
    }
    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += parseFloat(order.total) || 0;
  });
  return Object.entries(grouped).map(([label, revenue]) => ({
    label,
    revenue,
  }));
};

// Aggregate sales by category for pie chart
const aggregateCategorySales = (orders) => {
  const categorySales = {};

  orders.forEach((order) => {
    order.items?.forEach((item) => {
      const type = item.type || "Uncategorized";
      if (!categorySales[type]) categorySales[type] = 0;
      categorySales[type] += parseFloat(item.price) || 0;
    });
  });

  return {
    series: Object.values(categorySales),
    labels: Object.keys(categorySales),
  };
};

const ChartSection = () => {
  const [period, setPeriod] = useState("day");
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState({ series: [], labels: [] });

  const { stats } = useAdminStats() || {};
  const orders = stats?.orders || [];

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    setChartData(aggregateRevenue(orders, period));
    setPieData(aggregateCategorySales(orders));
  }, [orders, period]);

  // line chart
  const series = [
    {
      name: "Revenue",
      data: chartData.map((item) => Number(Number(item.revenue).toFixed(2))),
      color: "#4B5563",
    },
  ];

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: chartData.map((item) => item.label),
      labels: { style: { colors: "#6b7280", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#6b7280", fontSize: "12px" } },
    },
    grid: {
      borderColor: "#e5e7eb",
      row: { colors: ["transparent"], opacity: 0.5 },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val) =>
          `₹${Number(val).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
    },
    markers: {
      size: 5,
      hover: { size: 7 },
    },
    colors: ["#3b82f6"],
  };

  // Pie Chart options
  const pieOptions = {
    chart: { type: "pie", toolbar: { show: false } },
    labels: pieData.labels,
    colors: ["#4B5563", "#6B7280", "#9CA3AF", "#D1D5DB"], // Tailwind gray tones
    legend: {
      position: "bottom",
      labels: { colors: "#374151", useSeriesColors: false },
    },
    dataLabels: {
      style: {
        fontSize: "12px", 
        fontWeight: "500", 
        colors: ["#ffff"], 
        textAnchor: "center",
      },
    },
    tooltip: { y: { formatter: (val) => `₹${val}` } },
  };

  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* LINE GRAPH CARD */}
      <div className="bg-white rounded-2xl shadow-sm p-6 col-span-3">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Revenue Overview
        </h2>

        {/* Period Buttons */}
        <div className="flex gap-3 mb-4">
          {["day", "week", "month"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                period === p
                  ? "bg-gray-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Apex Line Chart */}
        <div className="w-full h-64">
          <Chart options={options} series={series} type="line" height="100%" />
        </div>
      </div>

      {/* PIE CHART CARD */}
      <div className="bg-white rounded-2xl shadow-sm p-6 col-span-2">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Category Based Sales
        </h2>
        <div className="w-full h-80 flex items-center justify-center text-gray-400">
          <Chart
            options={pieOptions}
            series={pieData.series}
            type="pie"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
