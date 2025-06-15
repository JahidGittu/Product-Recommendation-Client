import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { FaThumbsUp } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { LuSquareActivity } from "react-icons/lu";

const StatsSection = () => {
  const [stats, setStats] = useState({
    totalQueries: 0,
    totalRecommendations: 0,
    uniqueUsers: 0,
    averageRecommendations: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="py-16 bg-base-200">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-10 text-primary">📊 Real-Time Platform Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

          <div className="stat bg-white shadow-md rounded-lg p-6">
            <HiOutlineQuestionMarkCircle className="text-4xl text-primary mb-2 mx-auto" />
            <div className="stat-title text-gray-500">Total Queries</div>
            <div className="stat-value text-primary">{stats.totalQueries}</div>
          </div>

          <div className="stat bg-white shadow-md rounded-lg p-6">


            <FaThumbsUp className="text-4xl text-secondary mb-2 mx-auto" />

            <div className="stat-title text-gray-500">Total Recommendations</div>
            <div className="stat-value text-secondary">{stats.totalRecommendations}</div>
          </div>

          <div className="stat bg-white shadow-md rounded-lg p-6">




            <FaUsers className="text-4xl text-accent mb-2 mx-auto" />


            <div className="stat-title text-gray-500">Unique Users</div>
            <div className="stat-value text-accent">{stats.uniqueUsers}</div>
          </div>

          <div className="stat bg-white shadow-md rounded-lg p-6">


            <LuSquareActivity className="text-4xl text-success mb-2 mx-auto" />

            <div className="stat-title text-gray-500">Avg. Recommendations/Query</div>
            <div className="stat-value text-success">{stats.averageRecommendations}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
