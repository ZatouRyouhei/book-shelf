<template>
  <div class="container">
    <div class="home">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="userid">
          <el-input type="text" size="large" v-model="form.userid" placeholder="ID"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" size="large" v-model="form.password" show-password placeholder="パスワード" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="login" icon="el-icon-switch-button">ログイン</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Constant from '@/constant.js'
import MessageUtil from '@/MessageUtil.js'
const axios = require('axios')

export default {
  name: 'Home',
  data: function() {
    return {
      form: {
        userid: '',
        password: ''
      },
      rules: {
        userid: [
          {required: true, message: 'IDが未入力です。', trigger: 'blur'}
        ],
        password: [
          {required: true, message: 'パスワードが未入力です。', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    login: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let loginObj = {
            id: this.form.userid,
            password: this.form.password
          }
          axios.post(Constant.URL_USER_LOGIN, loginObj).then((res) => {
            this.$store.commit('setUser', {
              id: res.data.id,
              name: res.data.name,
              roleName: res.data.roleName
            })
            this.$router.push('/about')
          }).catch(() => {
            this.$message(MessageUtil.MSG_ERROR_LOGIN());
          })
        }
      })
    }
  },
  created: function() {
    // ストアの内容を初期化
    this.$store.commit('clearState')
  }
}
</script>

<style scoped>
.container {
  width: 100vh;
  height: 80vh;
  margin: 0;
  padding: 0;
  background-image: url('../assets/logo.png');
  background-position: right 50% top 20%;
	background-repeat: no-repeat;
	background-size: 40% auto;
}
.home {
  position: absolute;          /* 位置指定 */
  padding: 20px;               /* 余白指定 */
  top:  0;                     /* 位置指定 */
  bottom:  0;                  /* 位置指定 */
  left:  0;                    /* 位置指定 */
  right:  0;                   /* 位置指定 */
  margin:  auto;               /* 中央寄せ */
  width:  30%;               /* 幅指定 */
  height: 50%;                /* 高さ指定 */
  
}
</style>