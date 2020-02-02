import AbstractComponent from "./abstract-component";

const getLoadMoreBtnTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class LoadMoreButton extends AbstractComponent {
  getTemplate() {
    return getLoadMoreBtnTemplate();
  }

  onClick(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
