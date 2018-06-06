'use strict';

module.exports = (sequelize, DataTypes) => {
  var Topic = sequelize.define('Topic', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    flairName: {
      type: DataTypes.STRING
    }
  }, {});

  Topic.associate = function (models) {
    Topic.hasMany(models.Post, {
      foreignKey: "topicId",
      as: "posts"
    });
    Topic.belongsTo(models.Flair, {
      foreignKey: "flairName"//,
      //as: "flairName"
    });
  };
  return Topic;
};