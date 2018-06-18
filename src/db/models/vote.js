'use strict';
module.exports = (sequelize, DataTypes) => {
  var Vote = sequelize.define("Vote", {
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[-1, 1]]
      }
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,  
      unique: 'oneVotePerUserPost'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'oneVotePerUserPost'
    }
  }, {});

  Vote.associate = function(models) {

    Vote.belongsTo(models.Post, {
      foreignKey: "postId",
      onDelete: "CASCADE"
    });

    Vote.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };
  return Vote;
};
