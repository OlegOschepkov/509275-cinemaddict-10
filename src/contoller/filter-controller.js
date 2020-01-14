import {placeElement, RenderPosition} from "../utils/render";
import {FilterComponent, FilterType} from "../components/filter";
import {getFilmsByFilter} from "../utils/filter-utils";
import {generateFilters} from "../mock/filter";
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

    this._onFilterChange = this._onFilterChange.bind(this);
  }

  render() {
    // console.log('hiiiiiii2')

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

    this._filterComponent = new FilterComponent(filters);

    this._filterComponent.onFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      placeElement(this._filterComponent, oldComponent);
    } else {
      placeElement(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  update() {
    const allFilms = this._filmsModel.getFilms();
    // console.log('hiiiiiii')

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

    this._filterComponent.recoveryListeners(this._onFilterChange);

    // this._filmsModel = newData;
    this._filterComponent.update(filters, this._activeFilterType);
  }

  // _onDataChange() {
  //   this.render();
  // }

  // update(container, newController) {
  //
  //   this._container = container;
  //   const allFilms = newController.getFilms();
  //
  //   const filters = this._filters.map((filterType) => {
  //     return {
  //       name: filterType.name,
  //       type: filterType.type,
  //       count: getFilmsByFilter(allFilms, filterType.type).length,
  //       checked: filterType.type === this._activeFilterType,
  //       link: filterType.link,
  //     };
  //   });
  //
  //   const oldComponent = this._filterComponent;
  //
  //   this._filterComponent = new FilterComponent(filters);
  //   this._filterComponent.onFilterChangeHandler(this._onFilterChange);
  //
  //   remove(oldComponent);
  //   placeElement(this._container, this._filterComponent, RenderPosition.AFTERBEGIN);
  // }

  _onFilterChange(filterType) {
    if (filterType === FilterType.STATS) {
      this._activeFilterType = filterType;
      this._filterComponent.update(this._filters, this._activeFilterType);
    } else {
      this._filmsModel.setFilter(filterType);
      this._activeFilterType = filterType;
      this._filterComponent.update(this._filters, this._activeFilterType);
    }
  }

  onStatsClick(handler) {
    this._filterComponent.onStatsClick(handler);
  }
}
