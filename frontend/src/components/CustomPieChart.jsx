import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = ["#4f46e5", "#f87171"];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="#ffffff"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize={13}
            fontWeight="700"
            fontFamily="Inter, sans-serif"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const CustomTooltipContent = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div
            style={{
                background: "#ffffff",
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid rgba(148, 163, 184, 0.15)",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
                fontFamily: "Inter, sans-serif",
            }}
        >
            <p
                style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0f172a",
                }}
            >
                {payload[0].name}
            </p>
            <p
                style={{
                    margin: "4px 0 0",
                    fontSize: 13,
                    color: "#64748b",
                }}
            >
                Count:{" "}
                <span
                    style={{
                        fontWeight: 700,
                        color: payload[0].payload.fill || "#4f46e5",
                    }}
                >
                    {payload[0].value}
                </span>
            </p>
        </div>
    );
};

const renderLegend = (props) => {
    const { payload } = props;

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                gap: 24,
                paddingTop: 8,
            }}
        >
            {payload.map((entry, index) => (
                <div
                    key={`legend-${index}`}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <div
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: entry.color,
                        }}
                    />
                    <span
                        style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#475569",
                            fontFamily: "Inter, sans-serif",
                        }}
                    >
                        {entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

const CustomPieChart = ({ data = [] }) => {
    if (!data.length) {
        return (
            <div
                style={{
                    height: 350,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    fontFamily: "Inter, sans-serif",
                }}
            >
                No Data Available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Tooltip content={<CustomTooltipContent />} />

                <Legend content={renderLegend} />

                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={115}
                    innerRadius={0}
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={false}
                    animationBegin={0}
                    animationDuration={800}
                    animationEasing="ease-out"
                    strokeWidth={2}
                    stroke="#ffffff"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CustomPieChart;