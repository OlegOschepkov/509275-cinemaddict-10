import AbstractComponent from './abstract-component';

const getBoardTemplate = () => `<section class="films"></section>`;

export default class Board extends AbstractComponent {
  getTemplate() {
    return getBoardTemplate();
  }
}
