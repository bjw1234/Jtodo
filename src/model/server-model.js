import config from '../../app.config';
import createDb from '../../server/db/db';

// 让全局使用db，可以用一个中间件
const db = createDb(config.db.appID, config.db.appKey);

export default {
  getAllTodos () {
    return db.getAllTodos();
  }
};
