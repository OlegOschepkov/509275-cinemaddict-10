import {createElement} from '../utils/utils';

const getSortMarkup = (filter, isActive) => {
  const {sortType} = filter;

  return (sortType ? `<li><a href="#" class="sort__button ${isActive ? `sort__button--active` : ``}"">${sortType}</a></li>` : ``);
};

const getSortTemplate = (filters) => {
  const sortMarkup = filters.map((it, i) => getSortMarkup(it, i === 0)).join(`\n`);

  return (
    `<ul class="sort">
      ${sortMarkup}
    </ul>`
  );
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return getSortTemplate(this._filters);
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
