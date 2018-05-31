'use strict';

module.exports = (sequelize, DataTypes) => {
  var Topics = sequelize.define('Topics', {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});

  Topics.associate = function (models) {
    // associations can be defined here
    Topics.hasMany(models.Banner, {
      foreignKey: "topicId",
      as: "banners",
    });
    topic.hasMany(models.Rule, {
      foreignKey: "topicId",
      as: "rules",
    });
  };
  return Topics;
};