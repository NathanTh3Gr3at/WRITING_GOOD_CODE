const db = require("../data/database");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

class Post {
  constructor(title, content, id) {
    this.title = title;
    this.content = content;
    if (id) {
      this.id = new ObjectId(id);
    }
  }

  async fetch() {
    if (!this.id) {
      return;
    }

    const postDocument = await db
      .getDb()
      .collection("posts".findOne({ _id: this.id }));
    this.title = postDocument.title;
    this.content = postDocument.content;
  }
  static async fetchAll() {
    const posts = await db.getDb().collection("posts").find().toArray();
    return posts;
  }
  async save() {
    let result;
    if (this.id) {
      result = await db
        .getDb()
        .collection("posts")
        .updateOne(
          { _id: this.id },
          { $set: { title: this.title, content: this.content } }
        );
    } else {
      result = await db.getDb().collection("posts").insertOne({
        title: this.title,
        content: this.content,
      });
    }

    return result;
  }
  async delete() {
    if (!this.id) {
      return;
    }
    const result = await db
      .getDb()
      .collection("posts")
      .deleteOne({ _id: this.id });
    return result;
  }
}
module.exports = Post;
