import {getFilterTemplate} from './components/filter';
// import {getSortTemplate} from './components/sort';
import {getBoardTemplate} from './components/board';
import {getListTemplate} from './components/list';
import {getExtraListTemplate} from './components/list-extra';
import {getCardTemplate} from './components/card';
import {getCardPopupTemplate} from './components/card-popup';
import {getUserTemplate} from './components/user';
import {getLoadMoreBtnTemplate} from './components/load-more-btn';
import {getFooterTemplate} from './components/footer';
import {generateFilters} from './mock/filter';
import {generateFilms} from './mock/films';
import {generateExtra} from "./mock/extra";
import {user} from './mock/user';
import {getRandomIntegerNumber} from './utils/utils';
import {generateComments} from "./mock/comments";
import {generatePopup} from './mock/popup';

const FILMS_COUNT = 15;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;
const EXTRA_COUNT = 2;
const EXTRA_FILMS_COUNT = 2;

const render = (container, temlate, place) => {
  container.insertAdjacentHTML(place, temlate);
};

const headerBlock = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);

const filters = generateFilters();

const films = generateFilms(FILMS_COUNT);

user.level = getRandomIntegerNumber(0, 4);

render(headerBlock, getUserTemplate(user.level), `beforeend`);
render(mainBlock, getFilterTemplate(filters, films), `beforeend`);
// render(mainBlock, getSortTemplate(sortTypes), `beforeend`);
render(mainBlock, getBoardTemplate(), `beforeend`);

const boardBlock = mainBlock.querySelector(`.films`);

render(boardBlock, getListTemplate(), `beforeend`);

const listBlock = mainBlock.querySelector(`.films-list`);
const listContainer = listBlock.querySelector(`.films-list__container`);

const extraListBlocks = [...boardBlock.querySelectorAll(`.films-list--extra`)];

extraListBlocks.forEach(function (elem) {
  const extraListContainer = elem.querySelector(`.films-list__container`);
  for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
    render(extraListContainer, getCardTemplate(films), `beforeend`);
  }
});

const bodyBlock = document.querySelector(`body`);

const popupData = generatePopup();
const comments = generateComments();

render(bodyBlock, getCardPopupTemplate(popupData, comments), `beforeend`);
render(bodyBlock, getFooterTemplate(films), `beforeend`);
let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
films.slice(0, showingFilmsCount).forEach((film) => render(listContainer, getCardTemplate(film), `beforeend`));

const extra = generateExtra(EXTRA_COUNT);
const [first, second] = extra;

const renderExtraFilms = (elem, filmsList) => {
  const extraListContainer = elem.querySelector(`.films-list__container`);
  filmsList.slice(0, EXTRA_FILMS_COUNT).forEach((film) => render(extraListContainer, getCardTemplate(film), `beforeend`));
};

const renderExtra = () => {
  if (films.reduce((acc, it) => acc + it.rating, 0) > 0) {
    render(boardBlock, getExtraListTemplate(first), `beforeend`);
    const extraListBlock = [...boardBlock.querySelectorAll(`.films-list--extra`)].shift();
    renderExtraFilms(extraListBlock, films.sort((a, b) => b.rating - a.rating));
  }
  if (films.reduce((acc, it) => acc + it.comments, 0) > 0) {
    render(boardBlock, getExtraListTemplate(second), `beforeend`);
    const extraListBlock = [...boardBlock.querySelectorAll(`.films-list--extra`)].pop();
    renderExtraFilms(extraListBlock, films.sort((a, b) => b.comments - a.comments));
  }
};

render(listBlock, getLoadMoreBtnTemplate(), `beforeend`);

const loadMoreButton = listBlock.querySelector(`.films-list__show-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingFilmsCount;
  showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

  films.slice(prevTasksCount, showingFilmsCount)
    .forEach((film) => render(listContainer, getCardTemplate(film), `beforeend`));

  if (showingFilmsCount >= films.length) {
    loadMoreButton.remove();
  }
});

renderExtra();
