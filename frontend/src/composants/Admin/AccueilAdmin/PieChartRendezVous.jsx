import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const dataRdv = [
    { name: "En attente", value: 15 },
    { name: "Confirmé", value: 25 },
    { name: "Terminé", value: 40 },
    { name: "Annulé", value: 20 }
];


const COLORS = ["#ff6600ff", "#BDBDBD", "#D32F2F","#4285F4"];
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { name, value, dataKey } = payload[0];
        const index = dataRdv.findIndex(d => d.name === name);
        const color = COLORS[index];
        const total = dataRdv.reduce((acc, cur) => acc + cur.value, 0);
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

const PieChartRendezVous = () => {
    return (
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={dataRdv}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        dataKey="value"
                    // label={({ name, percent }) =>
                    //   `${name} (${(percent * 100).toFixed(0)}%)`
                    // }
                    >
                        {dataRdv.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
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
