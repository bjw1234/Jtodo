<template>
  <form
    id="login"
    @submit="loginSubmit"
  >
    <h1 class="title">
      <span>Login</span>
      <span
        v-show="errormsg"
        class="error-msg"
      >
        {{ errormsg }}
      </span>
    </h1>
    <input
      v-model="username"
      type="text"
      class="login-input"
      placeholder="User Name"
    >
    <input
      v-model="password"
      type="password"
      class="login-input"
      autocomplete="new-password"
      placeholder="Pass Word"
    >
    <button
      type="submit"
      class="login-btn"
    >
      登 录
    </button>
  </form>
</template>

<script type="text/ecmascript-6">
  import { login } from '../../common/js/request';
  import * as types from '../../store/mutation-types';
  import { mapMutations } from 'vuex';

  const ERROR_OK = 0;

  export default {
    metaInfo: {
      title: 'Login Page'
    },
    data () {
      return {
        username: '',
        password: '',
        errormsg: ''
      };
    },
    methods: {
      loginSubmit (e) {
        e.preventDefault();
        if (this.validate()) {
          this.setLoadingVisible(true);
          login(this.username.trim(), this.password.trim()).then(res => {
            // 模拟登录延时
            setTimeout(() => {
              this.setLoadingVisible(false);
            }, 1000);
            if (res.data.error === ERROR_OK) {
              // 页面跳转
              this.username = '';
              this.password = '';
              this.$router.replace('/todo');
              this.$notify({
                autoCloseTime: 3000,
                content: '登录成功啦！'
              });
            } else {
              // 错误提醒
              this.errormsg = res.data.data.message;
              this.$notify({
                autoCloseTime: 3000,
                content: '用户名或密码错误！'
              });
            }
          });
        }
      },
      validate () {
        if (!this.username.trim()) {
          this.errormsg = '用户名不能为空！';
          return false;
        }
        if (!this.password.trim()) {
          this.errormsg = '密码不能为空！';
          return false;
        }
        this.errormsg = '';
        return true;
      },
      ...mapMutations({
        setLoadingVisible: types.SET_LOADING_VISIBLE
      })
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #login
    display: flex
    width: 450px
    height: 250px
    margin: 0 auto
    background: #ffffff
    flex-direction: column
    justify-content: space-around
    padding: 10px 30px
    box-sizing: border-box
    .title
      margin 5px 0
      .error-msg
        color: red
        font-size: 14px
        font-weight: normal
    .login-input
      height: 25px
      padding-left: 10px
      border: 1px solid #eee
    .login-btn
      color: #ffffff
      background: #37a4ff
      border: none
      font-size: 14px
      padding: 8px 0
      cursor: pointer
</style>
