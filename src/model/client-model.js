import axios from 'axios';

export default {
  /**
   * 用户登录
   * @param username
   * @param password
   * @return {*}
   */
  login (username, password) {
    return axios.post('/user/login', {
      username,
      password
    });
  },

  /**
   * 获取所有的todos
   * @return {*}
   */
  getAllTodos () {
    return axios.get('/api/todos');
  },

  /**
   * 删除一条todo
   * @param id
   * @return {*}
   */
  deleteTodo (id) {
    return axios.delete(`/api/todo/${id}`);
  },

  /**
   * 添加一条todo
   * @param content
   * @return {*}
   */
  addTodo (content) {
    return axios.post('/api/todo', {
      content: content,
      completed: false
    });
  },

  /**
   * 更新一条todo的状态
   * @param id
   * @param flag
   * @return {*}
   */
  updateTodo (id, flag) {
    return axios.put(`/api/todo/${id}`, {
      completed: flag
    });
  },

  /**
   * 批量操作
   * 删除所有完成的todos
   * @param ids
   * @return {*}
   */
  deleteCompleted (ids) {
    return axios.post('/api/delete/completed', { ids });
  }
};
