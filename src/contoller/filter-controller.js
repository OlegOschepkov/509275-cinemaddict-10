import {placeElement, RenderPosition} from "../utils/render";
import {Filter, FilterType} from "../components/filter";
import {getFilmsByFilter} from "../utils/filter-utils";
import {generateFilters} from "../mock/filter";
import {replace} from "../utils/utils";
// import StatisticComponent from "../components/abstract-component";
// import {generateComments} from "../mock/comments";
// import {generatePopup} from "../mock/popup";

export default class FilterController {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;
    this._filters = generateFilters();
    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._filmsModel.onDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allFilms = this._filmsModel.getFilms();
    // console.log(allFilms)
    const filters = this._filters.map((filterType) => {
      return {
        name: filterType.name,
        type: filterType.type,
        count: getFilmsByFilter(allFilms, filterType.type).length,
        checked: filterType.type === this._activeFilterType,
        link: filterType.link,
      };
    });

    this._filters = filters;

    const oldComponent = this._filterComponent;

    this._filterComponent = new Filter(filters);

    this._filterComponent.onFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      placeElement(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  update() {
    const allFilms = this._filmsModel.getFilms();

    const filters = this._filters.map((filterType) => {
      return {
        name: filterType.name,
        type: filterType.type,
        count: getFilmsByFilter(allFilms, filterType.type).length,
        checked: filterType.type === this._activeFilterType,
        link: filterType.link,
      };
    });
    this._filters = filters;
    console.log(this.foo)

    this._filterComponent.recoveryListeners(this._onFilterChange);
    this._filterComponent.recoveryListeners(this.onStatsClick(this.foo));

    // this._filmsModel = newData;
    this._filterComponent.update(filters, this._activeFilterType);
  }

  _onFilterChange(filterType) {
    if (filterType !== FilterType.STATS) {
      this._filmsModel.setFilter(filterType);
    }
    this._activeFilterType = filterType;
    this._filterComponent.update(this._filters, this._activeFilterType);
  }

  _onDataChange() {
    this.render();
  }

  onStatsClick(handler) {
    this.foo = handler
    this._filterComponent.onStatsClick(this.foo);
  }
}
