import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Weather.css";

export default function Weather({ city = "Cape Town" }) {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [searchCity, setSearchCity] = useState(city);
  const [error, setError] = useState(null); // To handle errors
  const apiKey = "bd3bb6534458ba51b48c49f5155745b6";

  const fetchWeatherByCity = useCallback((city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios
      .get(url)
      .then(handleWeatherResponse)
      .catch((err) => setError("City not found"));

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    axios
      .get(forecastUrl)
      .then(handleForecastResponse)
      .catch((err) => setError("Error fetching forecast"));
  }, []);

  const fetchWeatherByCoordinates = useCallback((lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios
      .get(url)
      .then(handleWeatherResponse)
      .catch((err) => setError("Error fetching weather data"));

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios
      .get(forecastUrl)
      .then(handleForecastResponse)
      .catch((err) => setError("Error fetching forecast"));
  }, []);

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

  useEffect(() => {
    if (searchCity === "current") {
      navigator.geolocation.getCurrentPosition((position) => {
        fetchWeatherByCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );
      });
    } else {
      fetchWeatherByCity(searchCity);
    }
  }, [searchCity, fetchWeatherByCity, fetchWeatherByCoordinates]);

  function handleSearchChange(event) {
    setSearchCity(event.target.value);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    fetchWeatherByCity(searchCity.trim());
  }

  if (error) return <p>{error}</p>;
  if (!weatherData) return <p>Loading...</p>;

  return (
    <div className="WeatherApp">
      <div className="Weather-container">
        <h1>Weather App</h1>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchCity}
            onChange={handleSearchChange}
            placeholder="Enter city"
          />
          <button type="submit">Search</button>
        </form>

        <h2>{weatherData.city}</h2>
        <p>
          <strong>{weatherData.temperature}°C</strong> -{" "}
          {weatherData.description}
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
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
              />
            </div>
          ))}
        </div>
      </div>

      <footer className="App-footer">
        <p>
          This project was coded by <strong>Masego Ntuane</strong> and is
          open-sourced on{" "}
          <a
            href="https://github.com/Masegolex/weather-react-msg"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          and hosted on
          <a
            href="https://app.netlify.com/sites/moonlit-wisp-4ac155/overview"
            target="_blank"
            rel="noopener noreferrer"
          >
            Netlify
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
