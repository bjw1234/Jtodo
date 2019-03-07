import * as types from './mutation-types';

const mutations = {
  [types.SET_COUNT] (state, count) {
    state.count = count;
  },
  [types.SET_TODOS] (state, todos) {
    state.todos = todos;
  },
  [types.DELETE_TODO] (state, id) {
    let index = state.todos.findIndex(todo => todo.id === id);
    state.todos.splice(index, 1);
  },
  [types.UPDATE_TODO] (state, { id, flag }) {
    let index = state.todos.findIndex(todo => todo.id === id);
    state.todos[index].completed = flag;
  },
  [types.ADD_TODO] (state, todo) {
    state.todos.unshift(todo);
  },
  [types.SET_LOADING_VISIBLE] (state, flag) {
    state.loadingVisible = flag;
  },
  [types.DELETE_COMPLETED] (state, ids) {
    state.todos = state.todos.filter(todo => {
      return ids.every(id => id !== todo.id);
    });
  }
};

export default mutations;
