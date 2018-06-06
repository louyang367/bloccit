const topicQueries = require("../db/queries.topics.js");
const flairQueries = require("../db/queries.flairs.js");

module.exports = {
  index(req, res, next) {
    topicQueries.getAllTopics((err, topics) => {
      if (err) {
        console.log(err);
        res.redirect(500, "static/index");
      } else {
        res.render("topics/index", { topics });
      }
    })
  },

  new(req, res, next) {
    flairQueries.getAllFlairs((err, allFlairs) => {
      if (err) console.log(err);
      res.render("topics/new", { allFlairs });
    });
  },

  create(req, res, next) {
console.log('in create:req.body=',req.body)    
    let newTopic = {
      title: req.body.title,
      description: req.body.description,
      flairId: req.body.flairId==''?null:req.body.flairId
    };
    topicQueries.addTopic(newTopic, (err, topic) => {
      if (err) {
        res.redirect(500, "/topics/new");
      } else {
        res.redirect(303, `/topics/${topic.id}`);
      }
    });
  },

  show(req, res, next) {
    topicQueries.getTopic(req.params.id, (err, topic) => {
      if (err || topic == null) {
console.log('topic not found: ',err)
        res.redirect(404, "/");
      } else {
console.log('topic.flairId=',topic.flairId)
        res.render("topics/show", { topic });
      }
    });
  },

  destroy(req, res, next) {
    topicQueries.deleteTopic(req.params.id, (err, topic) => {
      if (err) {
        res.redirect(500, `/topics/${topic.id}`)
      } else {
        res.redirect(303, "/topics")
      }
    });
  },

  edit(req, res, next) {
    topicQueries.getTopic(req.params.id, (err, topic) => {
      if (err || topic == null) {
        res.redirect(404, "/");
      } else {
        flairQueries.getAllFlairs((err, allFlairs) => {
          if (err) console.log(err);
          res.render("topics/edit", { topic:topic, allFlairs:allFlairs });
      })
    }
    });
  },

  update(req, res, next) {
    topicQueries.updateTopic(req.params.id, req.body, (err, topic) => {
      if (err || topic == null) {
        res.redirect(404, `/topics/${req.params.id}/edit`);
      } else {
        res.redirect(`/topics/${topic.id}`);
      }
    });
  }

}