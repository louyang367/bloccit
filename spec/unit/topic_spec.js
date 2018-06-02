const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topics;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {
  beforeEach((done) => {
    this.topic;
    sequelize.sync({ force: true }).then((res) => {
      Topic.create({
        title: "Expeditions to Alpha Centauri",
        description: "A compilation of reports from recent visits to the star system."
      })
        .then((topic) => {
          this.topic = topic;
          Post.bulkCreate([{
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            topicId: this.topic.id
          }, {
            title: "transmitter",
            body: "You can't bypass the circuit without backing up the multi-byte USB alarm!",
            topicId: this.topic.id
          }])
            .then((posts) => {
              done();
            });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });

  });

  describe("#create()", () => {

    it("should create a Topic object with a title, body", (done) => {
      Topic.create({
        title: "Pros of Cryosleep during the long journey",
        body: "1. Not having to answer the 'are we there yet?' question.",
      })
        .then((topic) => {
          expect(topic.title).toBe("Pros of Cryosleep during the long journey");
          expect(topic.body).toBe("1. Not having to answer the 'are we there yet?' question.");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });

    it("should not create a topic with missing title or body", (done) => {
      Topic.create({
        title: "Pros of Cryosleep during the long journey"
      })
        .catch((err) => {
          expect(err.message).toContain("Topics.description cannot be null");
          done();
        })
    });

  });

  describe("#getPosts()", () => {

    it("should return the associated posts", (done) => {
      this.topic.getPosts()
        .then((associatedPosts) => {
          expect(associatedPosts.length).toBe(2);
          expect(associatedPosts[0].title).toBe("My first visit to Proxima Centauri b");
          expect(associatedPosts[1].title).toBe("transmitter");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });

    });

  });
});