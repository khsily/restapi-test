import Sequelize, { Model } from 'sequelize';
import sequelize from '../sequelize';

class User extends Model {
  // user info without password
  get info() {
    const data = { ...this.dataValues };
    delete data.password;
    return data;
  }
}

User.init(
  {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    nickname: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    joined: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
  }
);

export default User;