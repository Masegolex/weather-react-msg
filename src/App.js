import React, { useState } from "react";
import Weather from "./Weather";
import "./Weather.css";

function App() {
  const [city, setCity] = useState("");
  const [submittedCity, setSubmittedCity] = useState("Lisbon");

  function handleSearch(event) {
    event.preventDefault();
    setSubmittedCity(city);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter a city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit">Search</button>
          <button type="button" onClick={() => setSubmittedCity("current")}>
            Current
          </button>
        </form>
        <Weather city={submittedCity} />
      </header>
    </div>
  );
}

export default App;
