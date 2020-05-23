<template>
  <div class="hello" :class="{linkable}" v-on:click="onclick">
    <el-row>
      <el-col :span="6">
        <div class="image">
          <img v-bind:src="book.image"/>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="details">
          <ul>
            <li v-if="index">{{index}}.</li>
            <li>{{book.title}} ({{book.price}}円)</li>
            <li>{{book.author}} 著</li>
            <li>{{book.publisher}} /刊</li>
            <li>{{book.published}} /発売</li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'book-info',
  props: {
    index: {
      type: Number
    },
    linkable: {
      type: Boolean,
      default: false
    },
    book: {
      type: Object
    }
  },
  methods: {
    onclick: function() {
      if (this.linkable) {
        this.$emit('book-click', this.book)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.linkable:hover {
  cursor: pointer;
  background-color: #ff9;
}
ul {
  list-style-type: none;
}
li {
  padding-top: 0;
  padding-bottom: 0;
  line-height: 2em;
}
</style>
