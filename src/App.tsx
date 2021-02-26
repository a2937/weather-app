/// <reference path="../typings/WeatherState.d.ts" />
/// <reference path="../typings/Position.d.ts" />
import React from 'react';
import './App.css';

class App extends React.Component<WeatherProps,WeatherState>
{

  constructor(props :any)
  {
    super(props); 
    this.state =
    {
      tempMode: "C",
      currentTemp: -1
    };
    this.getWeatherData = this.getWeatherData.bind(this);
    this.switchTemperatureMode = this.switchTemperatureMode.bind(this);
  }

  showErrors(error : GeolocationPositionError)
  {
    if (error.TIMEOUT) {
      document.getElementById("loading")!.innerText = "Connection timed out";
    }
    else if (error.PERMISSION_DENIED)
    {
       document.getElementById("loading")!.innerText = "We need access to your location to determine the weather";
    }
    else if (error.POSITION_UNAVAILABLE)
    {
      document.getElementById("loading")!.innerText = "There was an issue determining your location";
    }
  }



  
  async componentDidMount()
  {
    
    if (navigator.geolocation) {
      const OPTIONS = { timeout : 5000 };
     navigator.geolocation.getCurrentPosition(this.getWeatherData,this.showErrors,OPTIONS)
    }
    else {
      document.getElementById("loading")!.innerText = "This browser does not support the navigator api";
    }
  }

  async getWeatherData(position : Position) 
  {
    var latitude = position.coords.latitude; 
    var longitude = position.coords.longitude; 
    var url = "https://weather-proxy.freecodecamp.rocks/api/current?lon=" + longitude + "&"
      + "lat=" + latitude;
     await fetch(url)
      .then(x => x.json())
      .then(x => 
      {
        this.setState({
          tempMode: "C",
          currentTemp:x.main.temp
        })
        document.getElementById("weather")!.innerText = x.weather[0].main;
        document.getElementById("weather_description")!.innerText = x.weather[0].description;
        document.getElementById("temperature")!.innerText = x.main.temp + "° Celsius"; 
        document.getElementById("loading")!.innerText = "";
        var weather_icon = document.getElementById("weather_icon") as HTMLImageElement;
        weather_icon.src = x.weather[0].icon; 
        weather_icon.alt = x.weather[0].main; 
      })
      .catch(x => document.getElementById("loading")!.innerText = "Loading failed."); 
  }

  switchTemperatureMode()
  {
    var currentMode = this.state.tempMode; 
    var currentTemperature = this.state.currentTemp; 
    if (currentMode === "F")
    {
      currentTemperature = (((currentTemperature - 32) * 5 )/ 9);
      document.getElementById("temperature")!.innerText = currentTemperature + "° Celsius";
      this.setState(
        {
          currentTemp: currentTemperature,
          tempMode: "C"
        }
      );
    }
    else if (currentMode === "C")
    {
      currentTemperature = currentTemperature * (9 / 5) + 32;
      document.getElementById("temperature")!.innerText = currentTemperature + "° Fahrenheit";
      this.setState(
        {
          currentTemp: currentTemperature,
          tempMode: "F"
        }
      );
    }
  }

  render()
  {
     return (
    <div className="App">
         <h1>Weather App</h1>   
         <h2>Current Weather Forecast</h2>
         <p id="loading">Loading..</p>
         <p id="weather"></p>
         <p id="weather_description"></p>
         <img id="weather_icon" alt=""/>
         <p id="temperature"></p>
         <button id="switch_mode" type="button" onClick={this.switchTemperatureMode} >Switch Degree Mode</button>
    </div>
  );
  }
}

export default App;
