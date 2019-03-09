<template>
  <section class="real-app">
    <input
      type="text"
      class="add-input"
      autofocus="autofocus"
      placeholder="接下来做什么?"
      @keyup.enter="addTodo"
    >
    <Item
      v-for="todo in filterTodos"
      :key="todo.id"
      :todo="todo"
      @del="deleteTodo"
      @toggle="toggleTodo"
    ></Item>
    <Tabs
      :filter="filter"
      :todos="todos"
      @toggle="toggleFilter"
      @clearAllCompleted="clearAllCompleted"
    ></Tabs>
  </section>
</template>
<script type="text/ecmascript-6">
  import Item from './item.vue';
  import Tabs from './tabs.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    metaInfo: {
      title: 'Todo Page'
    },
    components: {
      Item,
      Tabs
    },
    data () {
      return {
        filter: 'all'
      };
    },
    computed: {
      filterTodos () {
        if (this.filter === 'all') {
          return this.todos;
        }
        const completed = this.filter === 'completed';
        return this.todos.filter(todo => completed === todo.completed);
      },
      ...mapGetters(['todos'])
    },
    asyncData ({ store }) {
      return Promise.resolve(store.dispatch('getTodosAsync'));
    },
    mounted () {
      if (this.todos && this.todos.length < 1) {
        this.getTodosAsync({
          ctx: this
        });
      }
    },
    methods: {
      addTodo (e) {
        if (e.target.value.trim() === '') {
          return;
        }
        this.addTodoAsync({
          ctx: this,
          content: e.target.value.trim()
        });
        e.target.value = '';
      },
      deleteTodo (id) {
        this.deleteTodoAsync({
          ctx: this,
          id
        });
      },
      toggleTodo (todo) {
        this.updateTodoAsync({
          ctx: this,
          id: todo.id,
          flag: !todo.completed
        });
      },
      toggleFilter (state) {
        this.filter = state;
      },
      clearAllCompleted () {
        let ids = [];
        this.todos.forEach(todo => {
          if (todo.completed) {
            ids.push(todo.id);
          }
        });
        this.deleteCompletedAsync({
          ctx: this,
          ids
        });
      },
      ...mapActions(['getTodosAsync', 'deleteTodoAsync', 'addTodoAsync', 'updateTodoAsync', 'deleteCompletedAsync'])
    }
  };
</script>
<style lang="stylus" scoped>
  .real-app
    width 700px
    margin 0 auto
    box-shadow 0 0 5px #666

  .add-input
    position relative
    margin 0
    width 100%
    font-size 24px
    font-family inherit
    font-weight inherit
    line-height 1.4em
    border 0
    outline none
    color inherit
    box-sizing border-box
    font-smoothing antialiased
    padding 16px 16px 16px 36px
    border: none
    box-shadow inset 0 -2px 1px rgba(0, 0, 0, 0.03)
</style>
