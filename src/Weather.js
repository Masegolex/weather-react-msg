import React from "react";
import axios from "axios";
import { Puff } from "react-loader-spinner";

export default function Weather(props) {
  function handleResponse(response) {
    alert(
      `The weather in ${response.data.name} is ${response.data.main.temp}°C`
    );
  }
  let apiKey = "2a2eaa51d996796495bf456e5b58adf4";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${props.city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(handleResponse);
  return (
    <Puff
      visible={true}
      height="80"
      width="80"
      color="#00BFFF"
      ariaLabel="puff-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
}
