'use strict';

module.exports = (sequelize, DataTypes) => {
  var topic = sequelize.define('topic', {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  topic.associate = function (models) {
    // associations can be defined here
    topic.hasMany(models.Banner, {
      foreignKey: "topicId",
      as: "banners",
    });
  };
  return topic;
};