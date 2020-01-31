export default class CommentsModel {
  constructor(comment) {
    this.id = comment.id;
    this.comment = comment.comment;
    this.author = comment.author;
    this.date = comment.date;
    this.emotion = comment.emotion;
  }

  toRAW() {
    return {
      'comment': this.comment,
      'date': new Date(),
      'emotion': this.emotion
    };
  }

  static parseComment(comment) {
    return new CommentsModel(comment);
  }

  static parseComments(comment) {
    if (!comment) {
      return {};
    } else if (comment.length) {
      return comment.map(CommentsModel.parseComment);
    } else {
      return new CommentsModel(comment);
    }
  }
}
