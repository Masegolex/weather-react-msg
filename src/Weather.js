import React, { useState } from "react";
import axios from "axios";

export default function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  function handleSubmit(event) {
    event.preventDefault();
    fetchWeather(city);
  }

  function fetchWeather(city) {
    const apiKey = "bd3bb6534458ba51b48c49f5155745b6";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    axios
      .all([axios.get(weatherUrl), axios.get(forecastUrl)])
      .then(
        axios.spread((weatherResponse, forecastResponse) => {
          setWeatherData(weatherResponse.data);
          setForecastData(forecastResponse.data.list.slice(0, 5));
        })
      )
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }

  function handleCityChange(event) {
    setCity(event.target.value);
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days[date.getDay()];
  }

  return (
    <div className="weather-app">
      <header>
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="search"
            placeholder="Enter a city.."
            required
            value={city}
            onChange={handleCityChange}
            className="search-form-input"
          />
          <input type="submit" value="Search" className="search-form-button" />
        </form>
      </header>
      <main>
        {weatherData && (
          <div className="weather-app-data">
            <div>
              <h1 className="weather-app-city">{weatherData.name}</h1>
              <p className="weather-app-details">
                <span>{formatDate(weatherData.dt)}</span>
                <span>{weatherData.weather[0].description}</span>
                <br />
                Humidity: <strong>{weatherData.main.humidity}%</strong>, Wind:{" "}
                <strong>{weatherData.wind.speed} km/h</strong>
              </p>
            </div>
            <div className="weather-app-temperature-container">
              <div>
                <img
                  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt={weatherData.weather[0].description}
                  className="weather-app-icon"
                />
              </div>
              <div className="weather-app-temperature">
                {Math.round(weatherData.main.temp)}°C
              </div>
            </div>
          </div>
        )}
        <div className="weather-forecast">
          {forecastData.map((forecast, index) => (
            <div key={index} className="weather-forecast-day">
              <div className="weather-forecast-date">
                {formatDate(forecast.dt)} {/* Use formatDate here */}
              </div>
              <img
                src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                alt={forecast.weather[0].description}
                className="weather-forecast-icon"
              />
              <div className="weather-forecast-temperatures">
                <div className="weather-forecast-temperature">
                  <strong>{Math.round(forecast.main.temp_max)}°C</strong>
                </div>
                <div className="weather-forecast-temperature">
                  {Math.round(forecast.main.temp_min)}°C
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer>
        This project was coded by{" "}
        <a
          href="https://github.com/Masegolex"
          target="_blank"
          rel="noopener noreferrer"
        >
          Masego Ntuane
        </a>
        , code hosted on{" "}
        <a
          href="https://github.com/Masegolex/weather-react-msg"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        , and website hosted on Netlify{" "}
        <a
          href="https://moonlit-wisp-4ac155.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          on Netlify
        </a>
      </footer>
    </div>
  );
}
