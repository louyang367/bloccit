'use strict';
module.exports = (sequelize, DataTypes) => {
  var Flair = sequelize.define('Flair', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false
    },

  }, {});
  
  Flair.associate = function(models) {
    Flair.hasMany(models.Topic, {
      foreignKey: "flairName",
      as: "topics"
    });
    Flair.hasMany(models.Post, {
      foreignKey: "flairName",
      as: "posts"
    });
  };
  return Flair;
};