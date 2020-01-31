import AbstractComponent from "./abstract-component";

const getBoardTemplate = () => {
  return `<section class="films"></section>`;
};

export default class Board extends AbstractComponent {
  getTemplate() {
    return getBoardTemplate();
  }
}
