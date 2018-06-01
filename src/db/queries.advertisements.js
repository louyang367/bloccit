const Advertisements = require("./models").Advertisement;

module.exports = {
  getAllAdvertisements(callback) {
    return Advertisements.all()
      .then((advertisements) => {
        callback(null, advertisements);
      })
      .catch((err) => {
        callback(err);
      })
  },

  addAdvertisement(newAdvertisement, callback) {
    return Advertisements.create({
      title: newAdvertisement.title,
      description: newAdvertisement.description
    })
      .then((advertisement) => {
        callback(null, advertisement);
      })
      .catch((err) => {
        callback(err);
      })
  },

  getAdvertisement(id, callback) {
    return Advertisements.findById(id)
      .then((advertisement) => {
        callback(null, advertisement);
      })
      .catch((err) => {
        callback(err);
      })
  },

  deleteAdvertisement(id, callback) {
    return Advertisements.destroy({
      where: { id }
    })
      .then((advertisement) => {
        callback(null, advertisement);
      })
      .catch((err) => {
        callback(err);
      })
  },

  updateAdvertisement(id, updatedAdvertisement, callback) {
    return Advertisements.findById(id)
      .then((advertisement) => {
        if (!advertisement) {
          return callback("Advertisement not found");
        }

        advertisement.update(updatedAdvertisement, {
          fields: Object.keys(updatedAdvertisement)
        })
          .then(() => {
            callback(null, advertisement);
          })
          .catch((err) => {
            callback(err);
          });
      });
  }

}