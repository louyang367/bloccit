const Topic = require("./models").Topic;
const Post = require("./models").Post;
const Flair = require("./models").Flair;

module.exports = {
  getAllFlairs(callback) {
    return Flair.all()
      .then((flairs) => {
        callback(null, flairs);
      })
      .catch((err) => {
        callback(err);
      })
  },

  addFlair(newFlair, callback) {
    return Flair.create({
      name: newFlair.name,
      color: newFlair.color
    })
      .then((flair) => {
        callback(null, flair);
      })
      .catch((err) => {
        callback(err);
      })
  },

  getFlair(name, callback) {
    return Flair.findById(name, {
      include: [{
        model: Post,
        as: "posts"
      },
      {
        model: Topic,
        as: "topics"
      }]
    })
      .then((flair) => {
        callback(null, flair);
      })
      .catch((err) => {
        callback(err);
      })
  },

  deleteFlair(id, callback) {
    return Flair.destroy({
      where: { id }
    })
      .then((flair) => {
        callback(null, flair);
      })
      .catch((err) => {
        callback(err);
      })
  },

  updateFlair(id, updatedFlair, callback) {
    return Flair.findById(id)
      .then((flair) => {
        if (!flair) {
          return callback("Flair not found");
        }
console.log('updatedFlair.name, updatedFlair.color= ',updatedFlair.name, updatedFlair.color)
        flair.update(updatedFlair, {
          fields: Object.keys(updatedFlair)
        })
          .then(() => {
            callback(null, updatedFlair);
          })
          .catch((err) => {
            callback(err);
          });
      });
  }

}