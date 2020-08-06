document.addEventListener("DOMContentLoaded", function () {
  //variables for the eventlisteners
  const weatherButton = document.querySelector(".weather__form");
  const newsButton = document.querySelector(".news__form");
  //variables holding values to display
  // event listeners
  //weather listener
  weatherButton.addEventListener("submit", (event) => {
    event.preventDefault();
    if (formFilled(event)) {
      document.querySelector(".weather__container").innerHTML = "";
      getWeather(
        event.target.city.value,
        event.target.province.value,
        event.target.country.value
      );
    }
  });
  // news button listener
  newsButton.addEventListener("change", (event) => {
    event.preventDefault();
    getNews(event.target.value);
  });
  // functions getting each section and displaying them. For the ones that dont have buttons they have an interval set up
  getNews("home");
  getWeather("vancouver", "british colombia", "canada");
  getImage();
  getJokes();
  getInspiration();
  setInterval(getImage, 300000);
  setInterval(getJokes, 30000);
  setInterval(getInspiration, 30000);
  setInterval(getTime, 1000);
  // var elem = document.querySelector(".main-carousel");
  // var flkty;
  // setTimeout(() => {
  //   flkty = new Flickity(elem, {
  //     // options
  //     cellAlign: "left",
  //     contain: true,
  //     imagesLoaded: true,
  //   });
  // }, 100);
  let firstTime = true;
  // these functions get the info to display
  function getNews(category) {
    axios
      .get(
        `https://api.nytimes.com/svc/topstories/v2/${category}.json?api-key=5Fuweavf9NF1wpoTCAyGX4XZ7DMCtztz`
      )
      .then((response) => {
        console.log(response.data.results);
        getNewsArray(response.data.results);
        let elem = document.querySelector(".main-carousel");
        let flkty = new Flickity(elem, {
          // options
          cellAlign: "left",
          contain: true,
          imagesLoaded: true,
        });
        if (firstTime) {
          firstTime = false;
        } else {
          flkty.resize();
        }
      });
  }
  function getJokes() {
    axios
      .get(`https://official-joke-api.appspot.com/random_joke`)
      .then((response) => {
        getJokeArray(response.data);
      });
  }
  function getImage() {
    axios
      .get(
        `https://api.unsplash.com/photos/random/?client_id=wwVVz3qhUJvGqcNmHBfoHEiRz3BP2UPYOHjMIQ5jDlc`
      )
      .then((response) => {
        displayImage(response.data.urls.regular);
      });
    const imageTree = document.querySelector(".background__container");
    imageTree.style.backgroundImage = "https://picsum.photos/1440";
  }
  function getInspiration() {
    axios
      // .get(`https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand`)
      .get("https://api.adviceslip.com/advice")
      .then((response) => {
        getInspirationArray(response.data.slip.advice);
      });
  }
  function getWeather(cityName, stateCode, countryCode) {
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/weather?q=${cityName},${stateCode},${countryCode}&appid=cebcf683d0d062863ca7097ff13e3981&units=metric`
      )
      .then((response) => {
        getWeatherArray(response.data);
      });
  }
  function formFilled(event) {
    const city = event.target.city.value;
    const province = event.target.province.value;
    const country = event.target.country.value;
    return !!city && !!province && !!country;
  }

  function getTime() {
    let time = new Date();
    var displayTime = time.toLocaleTimeString();
    document.querySelector(".time").innerHTML = displayTime;
  }

  // functions to transfer the response data to an object
  function getNewsArray(data) {
    const articlesWithImages = data.filter(
      (item) =>
        item.multimedia &&
        item.multimedia.length &&
        item.multimedia[4].url &&
        item.multimedia[4].caption
    );
    const newsContainer = document.querySelector(".main-carousel");
    newsContainer.innerHTML = "";
    for (i = 0; i < 15 && i < articlesWithImages.length; i++) {
      const article = document.createElement("a");
      articleDiv = document.createElement("div");
      articleDiv.setAttribute("class", "carousel-cell article__container ");
      article.setAttribute("href", articlesWithImages[i].url);
      const abstractContainer = document.createElement("div");
      const articleContainer = document.createElement("div");
      articleContainer.setAttribute("class", "news__article");
      abstractContainer.setAttribute("class", "news__text-container");
      const abstract = `<p class='news__abstract'>${articlesWithImages[i].abstract}</p>`;
      const byline = `<p class='news__byline'>${articlesWithImages[i].byline}</p>`;
      const photo = `<img class='news__image' src='${articlesWithImages[i].multimedia[4].url}' alt =  'article photo'>`;
      const title = `<p class='news__title'>${articlesWithImages[i].title}</p>`;
      abstractContainer.innerHTML = title + byline + abstract;
      articleContainer.innerHTML = photo;
      articleContainer.appendChild(abstractContainer);
      article.appendChild(articleContainer);
      articleDiv.appendChild(article);
      newsContainer.appendChild(articleDiv);
    }
  }

  function getJokeArray(data) {
    const setup = `<p class = 'jokes__setup'>${data.setup}</p>`;
    const punchline = `<p class = 'jokes__punchline'>${data.punchline}</p>`;
    const jokesContainer = document.querySelector(".jokes");
    const jokeTree = document.createElement("div");
    jokeTree.setAttribute("class", "jokes__container");
    jokeTree.innerHTML = setup;
    setTimeout(() => {
      jokeTree.innerHTML = setup + punchline;
    }, 10000);
    jokesContainer.innerHTML = "";
    const punchElement = document.querySelector(".jokes__punchline");
    jokesContainer.appendChild(jokeTree);
  }
  function displayImage(data) {
    const tree = document.querySelector(".background__container");
    tree.setAttribute(
      "style",
      `background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('${data}');`
    );
  }
  function getInspirationArray(data) {
    const quote = data;
    const inspirationContainer = document.querySelector(".inspiration");
    const inspiration = document.createElement("div");
    inspiration.setAttribute("class", "Inspiration__container");
    inspiration.innerHTML = quote;
    inspirationContainer.innerHTML = "";
    inspirationContainer.appendChild(inspiration);
  }
  function getWeatherArray(data) {
    const city = `<p class='weather__city'>${data.name}</p>`;
    const feels = `<p class="weather__feels-like">Feels like: ${data.main.feels_like}C</p>`;
    const humidity = `<p class="weather__humidity">Humidity: ${data.main.humidity}%</p>`;
    const pressure = `<p class="weather__pressure">Pressure: ${data.main.pressure}</p>`;
    const temp = `<p class="weather__temp">Current Temp: ${data.main.temp}C</p>`;
    const tempMax = `<p class="weather__temp-max">Max Temp: ${data.main.temp_max}C</p>`;
    const tempMin = `<p class="weather__temp-min">Min Temp: ${data.main.temp_min}C</p>`;
    const weatherContainer = document.querySelector(".weather");
    let weather = document.createElement("div");
    weather.setAttribute("class", "weather__container");
    weather.innerHTML =
      city + temp + tempMin + tempMax + feels + humidity + pressure;
    weatherContainer.appendChild(weather);
  }
});
