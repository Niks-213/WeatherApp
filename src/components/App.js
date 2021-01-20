import React from 'react';
import styled from 'styled-components';
import SearchCity from './SearchCity';
import device from '../responsive/Device';
import Result from './Result';
import NotFound from './NotFound';
import axios from "axios";
import BigLabel from './BigLabel';
import SmallLabel from './SmallLabel';
import MediumLabel from './MediumLabel';
import Text from './Text';
import ForecastHour from './ForecastHour';


const AppTitle = styled.h1 `
  display: block;
  height: 64px;
  margin: 0;
  padding: 20px 0;
  font-size: 20px;
  text-transform: uppercase;
  font-weight: 400;
  color: #ffffff;
  transition: 0.3s 1.4s;
  opacity: ${({ showLabel }) => (showLabel ? 1 : 0)};

  ${({ secondary }) =>
    secondary &&
    `
opacity: 1;
height: auto;
position: relative;
padding: 20 px 0;
font - size: 30 px;
top: 20 % ;
text - align: center;
transition: .5 s;
@media $ { device.tablet } {
    font - size: 40 px;
}
@media $ { device.laptop } {
    font - size: 50 px;
}
@media $ { device.laptopL } {
    font - size: 60 px;
}
@media $ { device.desktop } {
    font - size: 70 px;
}

`}

  ${({ showResult }) =>
    showResult &&
    `
opacity: 0;
visibility: hidden;
top: 10 % ;
`}
`;

const WeatherWrapper = styled.div `
  max-width: 1500px;
  margin: 0 auto;
  
  height: calc(100vh - 64px);
  width: 100%;
  position: relative;
`;

const LocationWrapper = styled.div`
  flex-basis: 100%;
`;
const WeatherDetailsWrapper = styled.div`
  flex-basis: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
  margin: 20px 0;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  align-self: flex-start;
  @media ${device.mobileL} {
    flex-basis: 50%;
  }
`;

const WeatherDetail = styled.div`
  flex-basis: calc(100% / 3);
  padding: 10px;
  @media ${device.laptop} {
    padding: 20px 10px;
  }
`;

const ForecastWrapper = styled.div`
  flex-basis: 100%;
  margin: 20px 0;
  overflow: hidden;
`;

const Forecast = styled.div`
  position: relative;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  scrollbar-color: lightgray #ffffff;
  scrollbar-width: thin;
  margin-top: 20px;
  padding-bottom: 20px;
  @media ${device.laptop} {
    order: 4;
  }
`;




class App extends React.Component {



    componentDidMount() {
        if (navigator.geolocation) {
          this.getPosition()
            .then((position) => {
              this.getWeather(position.coords.latitude, position.coords.longitude);
            })
            .catch((err) => {
              this.getWeather(28.67, 77.22);
              alert(
                "You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather."
              );
            });
        } else {
          alert("Geolocation not available");
        }
    
        this.timerID = setInterval(
          () => this.getWeather(this.state.lat, this.state.lon),
          600000
        );
      }

