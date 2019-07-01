/**
 * 참고:
 * @link http://docs.sequelizejs.com/manual/models-definition.html#configuration
 */

import User from './User';
import Post from './Post';
import Like from './Like';

Post.hasMany(Like, { foreignKey: 'post_id' });
Like.belongsTo(Post, { foreignKey: 'post_id' });

export {
  User,
  Post,
  Like,
}