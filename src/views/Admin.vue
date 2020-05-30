<template>
  <div class="admin">
    <el-row>
      <el-col :span="18">
        <el-menu mode="horizontal" :router="isRouter">
          <el-menu-item index="/admin/user">
            ユーザ管理
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="6">
        <!-- メニュー -->
        <Menu></Menu>
      </el-col>
    </el-row>

    <transition appear>
      <router-view />
    </transition>
  </div>
</template>

<script>
import Menu from '@/components/Menu.vue'

export default {
  name: 'Admin',
  components: {
    Menu
  },
  data: function() {
    return {
      isRouter: true
    }
  }
}
</script>

<style scoped>
.admin {
  width: 900px;
}
</style>