      getPosition = (options) => {
        return new Promise(function (resolve, reject) {
          navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
      };

      getWeather = async (lat, lon) => {
        const APIkey = "80b36a9aa43187199bdbe2730ecbc3c7";
  
        const api_call = await fetch(

          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${APIkey}`
        );
        const data = await api_call.json();
        //  console.log(data);

        
        // axios
        // .get(  
        //   `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&APPID=${APIkey}`
        // )
        // .then((response) => {
        //   console.log(response.data);
        // })
        // .catch(function (error) {
        //   console.log(error); 
        // });
       
        this.setState({
          lat: lat,
          lon: lon,
          city: data.name,
          date: data.dt,
          temperatureC: Math.round(data.main.temp),
          temperatureF: Math.round(data.main.temp * 1.8 + 32),
          humidity: data.main.humidity,
          main: data.weather[0].main,
          country: data.sys.country,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          temp_max: data.main.temp_max,
          temp_min: data.main.temp_min,
          sea_level: data.main.sea_level,
          wind:data.wind.speed,
        //   sunrise:data.
        });
      
        
      };
    state = {
        value: '',
        weatherInfo: null,
        error: false,
    };
    

    handleInputChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    handleSearchCity = e => {
        e.preventDefault();
        const { value } = this.state;
        
        const APIkey = "80b36a9aa43187199bdbe2730ecbc3c7";

        const weather = `https://api.openweathermap.org/data/2.5/weather?q=${value}&APPID=${APIkey}&units=metric`;
        const forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${value}&APPID=${APIkey}&units=metric`;
       

        Promise.all([fetch(weather), fetch(forecast)])
            .then(([res1, res2]) => {
                if (res1.ok && res2.ok ) {
                    return Promise.all([res1.json(), res2.json()]);
                    
                }
                throw Error(res1.statusText, res2.statusText);
            })
            .then(([data1, data2]) => {
                const months = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'Nocvember',
                    'December',
                ];
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const currentDate = new Date();
                console.log(data1,data2);
                const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${
          months[currentDate.getMonth()]
        }`;
                const sunset = new Date(data1.sys.sunset * 1000).toLocaleTimeString().slice(0, 5);
                const sunrise = new Date(data1.sys.sunrise * 1000).toLocaleTimeString().slice(0, 5);

                const weatherInfo = {
                    city: data1.name,
                    country: data1.sys.country,
                    date,
                    description: data1.weather[0].description,
                    main: data1.weather[0].main,
                    temp: data1.main.temp,
                    highestTemp: data1.main.temp_max,
                    lowestTemp: data1.main.temp_min,
                    sunrise,
                    sunset,
                    clouds: data1.clouds.all,
                    humidity: data1.main.humidity,
                    wind: data1.wind.speed,
                    forecast: data2.list,
                    
                };
                this.setState({
                    weatherInfo,
                    error: false,
                });
            })
            .catch(error => {
                console.log(error);

                this.setState({
                    error: true,
                    weatherInfo: null,
                });
            });
    };

    render() {
        const { value, weatherInfo, error } = this.state;
        return ( 
            <>
            <AppTitle showLabel = {
                (weatherInfo || error) && true
            } >
                 Weather app 
                 </AppTitle>
                  <WeatherWrapper >
            <AppTitle secondary showResult = {
                (weatherInfo || error) && true
            } >
            Weather app 
            </AppTitle>
            
            <LocationWrapper>
        <BigLabel>
          {this.state.city}, {this.state.country}
        </BigLabel>
      </LocationWrapper>
     
      <WeatherDetailsWrapper>
        <WeatherDetail>
          <SmallLabel align="center" weight="400">
            {this.state.temperatureC}&#176;
          </SmallLabel>
          <Text align="center">Temperature</Text>
        </WeatherDetail>
        <WeatherDetail>
          <SmallLabel align="center" weight="400">
            {this.state.temp_max}&#176;
          </SmallLabel>
          <Text align="center">High</Text>
        </WeatherDetail>
        <WeatherDetail>
          <SmallLabel align="center" weight="400">
            {this.state.temp_min}&#176;
          </SmallLabel>
          <Text align="center">Low</Text>
        </WeatherDetail>
        <WeatherDetail>
          <SmallLabel align="center" weight="400">
            {this.state.wind}
          </SmallLabel>
          <Text align="center">Wind</Text>
        </WeatherDetail>
        <WeatherDetail>
          <SmallLabel align="center" weight="400">
            {this.state.humidity}%
          </SmallLabel>
          <Text align="center">Humidity</Text>
        </WeatherDetail>
        <WeatherDetail>
          <SmallLabel align="center" weight="400">
            {this.state.sea_level}
          </SmallLabel>
          <Text align="center">Sea Level</Text>
        </WeatherDetail>
      </WeatherDetailsWrapper>
      
      
             <SearchCity value = { value }
            showResult = {
                (weatherInfo || error) && true
            }
            change = { this.handleInputChange }
            submit = { this.handleSearchCity }
            /> {
            weatherInfo && < Result weather = { weatherInfo }
            />} {
            error && < NotFound error = { error }
            />} </WeatherWrapper > 
        </>
        );
    }
}

export default App;