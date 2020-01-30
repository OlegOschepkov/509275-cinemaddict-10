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
  // const countMarkup = getCountMarkup(films.filter((it) => it.filterTag === name.toLowerCase()));

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
    // this._films = films;
  }

  getTemplate() {
    return getFilterTemplate(this._filters, this._active);
  }

  onFilterChangeHandler(handler) {
    this._onFilterChangeHandler = handler;

    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      // const filterName = getKeyByValue(evt.target.dataset.type);
      if (evt.target.dataset.type !== FilterType.STATS) {
        handler(evt.target.dataset.type);
      }
      // else if (evt.target.dataset.type === FilterType.STATS) {
      //   console.log(`hi`)
      // }
    });
  }

  update(newData, isActive) {
    this._filters = newData;
    this._active = isActive;
    // console.log(this._active)
    this.getTemplate();
    this.rerender();
    // this.recoveryListeners();
  }

  recoveryListeners() {
    this.onFilterChangeHandler(this._onFilterChangeHandler);
    this.onStatsClick(this._onStatsClick);
  }

  onStatsClick(handler) {

    this._onStatsClick = handler;

    this.getElement().addEventListener(`click`, (evt) => {
      // console.log(handler)
      evt.preventDefault();
      if (evt.target.dataset.type === FilterType.STATS) {
        handler();
      }
    });
  }
}
