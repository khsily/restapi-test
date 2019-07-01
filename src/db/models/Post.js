import Sequelize, { Model } from 'sequelize';
import sequelize from '../sequelize';
import User from './User';
import Like from './Like';

class Post extends Model {
  static findWithLikeCount(options) {
    return this.findAll({
      attributes: [
        'post_id',
        'title',
        'content',
        [sequelize.fn('COUNT', sequelize.col('like_id')), 'like_count']
      ],
      include: [{
        model: Like,
        attributes: [],
        where: { positive: true },
        required: false,
      }],
      group: 'Post.post_id',
      subQuery: false,
      ...options,
    });
  }
}

Post.init(
  {
    post_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
  }
);

export default Post;