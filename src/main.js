import {getFilterTempl} from './components/filter';
import {getBoardTempl} from './components/board';
import {getListTempl} from './components/list';
import {getExtraListTempl} from './components/list-extra';
import {getCardTempl} from './components/card';
import {getCardPopupTempl} from './components/card-popup';
import {getUserTempl} from './components/user';
import {getLoadMoreBtnTempl} from './components/load-more-btn';

const FILMS_COUNT = 5;
const EXTRA_COUNT = 2;
const EXTRA_FILMS_COUNT = 2;

const render = (container, temlate, place) => {
  container.insertAdjacentHTML(place, temlate);
};

const headerBlock = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);

render(headerBlock, getUserTempl(), `beforeend`);
render(mainBlock, getFilterTempl(), `beforeend`);
render(mainBlock, getBoardTempl(), `beforeend`);

const boardBlock = mainBlock.querySelector(`.films`);

render(boardBlock, getListTempl(), `beforeend`);

const listBlock = mainBlock.querySelector(`.films-list`);
const listContainer = listBlock.querySelector(`.films-list__container`);

render(listBlock, getLoadMoreBtnTempl(), `beforeend`);

const extraListBlock = Array.from(boardBlock.querySelectorAll(`.films-list--extra`));

extraListBlock.forEach(function (elem) {
  const extraListContainer = elem.querySelector(`.films-list__container`);
  for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
    render(extraListContainer, getCardTempl(), `beforeend`);
  }
});

const bodyBlock = document.querySelector(`body`);

render(bodyBlock, getCardPopupTempl(), `beforeend`);

const renderFilms = () => {
  for (let i = 0; i < FILMS_COUNT; i++) {
    render(listContainer, getCardTempl(), `beforeend`);
  }
};

const renderExtra = () => {
  for (let i = 0; i < EXTRA_COUNT; i++) {
    render(boardBlock, getExtraListTempl(), `beforeend`);
  }
  const extraListBlock = Array.from(boardBlock.querySelectorAll(`.films-list--extra`));
  extraListBlock.forEach(function (elem) {
    const extraListContainer = elem.querySelector(`.films-list__container`);
    for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
      render(extraListContainer, getCardTempl(), `beforeend`);
    }
  })
};

renderFilms();
renderExtra();
