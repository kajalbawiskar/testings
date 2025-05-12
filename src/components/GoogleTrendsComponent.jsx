import React, { useState, useEffect } from 'react';
import { getJson } from 'serpapi';

const GoogleTrendsComponent = () => {
  const [trendsData, setTrendsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getJson({
          engine: 'google_trends',
          q: 'coffee,milk,bread,pasta,steak',
          data_type: 'TIMESERIES',
          api_key: '49879e4bb856f6940c6286be80bbc4457d1614e0cb8433e155af8fee2acb2',
        });

        setTrendsData(response['interest_over_time']);
      } catch (error) {
        console.error('Error fetching Google Trends data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Google Trends Data</h1>
      <ul>
        {trendsData.map((dataPoint, index) => (
          <li key={index}>
            {dataPoint.time}: {dataPoint.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleTrendsComponent;