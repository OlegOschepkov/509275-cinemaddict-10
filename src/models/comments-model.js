// import FilmModel from "./film-model";

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
      // 'id': 11111111,
      'comment': this.comment,
      // 'author': `guest`,
      'date': new Date(),
      'emotion': this.emotion
    };
  }

  static parseComment(comment) {
    return new CommentsModel(comment);
  }

  static parseComments(comment) {
    // console.log(data.map(CommentsModel.parseComment))
    if (!comment) {
      return {};
    } else if (comment.length) {
      return comment.map(CommentsModel.parseComment);
    } else {
      return new CommentsModel(comment);
    }
  }
}
