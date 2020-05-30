<template>
  <div class="user">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="id">
        <el-input type="text" v-model="form.id" :disabled="editFlg" placeholder="ID"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input type="text" v-model="form.name" placeholder="氏名"></el-input>
      </el-form-item>
      <el-form-item prop="role">
        <el-select v-model="form.role" placeholder="権限">
          <el-option label="一般" value="USER"></el-option>
          <el-option label="管理" value="ADMIN"></el-option>
        </el-select>
      </el-form-item>

      <el-row>
        <el-col :span="8" class="btnCol">
          <el-form-item>
            <el-button type="primary" icon="el-icon-edit" v-on:click="regist">登録</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="btnCol">
          <el-popconfirm
            confirmButtonText='はい'
            cancelButtonText='いいえ'
            icon="el-icon-info"
            iconColor="red"
            title="修正中の内容は破棄されますがよろしいですか？"
            v-on:onConfirm="clear">
            <el-button type="info" slot="reference" icon="el-icon-tickets">クリア</el-button>
          </el-popconfirm>
        </el-col>
        <el-col :span="8" class="btnCol">
          <el-popconfirm
            confirmButtonText='はい'
            cancelButtonText='いいえ'
            icon="el-icon-info"
            iconColor="red"
            title="削除してよろしいですか？"
            v-on:onConfirm="remove">
            <el-button type="danger" slot="reference" icon="el-icon-delete" :disabled="!editFlg">
              削除
            </el-button>
          </el-popconfirm>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="userList"
      :data="userList"
      stripe
      height="100%"
      highlight-current-row
      @current-change="rowClick">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="氏名"></el-table-column>
      <el-table-column prop="roleName" label="権限" v-bind:formatter="formatRoleName"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import Constant from '@/constant.js'
import MessageUtil from '@/MessageUtil.js'
const axios = require('axios')

export default {
  name: 'User',
  data: function() {
    return {
      userList: [],
      editFlg: false,
      form: {
        id: '',
        name: '',
        role: ''
      },
      rules: {
        id: [
          {required: true, message: 'IDが未入力です。', trigger: 'blur'},
          {max: 20, message: '20文字以内で入力してください。', trigger: 'blur'},
          {pattern: /^[0-9a-zA-Z]+$/, message: '英数字を入力してください。', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '氏名が未入力です。', trigger: 'blur'},
          {max: 20, message: '20文字以内で入力してください。', trigger: 'blur'}
        ],
        role: [
          {required: true, message: '権限が未入力です。', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    rowClick: function(item) {
      if (item) {
        this.$refs['form'].resetFields();
        this.form.id = item.id
        this.form.name = item.name
        this.form.role = item.roleName
        // 編集状態とする。
        this.editFlg = true
      }
    },
    regist: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // オブジェクト生成
          let obj = {
            id: this.form.id,
            name: this.form.name,
            roleName: this.form.role
          }
          axios.post(Constant.URL_USER_REGIST, obj).then(() => {
            // 再検索処理
            this.search()
            this.$message(MessageUtil.MSG_SUCCESS_REGIST())
          })
        }
      })
    },
    clear: function() {
      // フォームに空をセットするだけだとvalidateが動いてしまうので以下のようにする。
      this.$refs['form'].resetFields();
      // 選択状態を解除する。
      this.$refs.userList.setCurrentRow()
      // 編集状態を解除
      this.editFlg = false
    },
    remove: function() {
      axios.delete(Constant.URL_USER_DELETE + this.form.id).then((res) => {
        // 入力欄クリア処理
        this.clear()
        // 再検索処理
        this.search()

        if (res.data == 0) {
          // 使用されているため削除不可
          this.$message(MessageUtil.MSG_ERROR_DELETE_IN_USE())
        } else {
          // 正常終了
          this.$message(MessageUtil.MSG_SUCCESS_DELETE())
        }
      }).catch(() => {
        // その他エラー
        this.$message(MessageUtil.MSG_ERROR_DELETE())
      })
    },
    search: function() {
      this.userList = []
      axios.get(Constant.URL_USER_GETLIST).then((res) => {
        res.data.forEach((user) => {
          this.userList.push({
            id: user.id,
            name: user.name,
            roleName: user.roleName
          })
        })
      })
    },
    formatRoleName: function(row, column, cellValue, index) { // eslint-disable-line
      let dispRoleName = ''
      switch (cellValue) {
        case "ADMIN":
          dispRoleName = "管理"
          break;
        case "USER":
          dispRoleName = "一般"
          break;
        default:
          break;
      }
      return dispRoleName
    }
  },
  created: function() {
    this.search()
  }
}
</script>

<style scoped>
.user {
  width: 60%;
  height: 50vh;
  margin: 30px;
}

.btnCol {
  text-align: center;
}
</style>