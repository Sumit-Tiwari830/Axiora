import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    CartesianGrid,
} from "recharts";

const CustomTooltipContent = ({ active, payload, dataKey }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
        <div
            style={{
                background: "#ffffff",
                padding: "12px 18px",
                borderRadius: 12,
                border: "1px solid rgba(148, 163, 184, 0.15)",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.12)",
                fontFamily: "Inter, sans-serif",
            }}
        >
            {dataKey === "attendancePercentage" ? (
                <>
                    <p
                        style={{
                            margin: 0,
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#0f172a",
                        }}
                    >
                        {data.subject}
                    </p>
                    <p
                        style={{
                            margin: "6px 0 2px",
                            fontSize: 13,
                            color: "#475569",
                        }}
                    >
                        Attendance:{" "}
                        <span
                            style={{
                                fontWeight: 700,
                                color: "#4f46e5",
                            }}
                        >
                            {data.attendancePercentage}%
                        </span>
                    </p>
                    <p
                        style={{
                            margin: "2px 0 0",
                            fontSize: 13,
                            color: "#475569",
                        }}
                    >
                        Classes:{" "}
                        <span style={{ fontWeight: 600 }}>
                            {data.attendedClasses}/{data.totalClasses}
                        </span>
                    </p>
                </>
            ) : (
                <>
                    <p
                        style={{
                            margin: 0,
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#0f172a",
                        }}
                    >
                        {data.subName?.subName || "Subject"}
                    </p>
                    <p
                        style={{
                            margin: "6px 0 0",
                            fontSize: 13,
                            color: "#475569",
                        }}
                    >
                        Marks:{" "}
                        <span
                            style={{
                                fontWeight: 700,
                                color: "#4f46e5",
                            }}
                        >
                            {data.marksObtained}
                        </span>
                    </p>
                </>
            )}
        </div>
    );
};

const BRAND_COLORS = [
    "#4f46e5",
    "#7c3aed",
    "#06b6d4",
    "#818cf8",
    "#a78bfa",
    "#3b82f6",
    "#8b5cf6",
    "#6366f1",
    "#5b21b6",
    "#3730a3",
];

const generateColors = (count) => {
    const colors = [];

    for (let i = 0; i < count; i++) {
        colors.push(BRAND_COLORS[i % BRAND_COLORS.length]);
    }

    return colors;
};

const CustomBarChart = ({ chartData = [], dataKey }) => {
    const colors = generateColors(chartData.length);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={chartData}
                margin={{
                    top: 20,
                    right: 30,
                    left: 10,
                    bottom: 20,
                }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148, 163, 184, 0.15)"
                    vertical={false}
                />

                <XAxis
                    dataKey={
                        dataKey === "marksObtained"
                            ? (item) => item.subName?.subName
                            : "subject"
                    }
                    tick={{
                        fontSize: 12,
                        fontWeight: 500,
                        fill: "#64748b",
                        fontFamily: "Inter, sans-serif",
                    }}
                    axisLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
                    tickLine={false}
                />

                <YAxis
                    domain={[0, 100]}
                    tick={{
                        fontSize: 12,
                        fontWeight: 500,
                        fill: "#64748b",
                        fontFamily: "Inter, sans-serif",
                    }}
                    axisLine={{ stroke: "rgba(148, 163, 184, 0.2)" }}
                    tickLine={false}
                />

                <Tooltip
                    content={<CustomTooltipContent dataKey={dataKey} />}
                    cursor={{
                        fill: "rgba(79, 70, 229, 0.04)",
                        radius: 8,
                    }}
                />

                <Bar
                    dataKey={dataKey}
                    radius={[8, 8, 0, 0]}
                    animationBegin={0}
                    animationDuration={800}
                    animationEasing="ease-out"
                >
                    {chartData.map((_, index) => (
                        <Cell
                            key={index}
                            fill={colors[index]}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CustomBarChart;