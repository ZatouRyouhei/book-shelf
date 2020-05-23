<template>
  <div id="app">
    <transition appear>
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 40px;
}

body {
  width: 1850px;
  height: 900px;
}

.v-enter-active {
  transition: opacity 1.0s;
}

.v-enter {
  opacity: 0.0;
}

</style>
