// import FilmModel from "./film-model";

export default class CommentsModel {
  constructor(data) {
    this.id = data.id;
    this.text = data.comment;
    this.author = data.author;
    this.date = data.date;
    this.emoji = data.emotion;
  }

  toRAW() {
    return {
      // 'id': 11111111,
      'comment': this.text,
      // 'author': `guest`,
      'date': new Date(),
      'emotion': this.emoji
    };
  }

  // addComment(comment, id) {
  //   return this._load({
  //     url: `comments/${id.id}`,
  //     method: Method.PUT,
  //     body: JSON.stringify(CommentsModel.toRAW()),
  //     headers: new Headers({'Content-Type': `application/json`})
  //   })
  //     .then((response) => response.json())
  //     .then(FilmModel.parseFilm);
  // }
  //
  // deleteComment(id) {
  //   return this._load({url: `comments/${id}`, method: Method.DELETE});
  // }

  static parseComment(data) {
    return new CommentsModel(data);
  }

  static parseComments(data) {
    // console.log(data)
    if (data.length) {
      return data.map(CommentsModel.parseComment);
    } else {
      // console.log([].push(data))
      return new CommentsModel(data);
    }
  }
}
