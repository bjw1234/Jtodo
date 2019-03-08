/***
 * 用于访问云端数据库
 * var appKey
 * SHA1（应用ID + 'UZ' + 应用KEY +'UZ' + 当前时间毫秒数）+ '.' +当前时间毫秒数
 */
const sha1 = require('sha1');
const axios = require('axios');

// 数据存储命名空间
const className = 'todo';

const request = axios.create({
  baseURL: 'https://d.apicloud.com/mcm/api'
});

const createError = (code, resp) => {
  const error = new Error(resp.message);
  error.code = code;
  return error;
};

const handleRequest = ({ status, data, ...rest }) => {
  if (status === 200) {
    return data;
  } else {
    throw createError(status, rest);
  }
};

module.exports = (appID, appKey) => {
  const getHeaders = () => {
    let date = Date.now();
    return {
      'X-APICloud-AppId': appID,
      'Content-Type': 'application/json',
      'X-APICloud-AppKey': `${sha1(`${appID}UZ${appKey}UZ${date}`)}.${date}`
    };
  };
  return {
    async getAllTodos () {
      try {
        return handleRequest(await request.get(
          `/${className}`,
          { headers: getHeaders() }
        ));
      } catch (e) {
        console.log('网络错误.');
        return null;
      }
    },
    async addTodo (todo) {
      try {
        return handleRequest(await request.post(
          `/${className}`,
          todo,
          { headers: getHeaders() }
        ));
      } catch (e) {
        console.log('网络错误.');
        return null;
      }
    },
    async updateTodo (id, todo) {
      try {
        return handleRequest(await request.put(
          `/${className}/${id}`,
          todo,
          { headers: getHeaders() }
        ));
      } catch (e) {
        console.log('网络错误.');
        return null;
      }
    },
    async deleteTodo (id) {
      try {
        return handleRequest(await request.delete(
          `/${className}/${id}`,
          { headers: getHeaders() }
        ));
      } catch (e) {
        console.log('网络错误.');
        return null;
      }
    },
    async deleteCompleted (ids) { // 根据ID批量操作（删除）
      try {
        const requests = ids.map(id => {
          return {
            'method': 'DELETE',
            'path': `/mcm/api/${className}/${id}`
          };
        });
        return handleRequest(await request.post(
          '/batch',
          { requests },
          { headers: getHeaders() }
        ));
      } catch (e) {
        console.log('网络错误.');
        return null;
      }
    }
  };
};
