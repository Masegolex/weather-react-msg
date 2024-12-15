import React, { useState } from "react";
import Weather from "./Weather";
import "./Weather.css";

function App() {
  const [city, setCity] = useState("");
  const [submittedCity, setSubmittedCity] = useState("Cape Town");

  function handleSearch(event) {
    event.preventDefault();
    setSubmittedCity(city);
  }

  return (
    <div className="App">
      <header className="App-header">
        <Weather city={submittedCity} />
      </header>
    </div>
  );
}

export default App;
