export default class CommentsModel {
  constructor(data) {
    this.id = data.id;
    this.text = data.comment;
    this.author = data.author;
    this.date = data.date;
    this.emoji = data.emotion;
  }

  static parseComment(data) {
    return new CommentsModel(data);
  }

  parseComments(data) {
    return data.map(CommentsModel.parseComment);
  }
}
