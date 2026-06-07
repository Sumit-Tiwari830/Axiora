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
import styled from "styled-components";

const TooltipBox = styled.div`
  background: #ffffff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
`;

const TooltipTitle = styled.h4`
  margin: 0 0 6px;
  color: #111827;
`;

const TooltipText = styled.p`
  margin: 2px 0;
  color: #374151;
  font-size: 14px;
`;

const CustomTooltip = ({ active, payload, dataKey }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
        <TooltipBox>
            {dataKey === "attendancePercentage" ? (
                <>
                    <TooltipTitle>{data.subject}</TooltipTitle>
                    <TooltipText>
                        Attendance: {data.attendancePercentage}%
                    </TooltipText>
                    <TooltipText>
                        Classes: {data.attendedClasses}/{data.totalClasses}
                    </TooltipText>
                </>
            ) : (
                <>
                    <TooltipTitle>
                        {data.subName?.subName || "Subject"}
                    </TooltipTitle>
                    <TooltipText>
                        Marks: {data.marksObtained}
                    </TooltipText>
                </>
            )}
        </TooltipBox>
    );
};

const generateColors = (count) => {
    const colors = [];

    for (let i = 0; i < count; i++) {
        const hue = (i * 137.508) % 360;
        colors.push(`hsl(${hue},70%,55%)`);
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
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                    dataKey={
                        dataKey === "marksObtained"
                            ? (item) => item.subName?.subName
                            : "subject"
                    }
                />

                <YAxis
                    domain={[0, 100]}
                />

                <Tooltip
                    content={<CustomTooltip dataKey={dataKey} />}
                />

                <Bar
                    dataKey={dataKey}
                    radius={[8, 8, 0, 0]}
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