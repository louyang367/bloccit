const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/flairs";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

const postQueries = require("../../src/db/queries.posts");
const topicQueries = require("../../src/db/queries.topics");

describe("routes : flairs", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    this.flair;

    sequelize.sync({ force: true }).then((res) => {

      Flair.create({
        name: "Danger!",
        color: "#ff0000"
      })
        .then((flair) => {
          this.flair = flair;

          Topic.create({
            title: "Winter Games",
            description: "Post your Winter Games stories.",
          })
            .then((topic) => {
              this.topic = topic;

              Post.create({
                title: "Snowball Fighting",
                body: "So much snow!",
                topicId: this.topic.id
              })
                .then((post) => {
                  this.post = post;
                  done();
                })
                .catch((err) => {
                  console.log(err);
                  done();
                });
            });
        });
    });
  });

  describe("GET /flairs", () => {
    it("should return a status code 200 and all flairs", (done) => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(err).toBeNull();
        expect(body).toContain("Flairs");
        expect(body).toContain("Danger!");
        done();
      });
    });
  });

  describe("GET /flairs/:id", () => {

    it("should render a view with the selected flair", (done) => {
      request.get(`${base}/${this.flair.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Danger");
        done();
      });
    });

  });

  describe("GET /flairs/new", () => {

    it("should render a new flair form", (done) => {
      request.get(`${base}/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Flair");
        done();
      });
    });

  });

  describe("POST /flairs/create", () => {

    it("should create a new flair and redirect", (done) => {
      const options = {
        url: `${base}/create`,
        form: {
          name: "Warning",
          color: "#ffff00"
        }
      };
      request.post(options,
        (err, res, body) => {

          Flair.findOne({ where: { name: "Warning" } })
            .then((flair) => {
              expect(flair).not.toBeNull();
              expect(flair.name).toBe("Warning");
              expect(flair.color).toBe("#ffff00");
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        }
      );
    });

  });

  describe("POST /flairs/id/destroy", () => {

    it("should delete the flair with the associated ID", (done) => {

      expect(this.flair.id).toBe(1);

      request.post(`${base}/${this.flair.id}/destroy`, (err, res, body) => {
        Flair.findById(1)
          .then((flair) => {
            expect(err).toBeNull();
            expect(flair).toBeNull();
            done();
          })
      });
    });
  });

  describe("GET /flairs/:id/edit", () => {

    it("should render a view with an edit flair form", (done) => {
      request.get(`${base}/${this.flair.id}/edit`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Edit Flair");
        expect(body).toContain("Danger");
        done();
      });
    });
  });

  describe("POST /flairs/:id/update", () => {

    it("should return a status code 302", (done) => {
      request.post({
        url: `${base}/${this.flair.id}/update`,
        form: {
          name: "Extreme Danger",
          color: "#ff0000"
        }
      }, (err, res, body) => {
        expect(res.statusCode).toBe(302);
        done();
      });
    });

    it("should update the flair with the given values", (done) => {
      const options = {
        url: `${base}/${this.flair.id}/update`,
        form: {
          name: "Extreme Danger"
        }
      };
      request.post(options,
        (err, res, body) => {

          expect(err).toBeNull();

          Flair.findOne({
            where: { id: this.flair.id }
          })
            .then((flair) => {
              expect(flair.name).toBe("Extreme Danger");
              done();
            });
        });
    });
  });

  describe("POST /topics/create", () => {

    it("should create a new topic with a flair and redirect", (done) => {
      const options = {
        url: `http://localhost:3000/topics/create`,
        form: {
          title: "blink-182 songs",
          description: "What's your favorite blink-182 song?",
          flairId: this.flair.id
        }
      };
  
      request.post(options,
        (err, res, body) => {
          topicQueries.getTopic(2, (err, topic) => {
            if (err) console.log(err)
            expect(res.statusCode).toBe(303);
            expect(topic.flairId).toBe(this.flair.id);
            expect(topic.flair.color).toBe("#ff0000");
            done();
          })
            .catch((err) => {
              console.log(err);
              done();
            });
        }
      );
    });
  });

  describe("POST /topics/:id/update", () => {

    it("should update the topic with a flair", (done) => {
      const options = {
        url: `http://localhost:3000/topics/${this.topic.id}/update`,
        form: {
          flairId: this.flair.id
        }
      };
      request.post(options,
        (err, res, body) => {
          if (err) console.log(err)
          expect(err).toBeNull();
          topicQueries.getTopic(1, (err, topic) => {
              expect(topic.title).toBe('Winter Games');
              expect(topic.flairId).toBe(this.flair.id);
              expect(topic.flair.color).toBe(this.flair.color);
              done();
            });
        });
    });

  });

  describe("POST /topics/:topicId/posts/create", () => {

    it("should create a new post with a flair", (done) => {
       const options = {
         url: `http://localhost:3000/topics/${this.topic.id}/posts/create`,
         form: {
           title: "Watching snow melt",
           body: "Without a doubt my favoriting things to do besides watching paint dry!",
           flairId: this.flair.id
         }
       };
       request.post(options,
         (err, res, body) => {
          if (err) console.log(err);
           postQueries.getPost(2, (err, post) => {
             expect(post).not.toBeNull();
            expect(post.title).toBe("Watching snow melt");
             expect(post.body).toBe("Without a doubt my favoriting things to do besides watching paint dry!");
             expect(post.topicId).not.toBeNull();
             expect(post.flairId).toBe(this.flair.id);
             expect(post.flair.color).toBe('#ff0000');
             done();
           })
           .catch((err) => {
             console.log(err);
             done();
           });
         }
       );
     });
 
  });

  describe("POST /flairs/id/destroy a flair that's being used", () => {

    it("should not delete a flair if it is being used by a topic (or post)", (done) => {

      const options = {
        url: `http://localhost:3000/topics/${this.topic.id}/update`,
        form: {
          flairId: this.flair.id
        }
      };
      request.post(options, (err, res, body) => {
        if (err) console.log(err)
        expect(err).toBeNull();
        topicQueries.getTopic(this.flair.id, (err, topic) => {
          expect(topic.flairId).toBe(this.flair.id);
          expect(topic.flair.color).toBe('#ff0000');
          done();
        })
        .then( topic=>{
          request.post(`${base}/${this.flair.id}/destroy`, (err, res, body) => {
            //unfortunately no error msg passed back about foreign key constraint
          Flair.findById(this.flair.id)
          .then((flair) => {
            expect(flair.id).toBe(this.flair.id);
            expect(flair.color).toBe('#ff0000');
            done();
            })
          });
        }).catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

describe("GET /topics:id:", () => {
  it("should render the selected topic with its flair and all its posts each with its flair", (done) => {
    const options = {
      url: `${base}/create`,
      form: {
        name: "Warning",
        color: "#ffff00"
      }
    };
    request.post(options,
      (err, res, body) => {
        const options = {
          url: `http://localhost:3000/topics/${this.topic.id}/update`,
          form: {
            flairId: this.flair.id
          }
        };
        request.post(options,
          (err, res, body) => {
            const options = {
              url: `http://localhost:3000/topics/${this.topic.id}/posts/${this.post.id}/update`,
              form: {
               flairId: 2
              }
            };
            request.post(options,
              (err, res, body) => {
                request.get(`http://localhost:3000/topics/${this.topic.id}`, (err, res, body) => {
                  expect(err).toBeNull();
                  expect(body).toContain("Winter Games");
                  expect(body).toContain("Snowball Fighting");
                  expect(body).toContain("Danger!");
                  expect(body).toContain("Warning");
                  done();
            })
          })
        })
      });
    });
  });

})

