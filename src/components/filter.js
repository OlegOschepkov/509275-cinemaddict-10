import AbstractSmartComponent from "./abstract-smart-component";

export const FilterType = {
  ALL: `ALL`,
  WATCHLIST: `WATCHLIST`,
  WATCHED: `WATCHED`,
  FAVORITES: `FAVORITES`,
  STATS: `STATS`
};

const getFilterMarkup = (filter, isActive) => {
  const {name, count, link, type} = filter;

  return (
    `<a href="#${link}" data-type="${type}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">
        ${name} ${type !== FilterType.ALL && type !== FilterType.STATS ? `<span class="main-navigation__item-count">${count}</span>` : ``}</a>`
  );
};

const getFilterTemplate = (filters, isActive) => {
  const filtersMarkup = filters.map((it) => getFilterMarkup(it, it.type === isActive)).join(`\n`);

  return (
    `<nav class="main-navigation">
      ${filtersMarkup}
    </nav>`
  );
};

export class Filter extends AbstractSmartComponent {
  constructor(filters) {
    super();
    this._filters = filters;
    this._active = FilterType.ALL;
  }

  getTemplate() {
    return getFilterTemplate(this._filters, this._active);
  }

  update(newData, isActive) {
    this._filters = newData;
    if (isActive) {
      this._active = isActive;
    }
    this.rerender();
  }

  recoveryListeners() {
    this.onFilterChange(this._onFilterChange);
    this.onStatsClick(this._onStatsClick);
  }

  onFilterChange(handler) {
    this._onFilterChange = handler;

    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      handler(evt.target.dataset.type);
    });
  }

  onStatsClick(handler) {
    this._onStatsClick = handler;

    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.dataset.type === FilterType.STATS) {
        handler();
      }
    });
  }
}
