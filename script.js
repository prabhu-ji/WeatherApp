const apiKey = '4c4abe58b8163fe3e13ffee1e28182da';

const map = L.map('map').setView([51.505, -0.09], 6); // Initial zoom level adjusted
let marker;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

map.on('click', function (e) {
    const { lat, lng } = e.latlng;
    fetchWeatherByCoords(lat, lng);
});

function fetchWeather() {
    const location = document.getElementById('location').value;
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
        .then(response => {
            const { lat, lon } = response.data.coord;
            zoomToLocation(lat, lon);
            displayWeather(response.data);
            setMapMarker(lat, lon);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-info').innerHTML = `<p>Error fetching weather data: ${error.response.data.message}</p>`;
        });
}

function fetchWeatherByCoords(lat, lon) {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => {
            displayWeather(response.data);
            zoomToLocation(lat, lon);
            setMapMarker(lat, lon);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('weather-info').innerHTML = `<p>Error fetching weather data: ${error.response.data.message}</p>`;
        });
}

function displayWeather(data) {
    document.getElementById('city').innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById('weather-details').innerHTML = `
        <p>Temperature: ${data.main.temp} °C 🌡️</p>
        <p>Condition: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}% 💧</p>
        <p>Wind Speed: ${data.wind.speed} m/s 🌬️</p>
        <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
    `;
    fetchAQI(data.coord.lat, data.coord.lon);
}

function zoomToLocation(lat, lon) {
    map.setView([lat, lon], 10); 
}

function setMapMarker(lat, lon) {
        if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([lat, lon]).addTo(map);
}

function fetchAQI(lat, lon) {
    axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => {
            const aqi = response.data.list[0].main.aqi;
            document.getElementById('weather-details').innerHTML += `<p>Air Quality Index (AQI): ${aqi}</p>`;
        })
        .catch(error => {
            console.error('Error fetching AQI data:', error);
        });
}
