import {placeElement, RenderPosition} from "../utils/render";
import {Filter, FilterType} from "../components/filter";
import {getFilmsByFilter} from "../utils/filter-utils";
import {generateFilters} from "../mock/filter";
import {replace} from "../utils/utils";

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
  }

  _onFilterChange(filterType) {
    if (filterType !== FilterType.STATS) {
      this._filmsModel.setFilter(filterType);
    }
    this._activeFilterType = filterType;
    this._filterComponent.update(this._filters, this._activeFilterType);
  }

  _onDataChange() {
    this.update();
  }

  onStatsClick(handler) {
    this._filterComponent.update(this._filters, this._activeFilterType);
    this._filterComponent.onStatsClick(handler);
  }
}
