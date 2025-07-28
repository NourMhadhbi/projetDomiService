import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    ResponsiveContainer
} from "recharts";

// Couleurs pour chaque catégorie de rendez-vous
const COLORS = ["#ff6600ff", "#BDBDBD", "#D32F2F", "#4285F4"];

// Tooltip personnalisé avec pourcentage
const CustomTooltip = ({ active, payload, data }) => {
    if (active && payload && payload.length && data) {
        const { name, value } = payload[0];
        const index = data.findIndex(d => d.name === name);
        const color = COLORS[index % COLORS.length];
        const total = data.reduce((acc, cur) => acc + cur.value, 0);
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
                        color,
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

// Composant principal
const PieChartRendezVous = ({ data }) => {
    const safeData = Array.isArray(data) ? data : [];

    if (safeData.length === 0) {
        return (
            <p style={{ textAlign: "center", color: "#999" }}>
                Aucune donnée disponible
            </p>
        );
    }

    return (
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={safeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        dataKey="value"
                    >
                        {safeData.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip data={safeData} />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{ color: "black" }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartRendezVous;
