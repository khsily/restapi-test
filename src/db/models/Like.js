import Sequelize, { Model } from 'sequelize';
import sequelize from '../sequelize';
import Post from './Post';
import User from './User';

class Like extends Model {
  static async createOrUpdate(params) {
    const { positive, user_id, post_id } = params;
    const like = await this.findOne({ where: { post_id, user_id } });

    if (!like) { // Create new like if not exists
      return await this.create({
        positive,
        user_id,
        post_id,
      });
    } else { // Update like
      return await this.update({ positive }, {
        where: {
          user_id,
          post_id,
        }
      });
    }
  }
}

Like.init(
  {
    like_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    post_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: 'post_id',
      },
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    positive: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
  }
);

export default Like;