
let cityInput = document.getElementById("city_input");
let searchBtn = document.getElementById("searchBtn");
let locationBtn = document.getElementById("locationBtn");
let api_key = "430a91937532f6b8a3050057faa47f19";
currentWeatherCard = document.querySelectorAll(".weather-left .card")[0];
fiveDaysForecastCard = document.querySelector(".day-forecast");
aqiCard = document.querySelectorAll('.highlights .card')[0]
sunriseCard = document.querySelectorAll('.highlights .card')[1]
humidityVal = document.getElementById('humidityVal')
pressureVal = document.getElementById('pressureVal')
visibilityVal = document.getElementById('visibilityVal')
windspeedVal = document.getElementById('windspeedVal')
feelsVal = document.getElementById('feelsVal')
hourlyForecastCard = document.querySelector('.hourly-forecast')
aqiList =["Good","Fair", "Moderate","Poor","Very Poor"]
function getWeatherDetails(name, lat, lon, country, state) {
  let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
  WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
  AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;
  (days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]),
    (months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]),
     
    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data =>{
      console.log(data)
      let {co, no,no2,o3, so2, pm2_5, pm10,nh3} =data.list[0].components
      aqiCard.innerHTML =`
       <div class="card-head">
                        <p>Air Quality Index</p>
                        <p class="air-index aqi-${data.list[0].main.aqi}">
                            ${aqiList[data.list[0].main.aqi -1]}
                        </p>
                    </div>
                    <div class="air-indices">
                        
                        <i class="fi fi-br-wind"></i>
                             <div class="item">
                              <p>PM2.5</p>
                              <h2>${pm2_5}</h2>
                             </div>
                             <div class="item">
                              <p>PM10</p>
                              <h2>${pm10}</h2>
                             </div>
                             <div class="item">
                              <p>SO2</p>
                              <h2>${so2}</h2>
                             </div>
                             <div class="item">
                              <p>CO</p>
                              <h2>${co}</h2>
                             </div>
                             <div class="item">
                              <p>NO</p>
                              <h2>${no}</h2>
                             </div>
                             <div class="item">
                              <p>NO2</p>
                              <h2>${no2}</h2>
                             </div>
                             <div class="item">
                              <p>NH3</p>
                              <h2>${nh3}</h2>
                             </div>
                             <div class="item">
                              <p>O3</p>
                              <h2>${o3}</h2>
                             </div>
                    </div>
      `
    }).catch(()=>{
      alert("failed to Air Pollution");
    })

    fetch(WEATHER_API_URL)
      .then((res) => res.json())
      .then((data) => {
        let date = new Date();
        currentWeatherCard.innerHTML = `
                    <div class="current-weather">
              <div class="details">
                <p>Now</p>
                <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                <p>${data.weather[0].description}</p>
              </div>
              <div class="weather-icon">
                <img
                  src="https://openweathermap.org/img/wn/${
                    data.weather[0].icon
                  }@2x.png"
                  alt=""
                />
              </div>
            </div>
            <hr />
            <div class="card-footer">
              <p><i class="fi fi-rr-calendar"></i>${
                days[date.getDay()]
              }, ${date.getDate()}, ${
          months[date.getMonth()]
        }, ${date.getFullYear()}</p>
              <p><i class="fi fi-rr-marker"></i>${name},${country}</p>
            </div>
          </div>
        `;
        let {sunrise, sunset} = data.sys
        let {timezone, visibility} = data
        let {humidity, pressure, feels_like} = data.main
        let {speed} = data.wind
        sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A')
        sSetTime = moment.utc(sunset, 'X').add(timezone,'seconds').format('hh:mm A')
        sunriseCard.innerHTML =` 
        <div class="card-head">
                <p>Sunrise & Sunset</p>
              </div>
              <div class="sunrise-sunset">
                <div class="item">
                  <div class="icon">
                    <i class="fi fi-br-sunrise"></i>
                  </div>
                  <div>
                    <p>Sunrise</p>
                    <h2>${sRiseTime}</h2>
                  </div>
                </div>
                <div class="item">
                  <div class="icon">
                    <i class="fi fi-br-sunset"></i>
                  </div>
                  <div>
                    <p>SunSet</p>
                    <h2>${sSetTime}</h2>
                  </div>
                </div>
              </div>`
              humidityVal.innerHTML =`${humidity}%`
              pressureVal.innerHTML =`${pressure}hPa`
              visibilityVal.innerHTML =`${visibility / 1000}km`
              windspeedVal.innerHTML =`${speed}m/s`
              feelsVal.innerHTML = `${(feels_like-273.15).toFixed(2)}&deg;C`

      })
      .catch(() => {
        alert("failed to current weather");
      });

  fetch(FORECAST_API_URL)
    .then(res => res.json())
    .then((data) => {
      console.log(data)
      let hourlyForecast = data.list
      hourlyForecastCard.innerHTML =""
      for(i =0; i<=7;i++){
        let hrForecastDate = new Date(hourlyForecast[i].dt_txt)
        let hr = hrForecastDate.getHours();
        let a = 'PM'
        if(hr < 12) a ='AM'
        if(hr==0) hr = 12
        if(hr>12) hr = hr - 12;
        hourlyForecastCard.innerHTML +=`
        <div class="card">
              <p>${hr} ${a}</p>
              <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="" />
              <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
            </div>
        `
      }
      
     
      let uniqueForecastDays = [];
      let fiveDaysForecast = data.list.filter((forecast) => {
        let forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
          // console.log('fiveDaysForecast')
        }
      });
      // console.log(fiveDaysForecast);
      fiveDaysForecastCard.innerHTML = "";
      for (i = 1; i < fiveDaysForecast.length; i++){
        let date = new Date(fiveDaysForecast[i].dt_txt);
        fiveDaysForecastCard.innerHTML += `
          <div class="forecast-item">
                    <div class="icon-wrapper">
                        <img src="https://openweathermap.org/img/wn/${
                          fiveDaysForecast[i].weather[0].icon
                        }.png" alt="">
                        <span>${(
                          fiveDaysForecast[i].main.temp - 273.15
                        ).toFixed(2)}&deg;C</span>
                    </div>
                    <p>${date.getDate()} ${months[date.getMonth()]}</p>
                    <p>${days[date.getDay()]}</p>
                </div>
          `;
          
      }
    })
    .catch(() => alert("failed to fetach the weather forecast"));
}

function getCityCoordinates() {
  let cityName = cityInput.value.trim();
  cityInput.value = "";
  if (!cityName) return;
  let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      let { name, lat, lon, country, state } = data[0];
      getWeatherDetails(name, lat, lon, country, state);
    })
    .catch(() => {
      alert(`Failed to fetch coordinates of ${cityName}`);
    });
}

function getUserCoordinates(){
  navigator.geolocation.getCurrentPosition(position =>{
    let {latitude, longitude} = position.coords;
    // console.log(latitude, longitude)
    let REVERSE_GEOCODING_URL=`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`

    fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data=>{
       let{ name, country,state} = data[0];
       getWeatherDetails(name, latitude, longitude, country, state)
    }).catch(()=>{
      alert("Failed to fetch user coordinates")
    })
  },
  error=>{
    if(error.code === error.PERMISSION_DENIED){
      alert("Geolocation permission denied. Please reset location permission to grant access again")
    }
  }

)
}

searchBtn.addEventListener("click", getCityCoordinates);
locationBtn.addEventListener("click", getUserCoordinates)
cityInput.addEventListener('keyup', e=>e.key ==="Enter"&& getCityCoordinates())
// window.addEventListener("load", getCityCoordinates())
