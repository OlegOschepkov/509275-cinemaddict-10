import Api from "./api/index";
import Store from './api/store.js';
import Provider from './api/provider.js';
import FilterController from "./contoller/filter-controller";
import BoardComponent from "./components/board";
import FooterComponent from "./components/footer";
import UserComponent from "./components/user";
import StatisticComponent from "./components/statistic";
// import {generateFilters} from "./mock/filter";
// import {generateFilms} from "./mock/films";
// import {generateExtra} from "./mock/extra";
// import {user} from "./mock/user";
// import {getRandomIntegerNumber} from "./utils/utils";
import {placeElement, RenderPosition} from "./utils/render";
// import SortComponent from "./components/sort";
import BoardController from "./contoller/page-controller";
import FilmsModel from "./models/films-model";
// import CommentsModel from "./models/comments-model";
// import {Mode as MovieControllerMode} from "./contoller/movie-controller";
// import {FilterComponent} from "./components/filter";

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
      // Действие, в случае успешной регистрации ServiceWorker
    }).catch(() => {
    // Действие, в случае ошибки при регистрации ServiceWorker
    });
});
const bodyBlock = document.querySelector(`body`);
const headerBlock = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);

// const films = generateFilms(FILMS_COUNT);
const filmsModel = new FilmsModel();
// filmsModel.setFilms(films);

const filterController = new FilterController(mainBlock, filmsModel);

// user.level = getRandomIntegerNumber(0, 25);

const userBlock = new UserComponent();

placeElement(headerBlock, userBlock, RenderPosition.BEFOREEND);
filterController.render();
const boardBlock = new BoardComponent();

placeElement(mainBlock, boardBlock, RenderPosition.BEFOREEND);

apiWithProvider.getFilms()
  .then((films) => {
    // films.map((it) => {
    //   api.getComments(it.id)
    //     .then((comments) => {
    //       const commentsModel = new CommentsModel(comments);
    //       it.comments = commentsModel.parseComments(comments);
    //     });
    // });
    // console.log(films)
    filmsModel.setFilms(films);
    filterController._onDataChange();
    const statisticBlock = new StatisticComponent({films: filmsModel.getFilms()});
    placeElement(mainBlock, statisticBlock, RenderPosition.BEFOREEND);
    statisticBlock.hide();
    const boardController = new BoardController(boardBlock, filmsModel, filterController, statisticBlock, apiWithProvider, userBlock);
    boardController.render();
    // filterController.onStatsClick(boardController.toggleVisibility);
    placeElement(bodyBlock, new FooterComponent(films), RenderPosition.BEFOREEND);
  });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync()
      .then(() => {
        // Действие, в случае успешной синхронизации
        // console.log('successfully sync')
      })
      .catch(() => {
        // Действие, в случае ошибки синхронизации
        // console.log('failed sync')
      });
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
