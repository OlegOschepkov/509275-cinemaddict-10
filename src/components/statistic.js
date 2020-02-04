import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";
import {getWatchedFilms} from "../utils/filter-utils";

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const calcUniqCountGenre = (films, genre) => {
  return films.filter((it) => it === genre).length;
};

const renderChart = (colorsCtx, films) => {
  let genres;
  let countedGenres;
  if (films.length > 0) {
    const genresList = films.slice().map((it) => it.genre).reduce((it, that) => it.concat(that));
    genres = genresList.filter(getUniqItems);
    countedGenres = genresList.map((genre) => calcUniqCountGenre(genresList, genre));
  } else {
    genres = [];
    countedGenres = [];
  }
  Chart.defaults.scale.ticks.beginAtZero = true;

  return new Chart(colorsCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: countedGenres,
        backgroundColor: `#ffe125`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} FILMS — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#ffffff`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: `DONE BY: GENRES`,
        fontSize: 16,
        fontColor: `#ffffff`
      },
      legend: {
        display: false
      },
    },
  });
};

const getFavoriteGenre = (genres) => {
  let maximumFrequency = 1;
  let counter = 0;
  let genre;
  for (let currentGenre of genres) {
    for (let lookedGenre of genres) {
      if (currentGenre === lookedGenre) {
        counter++;
      }
      if (maximumFrequency < counter) {
        maximumFrequency = counter;
        genre = currentGenre;
      }
    }
    counter = 0;
  }
  if (maximumFrequency === 1) {
    genre = genres[0];
  }
  if (genres.length === 0) {
    genre = `-`;
  }

  return genre;
};

const createStatisticsTemplate = ({films}, user, isActive) => {
  const active = isActive;
  const userLvl = user;
  const filmsCount = getWatchedFilms(films).length;
  const countDuration = films.slice().reduce((acc, it) => acc + it.duration, 0);
  const min = countDuration % 60;
  const hours = Math.floor(countDuration / 60);
  let favoriteGenre;
  if (films.length > 0) {
    const genres = films.slice().map((it) => it.genre).reduce((it, that) => it.concat(that));
    favoriteGenre = getFavoriteGenre(genres);
  } else {
    favoriteGenre = `-`;
  }

  return (
    `<section class="statistic">
        <p class="statistic__rank">
          Your rank
          <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          <span class="statistic__rank-label">${userLvl}</span>
        </p>

        <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
          <p class="statistic__filters-description">Show stats:</p>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" data-type="all" ${active === `statistic-all-time` ? `checked` : ``}>
          <label for="statistic-all-time" class="statistic__filters-label">All time</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" data-type="today" ${active === `statistic-today` ? `checked` : ``}>
          <label for="statistic-today" class="statistic__filters-label">Today</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" data-type="week" ${active === `statistic-week` ? `checked` : ``}>
          <label for="statistic-week" class="statistic__filters-label">Week</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" data-type="month" ${active === `statistic-month` ? `checked` : ``}>
          <label for="statistic-month" class="statistic__filters-label">Month</label>

          <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" data-type="year" ${active === `statistic-year` ? `checked` : ``}>
          <label for="statistic-year" class="statistic__filters-label">Year</label>
        </form>

        <ul class="statistic__text-list">
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">You watched</h4>
            <p class="statistic__item-text">${filmsCount}<span class="statistic__item-description">movies</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Total duration</h4>
            <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${min} <span class="statistic__item-description">m</span></p>
          </li>
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Top genre</h4>
            <p class="statistic__item-text">${favoriteGenre}</p>
          </li>
        </ul>

        <div class="statistic__chart-wrap">
          <canvas class="statistic__chart" width="1000"></canvas>
        </div>
      </section>`
  );
};

export default class StatisticComponent extends AbstractSmartComponent {
  constructor({films}) {
    super();

    this._films = getWatchedFilms(films);
    this._filteredFilms = this._films;
    this._level = ``;
    this._active = `statistic-all-time`;

    this._colorsChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate({films: this._filteredFilms}, this._level, this._active);
  }

  _renderCharts() {
    const element = this.getElement();

    const colorsCtx = element.querySelector(`.statistic__chart`);

    this._resetCharts();

    this._colorsChart = renderChart(colorsCtx, this._filteredFilms);
    this.onInputClick();
  }

  _resetCharts() {
    if (this._colorsChart) {
      this._colorsChart.destroy();
      this._colorsChart = null;
    }
  }

  update(films, userLvl) {
    this._filteredFilms = getWatchedFilms(films);
    this._level = userLvl;
    this.rerender();
    this.hide();
  }

  rerender() {
    super.rerender();
    this._renderCharts();
  }

  show() {
    super.show();
    this.rerender(this._films);
  }

  onInputClick() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`click`, (evt) => {
      if (evt.target.classList.contains(`statistic__filters-input`)) {
        const type = evt.target.dataset.type;
        this._active = evt.target.id;

        if (type === `all`) {
          this._filteredFilms = this._films;
          this.rerender(this._filteredFilms);
        } else if (type === `today`) {
          this._filteredFilms = this._films.slice().filter((film) => moment(film.isWatchedDate).isAfter(moment().subtract(1, `day`)));
          this.rerender(this._filteredFilms);
        } else if (type === `week`) {
          this._filteredFilms = this._films.slice().filter((film) => moment(film.isWatchedDate).isAfter(moment().subtract(1, `week`)));
          this.rerender(this._filteredFilms);
        } else if (type === `month`) {
          this._filteredFilms = this._films.slice().filter((film) => moment(film.isWatchedDate).isAfter(moment().subtract(1, `month`)));
          this.rerender(this._filteredFilms);
        } else if (type === `year`) {
          this._filteredFilms = this._films.slice().filter((film) => moment(film.isWatchedDate).isAfter(moment().subtract(1, `year`)));
          this.rerender(this._filteredFilms);
        }
      }
    });
  }

  recoveryListeners() {}
}
