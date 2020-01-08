import AbstractSmartComponent from "./abstract-smart-component";

// export const FilterType = {
//   ALL: `All movies`,
//   WATCHLIST: `Watchlist`,
//   WATCHED: `History`,
//   FAVORITES: `Favorites`,
//   STATS: `Stats`
// };

// function getKeyByValue(value) {
//   return Object.keys(FilterType).find(key => FilterType[key] === value);
// }

// const getCountMarkup = (filterTag) => {
//   const count = filterTag.length;
//
//   return (
//     `${count ? `<span class="main-navigation__item-count">${count}</span>` : ``}`
//   );
// };

const getFilterMarkup = (filter, isActive) => {
  const {name, count, link, type} = filter;
  // const countMarkup = getCountMarkup(films.filter((it) => it.filterTag === name.toLowerCase()));

  return (
    `<a href="#${link}" data-type="${type}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">
        ${name} ${type !== `ALL` ? `<span class="main-navigation__item-count">${count}</span>` : ``}</a>`
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

export class FilterComponent extends AbstractSmartComponent {
  constructor(filters) {
    super();
    this._filters = filters;
    this._active = `ALL`;
    // this._films = films;
  }

  getTemplate() {
    // console.log(this._active)
    return getFilterTemplate(this._filters, this._active);
  }

  setFilterChangeHandler(handler) {
    this._setFilterChangeHandler = handler;

    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      // const filterName = getKeyByValue(evt.target.dataset.type);
      handler(evt.target.dataset.type);
    });
  }

  update(newData, isActive) {
    this._filters = newData;
    this._active = isActive;
    this.getTemplate();
    this.rerender();
    this.recoveryListeners();
  }

  recoveryListeners() {
    this.setFilterChangeHandler(this._setFilterChangeHandler);
  }
}
