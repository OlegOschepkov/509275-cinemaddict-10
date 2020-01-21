// import FilmModel from "./film-model";

export default class CommentsModel {
  constructor(data) {
    this.id = data.id;
    this.comment = data.comment;
    this.author = data.author;
    this.date = data.date;
    this.emotion = data.emotion;
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

  static parseComment(data) {
    return new CommentsModel(data);
  }

  static parseComments(data) {
    // console.log(data.map(CommentsModel.parseComment))
    if (data.length) {
      return data.map(CommentsModel.parseComment);
    } else {
      return new CommentsModel(data);
    }
  }
}
