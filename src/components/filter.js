import {createElement} from '../utils/utils';

const getCountMarkup = (filterTag) => {
  const count = filterTag.length;

  return (
    `${count ? `<span class="main-navigation__item-count">${count}</span>` : ``}`
  );
};

const getFilterMarkup = (filter, isActive, films) => {
  const {name, link} = filter;
  const countMarkup = getCountMarkup(films.filter((it) => it.filterTag === name.toLowerCase()));

  return (
    `<a href="#${link}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">
        ${name} ${countMarkup}</a>`
  );
};

const getFilterTemplate = (filters, films) => {
  const filtersMarkup = filters.map((it, i) => getFilterMarkup(it, i === 0, films)).join(`\n`);

  return (
    `<nav class="main-navigation">
      ${filtersMarkup}
    </nav>`
  );
};

export default class Filter {
  constructor(filters, films) {
    this._filters = filters;
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return getFilterTemplate(this._filters, this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
