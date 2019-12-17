import AbstractComponent from "./abstract-component";

export const SortType = {
  RATING_DOWN: `rating-down`,
  DATE_DOWN: `date-down`,
  DEFAULT: `default`,
};

const getSortTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" data-sort-type="${SortType.DATE_DOWN}" class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type="${SortType.RATING_DOWN}" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export default class Filter extends AbstractComponent {
  constructor() {
    super();
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return getSortTemplate(this._currentSortType);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;

      handler(this._currenSortType);
    });
  }
}
