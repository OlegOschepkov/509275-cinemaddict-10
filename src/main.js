import Api from "./api/index";
import Store from './api/store.js';
import Provider from './api/provider.js';
import FilterController from "./contoller/filter-controller";
import BoardComponent from "./components/board";
import FooterComponent from "./components/footer";
import UserComponent from "./components/user";
import StatisticComponent from "./components/statistic";
import {placeElement, remove, RenderPosition} from "./utils/render";
import BoardController from "./contoller/page-controller";
import FilmsModel from "./models/films-model";
import LoadingList from "./components/list-is-loading";
import SortComponent from "./components/sort";

const STORE_PREFIX = `cinemaaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const AUTHORIZATION = `Basic olegoschepkov`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;
const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
    }).catch(() => {
    });
});
const bodyBlock = document.querySelector(`body`);
const headerBlock = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);

const filmsModel = new FilmsModel();

const filterController = new FilterController(mainBlock, filmsModel);

const userBlock = new UserComponent();

placeElement(headerBlock, userBlock, RenderPosition.BEFOREEND);
filterController.render();
const boardBlock = new BoardComponent();
const sortComponent = new SortComponent();
const loadingList = new LoadingList();

placeElement(mainBlock, boardBlock, RenderPosition.BEFOREEND);
placeElement(boardBlock.getElement(), sortComponent, RenderPosition.BEFOREEND);
placeElement(boardBlock.getElement(), loadingList, RenderPosition.BEFOREEND);

apiWithProvider.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);
    filterController._onDataChange();
    const statisticBlock = new StatisticComponent({films: filmsModel.getFilms()});
    placeElement(mainBlock, statisticBlock, RenderPosition.BEFOREEND);
    remove(loadingList);
    const boardController = new BoardController(boardBlock, filmsModel, filterController, statisticBlock, apiWithProvider, userBlock, sortComponent);
    boardController.render();
    placeElement(bodyBlock, new FooterComponent(films), RenderPosition.BEFOREEND);
  });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync()
      .then(() => {
      })
      .catch(() => {
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
