const Topic = require("./models").Topic;
const Post = require("./models").Post;
const Flair = require("./models").Flair;

module.exports = {
  getAllTopics(callback) {
    return Topic.all({
      include: [{
        model: Flair,
        as: "flair"
      }]
    })
      .then((topics) => {
        callback(null, topics);
      })
      .catch((err) => {
        callback(err);
      })
  },

  addTopic(newTopic, callback) {
    return Topic.create({
      title: newTopic.title,
      description: newTopic.description,
      flairId: newTopic.flairId
    })
      .then((topic) => {
        callback(null, topic);
      })
      .catch((err) => {
        callback(err);
      })
  },

  getTopic(id, callback) {
    return Topic.findById(id, {
      include: [{
        model: Flair,
        as: "flair"
      }]
    })
      .then((topic) => {
        callback(null, topic);
      })
      .catch((err) => {
        callback(err);
      })
  },

  deleteTopic(id, callback) {
    return Topic.destroy({
      where: { id }
    })
      .then((topic) => {
        callback(null, topic);
      })
      .catch((err) => {
        callback(err);
      })
  },

  updateTopic(id, updatedTopic, callback) {
    return Topic.findById(id)
      .then((topic) => {
        if (!topic) {
          return callback("Topic not found");
        }
        if (updatedTopic.flairId === '') updatedTopic.flairId = null;
        topic.update(updatedTopic, {
          fields: Object.keys(updatedTopic)
        })
          .then((topic) => {
            callback(null, topic);
          })
          .catch((err) => {
            console.log('after updateTopic, error: ', err)
            callback(err);
          });
      });
  }

}