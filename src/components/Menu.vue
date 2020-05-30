<template>
  <div class="menu">
    <el-dropdown>
      <i class="user-icon el-icon-user-solid"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item disabled>{{$store.state.user.name}}さん</el-dropdown-item>
        <el-dropdown-item v-on:click.native="passwordDialogOpen">パスワード変更</el-dropdown-item>
        <el-dropdown-item 
          v-if="$store.state.user.roleName == 'ADMIN' && !$route.path.startsWith('/admin')"
          v-on:click.native="toAdmin">
          管理
        </el-dropdown-item>
        <el-dropdown-item v-if="$route.path != '/about'" v-on:click.native="toTop">トップ</el-dropdown-item>
        <el-dropdown-item v-on:click.native="logout">ログアウト</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  methods: {
    // パスワード変更画面オープン
    passwordDialogOpen: function() {
      this.$store.commit('switchPasswordDialogFlg', true)
    },
    // 管理画面へ
    toAdmin: function() {
      this.$router.push('/admin')
    },
    // トップ画面へ
    toTop: function() {
      this.$router.push('/about')
    },
    // ログアウト
    logout: function() {
      this.$store.commit('setUser', {})
      this.$router.push('/')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
i.user-icon {
  font-size: 2rem;
}

</style>
