<template>
  <div class="passwordDialog">
    <el-dialog
      title="パスワード変更"
      :visible="$store.state.passwordDialogFlg"
      v-on:close="onClose"
      width="40%"
      center>
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules">
        <el-form-item prop="newPassword">
          <el-input type="password" placeholder="新しいパスワード" v-model="passwordForm.newPassword" show-password></el-input>
        </el-form-item>
        <el-form-item prop="newPasswordConfirm">
          <el-input type="password" placeholder="上と同じパスワードをもう一度入力してください。" v-model="passwordForm.newPasswordConfirm" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="changePassword" icon="el-icon-edit">登録</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Constant from '@/constant.js'
import MessageUtil from '@/MessageUtil.js'
const axios = require('axios')

export default {
  name: 'PasswordDialog',
  props: {
    passwordDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      passwordForm: {
        newPassword: '',
        newPasswordConfirm: ''
      },
      passwordRules: {
        newPassword: [
          {required: true, message: 'パスワードが未入力です。', trigger: 'blur'}
        ],
        newPasswordConfirm: [
          {required: true, message: 'パスワードが未入力です。', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // パスワード変更
    changePassword: function() {
      this.$refs['passwordForm'].validate((valid) => {
        if (valid) {
          if (this.passwordForm.newPassword != this.passwordForm.newPasswordConfirm) {
            this.$message(MessageUtil.MSG_ERROR_PASSWORD_CHANGE());
          } else {
            let userObj = {
              id: this.$store.state.user.id,
              password: this.passwordForm.newPassword
            }
            // パスワード変更処理
            axios.post(Constant.URL_USER_CHANGEPASSWORD, userObj).then(() => {
              this.$message(MessageUtil.MSG_SUCCESS_REGIST());
              this.$store.commit('switchPasswordDialogFlg', false)
            }).catch(() => {
              this.$message(MessageUtil.MSG_ERROR_REGIST());
            })
          }
        }
      })
    },
    // ダイアログを閉じたとき
    onClose: function() {
      this.$refs['passwordForm'].resetFields();
      // vuexにフラグを持たせると:visible.syncは効果がないので、手動でフラグを落とす。
      this.$store.commit('switchPasswordDialogFlg', false)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
