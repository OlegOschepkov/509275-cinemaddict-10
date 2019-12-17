import FilterComponent from './components/filter';
import BoardComponent from './components/board';
import FooterComponent from './components/footer';
import UserComponent from './components/user';
import {generateFilters} from './mock/filter';
import {generateFilms} from './mock/films';
import {generateExtra} from "./mock/extra";
import {user} from './mock/user';
import {getRandomIntegerNumber, FILMS_COUNT} from './utils/utils';
import {render, RenderPosition} from './utils/render';
// import SortComponent from "./components/sort";
import BoardController from "./contoller/page-controller";

const bodyBlock = document.querySelector(`body`);
const headerBlock = document.querySelector(`.header`);
const mainBlock = document.querySelector(`.main`);

const films = generateFilms(FILMS_COUNT);

const filters = generateFilters();

user.level = getRandomIntegerNumber(0, 25);

render(headerBlock, new UserComponent(user.level), RenderPosition.BEFOREEND);
render(mainBlock, new FilterComponent(filters, films), RenderPosition.BEFOREEND);

// render(mainBlock, new SortComponent, RenderPosition.BEFOREEND);
// render(mainBlock, boardBlock, RenderPosition.BEFOREEND);
const boardBlock = new BoardComponent();

render(mainBlock, boardBlock, RenderPosition.BEFOREEND);

const boardController = new BoardController(boardBlock);

const EXTRA_COUNT = 2;
const extra = generateExtra(EXTRA_COUNT);

boardController.render(films, extra);

render(bodyBlock, new FooterComponent(films), RenderPosition.BEFOREEND);
