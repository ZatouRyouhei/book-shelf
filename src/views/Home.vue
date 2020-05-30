<template>
  <div class="container">
    <div class="home">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="userid">
          <el-input type="text" size="large" v-model="form.userid" placeholder="ID"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            type="password" 
            size="large" 
            v-model="form.password" 
            show-password 
            placeholder="パスワード" 
            v-on:keyup.enter.native="login">
          </el-input>
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
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  background: url('../assets/logo.png') 20% 20% no-repeat;
  background-size: 400px 400px;
}

.home {
  position: absolute;
  width: 20%;
  top: 30%;
  left: 38%;
}
</style>