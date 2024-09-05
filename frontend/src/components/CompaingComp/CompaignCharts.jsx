import React, { useState } from "react";
import Chart from "react-apexcharts";

const CompaignCharts = ({color}) => {
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      },
      colors: color
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  });
  return (
    <div>
      {" "}
      <div className="row object-fill" >
        <div className="mixed-chart">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            width=""
          />
        </div>
      </div>
    </div>
  );
};

export default CompaignCharts;
