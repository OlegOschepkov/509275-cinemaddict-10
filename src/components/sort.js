import AbstractComponent from "./abstract-component";

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

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return getSortTemplate(this._filters);
  }
}
