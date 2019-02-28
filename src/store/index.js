import Vuex from 'vuex';
import state from './state';
import mutations from './mutations';
import * as getters from './getters';
import * as actions from './actions';
import createLogger from 'vuex/dist/logger';

const debug = process.env.NODE_ENV === 'development';

export default () => {
  const store = new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    plugins: debug ? [createLogger()] : [],
    strict: debug
  });

  // 添加热更替的代码
  if (module.hot) {
    module.hot.accept([
      './state',
      './mutations',
      './getters',
      './actions'
    ], () => {
      const newState = require('./state').default;
      const newMutations = require('./mutations').default;
      const newGetters = require('./getters').default;
      const newActions = require('./actions').default;

      console.log(store.hotUpdate);
      store.hotUpdate({
        state: newState,
        mutations: newMutations,
        getters: newGetters,
        actions: newActions
      });
    });
  }

  return store;
}
