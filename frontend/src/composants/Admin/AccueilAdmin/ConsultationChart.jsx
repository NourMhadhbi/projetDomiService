import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const data = [
  { month: "Jan", clients: 200, prestataires: 120 },
  { month: "Feb", clients: 240, prestataires: 150 },
  { month: "Mar", clients: 280, prestataires: 160 },
  { month: "Apr", clients: 260, prestataires: 180 },
  { month: "May", clients: 300, prestataires: 210 },
  { month: "Jun", clients: 350, prestataires: 230 },
  { month: "Jul", clients: 370, prestataires: 250 },
  { month: "Aug", clients: 400, prestataires: 280 },
];

const ConsultationsMensuellesChart = () => {
  return (
    <div style={{ width: "100%", height: 400, margin: "0 auto" }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0288d1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0288d1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPrestataires" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff7043" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ff7043" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />

          <Area
            type="monotone"
            dataKey="clients"
            stroke="#0288d1"
            fill="url(#colorClients)"
            name="Clients"
          />
          <Area
            type="monotone"
            dataKey="prestataires"
            stroke="#ff7043"
            fill="url(#colorPrestataires)"
            name="Prestataires"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConsultationsMensuellesChart;
