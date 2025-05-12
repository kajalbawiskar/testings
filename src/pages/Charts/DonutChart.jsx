import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ startDate, endDate }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://api.confidanto.com/search-term-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer_id: 4643036315, start_date: startDate, end_date: endDate }),
        });
        const data = await response.json();

        if (!data.length) {
          setChartData(null);
          return;
        }

        const segmentedData = data.map((item) => ({
          segment: categorizeSearchTerm(item.search_term),
        }));

        const segmentCounts = segmentedData.reduce((acc, curr) => {
          acc[curr.segment] = (acc[curr.segment] || 0) + 1;
          return acc;
        }, {});

        const total = Object.values(segmentCounts).reduce((sum, count) => sum + count, 0);

        const chartData = {
          labels: Object.keys(segmentCounts),
          datasets: [
            {
              label: '# of Search Terms',
              data: Object.values(segmentCounts),
              backgroundColor: ['#36A2EB', '#4BC0C0', '#FFCE56', '#FF6384', '#36A2EB'],
              hoverOffset: 4,
            },
          ],
        };

        setChartData({ chartData, total });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const categorizeSearchTerm = (searchTerm) => {
    const categories = {
      informational: ['info', 'guide', 'what', 'how'],
      navigational: ['site', 'login', 'home'],
      transactional: ['buy', 'purchase', 'order'],
      commercial: ['deal', 'price', 'discount'],
      local: ['near', 'local', 'nearby'],
    };

    for (const [key, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => searchTerm.toLowerCase().includes(keyword))) {
        return key;
      }
    }
    return 'other';
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { boxWidth: 10 } },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const count = tooltipItem.raw;
            const percentage = ((count / chartData.total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${count} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Card sx={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
      <CardContent>
        <Typography variant="h6" component="div" align="center" gutterBottom>
          Search Term
        </Typography>
        <div className="flex justify-center items-center w-full h-full">
          <div className="w-full h-[444px]">
            {chartData ? (
              <Doughnut data={chartData.chartData} options={options} />
            ) : (
              <div>No Data Available</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

DonutChart.propTypes = {
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
};

export default DonutChart;
