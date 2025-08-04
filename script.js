 const apiKey = '183c2006ee3d455b81f70532253107';
const loader = document.getElementById('loader');
const currentEl = document.getElementById('current-weather');
const forecastEl = document.getElementById('forecast');
const forecastTitle = document.getElementById('forecast-title');

document.getElementById('get-weather').addEventListener('click', () => {
  const loc = document.getElementById('location-input').value.trim();
  if (!loc) return alert('Please enter a location');
  fetchWeather(loc);
});

async function fetchWeather(location) {
  try {
    loader.style.display = 'block';
    currentEl.innerHTML = '';
    forecastEl.innerHTML = '';
    forecastTitle.style.display = 'none';

    const forecastRes = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(location)}&days=5&aqi=no&alerts=no`);
    const forecast = await forecastRes.json();

    if (forecast.error) throw new Error(forecast.error.message);

    displayCurrent(forecast);
    displayForecast(forecast.forecast.forecastday);
  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    loader.style.display = 'none';
  }
}

function displayCurrent(data) {
  const c = data.current;
  const loc = data.location;
  const astro = data.forecast.forecastday[0].astro;

  currentEl.innerHTML = `
    <h2>${loc.name}, ${loc.country}</h2>
    <img src="https:${c.condition.icon}" alt="${c.condition.text}" />
    <p><strong>${c.condition.text}</strong></p>
    <p><strong>Temperature:</strong> ${c.temp_c} °C</p>
    <p><strong>Humidity:</strong> ${c.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${c.wind_kph} kph</p>
    <p><strong>Sunrise:</strong> ${astro.sunrise}</p>
    <p><strong>Sunset:</strong> ${astro.sunset}</p>
  `;
}

function displayForecast(days) {
  forecastTitle.style.display = 'block';
  days.forEach(day => {
    const el = document.createElement('div');
    el.className = 'forecast-day';
    el.innerHTML = `
      <h3>${day.date}</h3>
      <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}" />
      <p><strong>${day.day.condition.text}</strong></p>
      <p>High: ${day.day.maxtemp_c} °C</p>
      <p>Low: ${day.day.mintemp_c} °C</p>
      <p>☀️ Sunrise: ${day.astro.sunrise}</p>
      <p>🌙 Sunset: ${day.astro.sunset}</p>
    `;
    forecastEl.appendChild(el);
  });
}
