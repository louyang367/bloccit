const Topics = require("./models").Topics;

module.exports = {
  getAllTopics(callback) {
    return Topics.all()
      .then((topics) => {
        callback(null, topics);
      })
      .catch((err) => {
        callback(err);
      })
  },

  addTopic(newTopic, callback) {
    return Topics.create({
      title: newTopic.title,
      description: newTopic.description
    })
      .then((topic) => {
        callback(null, topic);
      })
      .catch((err) => {
        callback(err);
      })
  },

  getTopic(id, callback) {
    return Topics.findById(id)
      .then((topic) => {
        callback(null, topic);
      })
      .catch((err) => {
        callback(err);
      })
  },

  deleteTopic(id, callback) {
    return Topics.destroy({
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
    return Topics.findById(id)
      .then((topic) => {
        if (!topic) {
          return callback("Topic not found");
        }

        topic.update(updatedTopic, {
          fields: Object.keys(updatedTopic)
        })
          .then(() => {
            callback(null, topic);
          })
          .catch((err) => {
            callback(err);
          });
      });
  }

}