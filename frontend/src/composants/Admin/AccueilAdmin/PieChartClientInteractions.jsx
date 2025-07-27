import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const dataInteractions = [
  { name: "Favoris", value: 60 },
  { name: "Non Favoris", value: 30 },
  { name: "Signalés", value: 10 }
];

const COLORS = ["#ff6600ff", "#BDBDBD", "#D32F2F"];

// 🎯 Tooltip personnalisé avec couleur dynamique
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    const index = dataInteractions.findIndex(d => d.name === name);
    const color = COLORS[index];
    const total = dataInteractions.reduce((acc, cur) => acc + cur.value, 0);
    const percent = ((value / total) * 100).toFixed(0);

    return (
      <div
        style={{
          background: "#fff",
          padding: "10px 14px",

          borderRadius: "8px",
          boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            color: color,
            fontSize: "15px",
            fontFamily: "sans-serif"
          }}
        >
          {`${name} (${percent}%)`}
        </span>
      </div>
    );
  }

  return null;
};

const PieChartClientInteractions = () => {
  return (
    <div style={{ width: "100%", height: 400 }}> 
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dataInteractions}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            labelLine={false}
            // label={({ name, percent }) =>
            //   `${name} (${(percent * 100).toFixed(0)}%)`
            // }
          >
            {dataInteractions.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartClientInteractions;
