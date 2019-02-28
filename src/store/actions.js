import * as types from './mutation-types';

// 处理异步修改
export const setCountAsync = (store, count) => {
  setTimeout(() => {
    store.commit(types.SET_COUNT, count);
  }, 2000);
};
