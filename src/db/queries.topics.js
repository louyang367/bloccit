const topic = require("./models").topic;
module.exports = {

    getAllTopics(callback) {
        return topic.all()
            .then((topics) => {
                callback(null, topics);
            })
            .catch((err) => {
                callback(err);
            })
    }
}