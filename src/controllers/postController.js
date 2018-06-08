const postQueries = require("../db/queries.posts.js");
const flairQueries = require("../db/queries.flairs.js");

module.exports = {
  new(req, res, next) {
    flairQueries.getAllFlairs((err, allFlairs) => {
      if (err) console.log(err);
      res.render("posts/new", { topicId: req.params.topicId, allFlairs: allFlairs });
    })
  },

  create(req, res, next) {
    let newPost = {
      title: req.body.title,
      body: req.body.body,
      topicId: req.params.topicId,
      flairId: req.body.flairId == '' ? null : req.body.flairId
    };
    postQueries.addPost(newPost, (err, post) => {
      if (err) {
        res.redirect(500, "/posts/new");
      } else {
        res.redirect(303, `/topics/${newPost.topicId}/posts/${post.id}`);
      }
    });
  },

  show(req, res, next) {
    postQueries.getPost(req.params.id, (err, post) => {
      if (err || post == null) {
        res.redirect(404, "/");
      } else {
        res.render("posts/show", { post });
      }
    });
  },

  destroy(req, res, next) {
    postQueries.deletePost(req.params.id, (err, deletedRecordsCount) => {
      if (err) {
        res.redirect(500, `/topics/${req.params.topicId}/posts/${req.params.id}`)
      } else {
        res.redirect(303, `/topics/${req.params.topicId}`)
      }
    });
  },

  edit(req, res, next) {
    postQueries.getPost(req.params.id, (err, post) => {
      if (err || post == null) {
        res.redirect(404, "/");
      } else {
        flairQueries.getAllFlairs((err, allFlairs) => {
          if (err) console.log(err);
          res.render("posts/edit", { post: post, allFlairs: allFlairs });
        });
      }
    });
  },

  update(req, res, next) {
    postQueries.updatePost(req.params.id, req.body, (err, post) => {
      if (err || post == null) {
        res.redirect(404, `/topics/${req.params.topicId}/posts/${req.params.id}/edit`);
      } else {
        res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}`);
      }
    });
  }

}