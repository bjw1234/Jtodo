import * as types from './mutation-types';
import model from 'model'; // 服务端和客户端渲染时用的model不一样，本质上都是向远程服务器请求数据

// 处理异步修改
export const setCountAsync = (store, count) => {
  setTimeout(() => {
    store.commit(types.SET_COUNT, count);
  }, 2000);
};

function handleError (ctx, e) {
  window.e = e;
  if (e.request.status === 401) {
    ctx.$notify({
      autoCloseTime: 3000,
      content: '你先登录咯'
    });
    ctx.$router.replace('/login');
    return;
  }
  ctx.$notify({
    autoCloseTime: 3000,
    content: '不知名错误.'
  });
}

// 显示logo信息
function showLogo (ctx, resp) {
  ctx.$notify({
    autoCloseTime: 3000,
    content: resp
  });
}

/**
 * 在这块处理网络操作，
 * 如果网络操作成功，则修改store中的数据
 * @param store
 * @param ctx
 */
export const getTodosAsync = async (store, { ctx } = {}) => {
  try {
    let resp = await model.getAllTodos();
    if (!ctx) { // 服务端渲染情况
      store.commit(types.SET_TODOS, resp.reverse());
      return resp;
    }
    if (resp.data.error) {
      showLogo(ctx, resp.data.data);
      store.commit(types.SET_LOADING_VISIBLE, false);
      return;
    }
    showLogo(ctx, '获取数据成功.');
    store.commit(types.SET_TODOS, resp.data.data.reverse());
  } catch (e) {
    console.log('在这里吗');
    ctx && handleError(ctx, e);
  }
};

/**
 * 删除一条todo
 * @param store
 * @param ctx
 * @param id
 * @return {Promise.<void>}
 */
export const deleteTodoAsync = async (store, { ctx, id }) => {
  try {
    store.commit(types.SET_LOADING_VISIBLE, true);
    let resp = await model.deleteTodo(id);
    if (resp.data.error) {
      showLogo(ctx, resp.data.data);
      store.commit(types.SET_LOADING_VISIBLE, false);
      return;
    }
    showLogo(ctx, '少做一件事情.');
    store.commit(types.SET_LOADING_VISIBLE, false);
    store.commit(types.DELETE_TODO, id);
  } catch (e) {
    store.commit(types.SET_LOADING_VISIBLE, false);
    handleError(ctx, e);
  }
};

/**
 * 添加一条todo
 * @param store
 * @param ctx
 * @param content
 * @return {Promise.<void>}
 */
export const addTodoAsync = async (store, { ctx, content }) => {
  try {
    store.commit(types.SET_LOADING_VISIBLE, true);
    let resp = await model.addTodo(content);
    if (resp.data.error) {
      showLogo(ctx, resp.data.data);
      store.commit(types.SET_LOADING_VISIBLE, false);
      return;
    }
    showLogo(ctx, '你得多做一件事情咯.');
    store.commit(types.SET_LOADING_VISIBLE, false);
    store.commit(types.ADD_TODO, resp.data.data);
  } catch (e) {
    store.commit(types.SET_LOADING_VISIBLE, false);
    handleError(ctx, e);
  }
};

/**
 * 更新一条todo
 * @param store
 * @param ctx
 * @param id
 * @param flag
 * @return {Promise.<void>}
 */
export const updateTodoAsync = async (store, { ctx, id, flag }) => {
  try {
    store.commit(types.SET_LOADING_VISIBLE, true);
    let resp = await model.updateTodo(id, flag);
    if (resp.data.error) {
      showLogo(ctx, resp.data.data);
      store.commit(types.SET_LOADING_VISIBLE, false);
      return;
    }
    showLogo(ctx, '更新todo状态.');
    store.commit(types.SET_LOADING_VISIBLE, false);
    store.commit(types.UPDATE_TODO, { id, flag });
  } catch (e) {
    store.commit(types.SET_LOADING_VISIBLE, false);
    handleError(ctx, e);
  }
};

/**
 * 删除所有已经完成的todo
 * @param store
 * @param ctx
 * @param ids
 * @return {Promise.<void>}
 */
export const deleteCompletedAsync = async (store, { ctx, ids }) => {
  try {
    store.commit(types.SET_LOADING_VISIBLE, true);
    let resp = await model.deleteCompleted(ids);
    if (resp.data.error) {
      showLogo(ctx, resp.data.data);
      store.commit(types.SET_LOADING_VISIBLE, false);
      return;
    }
    showLogo(ctx, '删除已完成的todo.');
    store.commit(types.SET_LOADING_VISIBLE, false);
    store.commit(types.DELETE_COMPLETED, ids);
  } catch (e) {
    store.commit(types.SET_LOADING_VISIBLE, false);
    handleError(ctx, e);
  }
};
