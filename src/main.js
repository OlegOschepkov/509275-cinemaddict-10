import API from "./api";
import FilterController from "./contoller/filter-controller";
import BoardComponent from "./components/board";
import FooterComponent from "./components/footer";
import UserComponent from "./components/user";
import StatisticComponent from "./components/statistic";
// import {generateFilters} from "./mock/filter";
// import {generateFilms} from "./mock/films";
// import {generateExtra} from "./mock/extra";
import {user} from "./mock/user";
import {getRandomIntegerNumber} from "./utils/utils";
import {placeElement, RenderPosition} from "./utils/render";
// import SortComponent from "./components/sort";
import BoardController from "./contoller/page-controller";
import FilmsModel from "./models/films-model";
import CommentsModel from "./models/comments-model";
// import {Mode as MovieControllerMode} from "./contoller/movie-controller";
// import {FilterComponent} from "./components/filter";

const AUTHORIZATION = `Basic olegoschepkov`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;
const api = new API(END_POINT, AUTHORIZATION);

const bodyBlock = document.querySelector(`body`);
const headerBlock = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);

// const films = generateFilms(FILMS_COUNT);
const filmsModel = new FilmsModel();
// filmsModel.setFilms(films);

const filterController = new FilterController(mainBlock, filmsModel);

user.level = getRandomIntegerNumber(0, 25);

const userBlock = new UserComponent(user.level);

placeElement(headerBlock, userBlock, RenderPosition.BEFOREEND);
filterController.render();
const boardBlock = new BoardComponent();

placeElement(mainBlock, boardBlock, RenderPosition.BEFOREEND);

api.getFilms()
  .then((films) => {
    films.map((it) => {
      api.getComments(it.id)
        .then((comments) => {
          const commentsModel = new CommentsModel(comments);
          it.comments = commentsModel.parseComments(comments);
        });
    });
    // console.log(films)
    filmsModel.setFilms(films);
    filterController.update();
    const statisticBlock = new StatisticComponent({films: filmsModel.getFilms()}, userBlock);
    placeElement(mainBlock, statisticBlock, RenderPosition.BEFOREEND);
    statisticBlock.hide();
    const boardController = new BoardController(boardBlock, filmsModel, filterController, statisticBlock, api);
    boardController.render();
    filterController.onStatsClick(boardController.toggleVisibility);
    placeElement(bodyBlock, new FooterComponent(films), RenderPosition.BEFOREEND);
  });
