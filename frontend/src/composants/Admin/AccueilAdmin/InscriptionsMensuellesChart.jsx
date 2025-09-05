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



const InscriptionsMensuellesChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 400, margin: "0 auto" }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7e57c2" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#7e57c2" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPrestataires" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ff9800" stopOpacity={0} />
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
            stackId="1"
            stroke="#7e57c2"
            fill="url(#colorClients)"
            name="Clients"
          />
          <Area
            type="monotone"
            dataKey="prestataires"
            stackId="1"
            stroke="#ff9800"
            fill="url(#colorPrestataires)"
            name="Prestataires"
          />
          <Area
            type="monotone"
            dataKey="entreprises"
            stroke="#6b0357ff"
            fill="url(#colorPrestataires)"
            name="entreprises"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InscriptionsMensuellesChart;
