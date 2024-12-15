import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Weather.css";

export default function Weather({ city }) {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const apiKey = "2a2eaa51d996796495bf456e5b58adf4";

  useEffect(() => {
    if (city === "current") {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchWeatherByCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );
      });
    } else {
      fetchWeatherByCity(city);
    }
  }, [city]);

  function fetchWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(url).then(handleWeatherResponse);

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(forecastUrl).then(handleForecastResponse);
  }

  function fetchWeatherByCoordinates(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios.get(url).then(handleWeatherResponse);

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios.get(forecastUrl).then(handleForecastResponse);
  }

  function handleWeatherResponse(response) {
    setWeatherData({
      city: response.data.name,
      temperature: Math.round(response.data.main.temp),
      description: response.data.weather[0].description,
      wind: response.data.wind.speed,
      humidity: response.data.main.humidity,
    });
  }

  function handleForecastResponse(response) {
    const forecastData = response.data.list.filter(
      (_, index) => index % 8 === 0
    );
    setForecast(forecastData);
  }

  if (!weatherData) return <p>Loading...</p>;

  return (
    <div className="Weather">
      <h2>{weatherData.city}</h2>
      <p>
        <strong>{weatherData.temperature}°C</strong> - {weatherData.description}
      </p>
      <p>Wind: {weatherData.wind} km/h</p>
      <p>Humidity: {weatherData.humidity}%</p>

      <div className="Forecast">
        {forecast.map((day, index) => (
          <div key={index} className="Forecast-day">
            <p>
              {new Date(day.dt_txt).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </p>
            <p>{Math.round(day.main.temp)}°C</p>
            <img
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
