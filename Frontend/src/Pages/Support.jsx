import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function WeatherForecast() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState({});
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser) {
        navigate("/");
        return;
      }
      try {
        const res = await fetch(`/api/user/getuser/${currentUser._id}`);
        const data = await res.json();
        if (res.ok) setUsers(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (users.town) {
      const fetchWeather = async () => {
        try {
          const response = await fetch(
            `/api/user/weather/forecast?location=${users.town}&days=5`
          );
          const data = await response.json();
          if (response.ok) setWeather(data);
          else setError(data.error);
        } catch (error) {
          setError("Failed to fetch weather data.");
        }
      };
      fetchWeather();
    }
  }, [users.town]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center text-white">
      {/* Background Video */}
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-[-1]">
        <source src="https://cdn.pixabay.com/video/2024/05/29/214409_tiny.mp4" type="video/mp4" />
      </video>
      
      {/* Weather Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg w-[90%] max-w-md text-center"
      >
        {weather ? (
          <div>
            <h2 className="text-3xl font-bold">{weather.location.name}</h2>
            <p className="text-xl mt-2">{weather.current.condition.text}</p>
            <img
              src={weather.current.condition.icon}
              alt="Weather Icon"
              className="w-20 mx-auto my-2"
            />
            <p className="text-4xl font-bold">{weather.current.temp_c}°C</p>
            <p className="text-sm mt-1">Humidity: {weather.current.humidity}% | Wind: {weather.current.wind_kph} km/h</p>
          </div>
        ) : (
          <p className="text-lg">Loading weather data...</p>
        )}
      </motion.div>

      {/* 5-Day Forecast */}
      {weather && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {weather.forecast.forecastday.map((day) => (
            <div key={day.date} className="bg-white bg-opacity-20 backdrop-blur-md p-4 rounded-lg text-center">
              <p className="font-semibold">{new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}</p>
              <img src={day.day.condition.icon} alt="Weather Icon" className="w-12 mx-auto my-1" />
              <p className="text-lg font-bold">{day.day.avgtemp_c}°C</p>
              <p className="text-4xl font-bold">{weather.current.temp_c}°C</p>
            <p className="text-sm mt-1">Humidity: {weather.current.humidity}% | Wind: {weather.current.wind_kph} km/h</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}