<template>
  <div class="about">
    <el-row>
      <!-- メニュー -->
      <el-col :span="24" id="userIcon">
        <Menu></Menu>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" id="leftPart">
        <!-- 検索条件 -->
        <el-form ref="bookSearchForm" :model="bookSearchForm">
          <el-row>
            <el-col :span="6">
              <el-form-item size="small">
                <el-input type="text" v-model="bookSearchForm.title" placeholder="タイトル" clearable style="width: 200px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small">
                <el-input type="text" v-model="bookSearchForm.author" placeholder="著者" clearable style="width: 200px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item size="small">
                <el-date-picker
                  v-model="bookSearchForm.completeDate"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="読了日From"
                  end-placeholder="読了日To"
                  format="yyyy年M月d日">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="6">
              <el-form-item>
                <el-select size="small" v-model="bookSearchForm.genre" clearable placeholder="ジャンル" style="width: 200px;">
                  <el-option
                      v-for="item in genreList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align: center;">
              <el-form-item>
                <el-button type="info" icon="el-icon-close" circle size="mini" v-on:click="rateClear"></el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-rate
                  v-model="bookSearchForm.rate"
                  :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                  :texts="['面白くない', 'あまり面白くない', '普通', '面白い', 'とても面白い']"
                  show-text>
                </el-rate>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="text-align: center;">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" v-on:click="bookSearch">検索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <!-- 検索結果 -->
        <el-table
          ref="displayBookList"
          :data="getCurrentPageList"
          height="100%"
          highlight-current-row
          @current-change="rowClick"
          v-loading="loading">
          <el-table-column
            type="index"
            width="50"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            prop="completeDate"
            v-bind:formatter="formatDate"
            label="読了日"
            width="130">
          </el-table-column>
          <el-table-column
            prop="title"
            label="タイトル"
            width="200">
          </el-table-column>
          <el-table-column
            prop="author"
            label="著者"
            width="180">
          </el-table-column>
          <el-table-column
            prop="genre.name"
            label="ジャンル"
            width="100">
          </el-table-column>
          <el-table-column
            label="評価"
            width="150">
            <template slot-scope="scope">
              <el-rate
                :value="scope.row.rate"
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                disabled>
              </el-rate>
            </template>
          </el-table-column>
        </el-table>

        <!-- ページャーを生成 -->
        <el-row class="pager">
          <el-col :span="12">
            <el-pagination
              background
              layout="total, prev, pager, next"
              :total="searchBookList.length"
              :page-size="getPageSize"
              :current-page="currentPage"
              @current-change="pageChange">
            </el-pagination>
          </el-col>
          <el-col :span="12" align="right">
            合計金額：<span class="totalAmount">{{getTotalAmount}}</span>&nbsp;円
          </el-col>
        </el-row>
        
      </el-col>

      <!-- 画面の右側 -->
      <el-col :span="12" id="rightPart">
        <!-- パスワード変更のダイアログ -->
        <PasswordDialog></PasswordDialog>
        
        <!-- グーグル検索のダイアログ -->
        <el-dialog
          title="本を検索"
          :visible.sync="searchDialogVisible"
          width="40%"
          center>
          <el-form ref="searchForm" :model="searchForm" :rules="searchRules">
            <el-form-item prop="title">
              <el-input placeholder="キーワード" v-model="searchForm.title" class="keyword">
                <el-button slot="append" icon="el-icon-search" v-on:click="googleSearch"></el-button>
              </el-input>
            </el-form-item>
            <div v-show="searchLoading" class="loader">Now loading...</div>
            <transition-group>
              <BookInfo v-for="(book, i) of googleBookList"
                v-bind:key="book.id" 
                :index="i+1" 
                :linkable="true" 
                :book="book"
                v-on:book-click="bookClick">
              </BookInfo>
            </transition-group>
          </el-form>
        </el-dialog>

        <!-- 登録フォーム -->
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-row>
            <el-col :span="1">
              <el-button type="success" icon="el-icon-plus" size="mini" circle v-on:click="searchDialogVisible=true" :disabled="editFlg"></el-button>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="image">
                <div class="titleImg">
                  <img v-bind:src="form.image">
                  <el-link class="infoLink" :underline="false" type="success" :href="form.info" v-if="infoFlg" icon="el-icon-info" target="_blank">詳細</el-link>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item prop="title" label="タイトル" size="small">
                <el-input type="text" v-model="form.title"></el-input>
              </el-form-item>
              <el-form-item prop="author" label="著者" size="small">
                <el-input type="text" v-model="form.author"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="6">
                  <el-form-item prop="price" label="値段" size="small">
                    <el-input-number controls-position="right" v-model="form.price" :precision="0" :step="1" :min="0" :max="100000">
                    </el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="publisher" label="出版社" size="small">
                    <el-input type="text" v-model="form.publisher" style="width: 230px;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="published" label="発売日" size="small">
                    <el-date-picker v-model="form.published" type="date" format="yyyy年M月d日" style="width: 200px;">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
          </el-row>
          <el-row type="flex" align="bottom">
            <el-col :span="8">
              <el-form-item prop="completeDate" label="読了日" size="small">
                <el-date-picker v-model="form.completeDate" type="date" format="yyyy年M月d日">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="genre" label="ジャンル" style="margin-bottom:15px;">
                <el-select size="small" v-model="form.genre" clearable style="width: 200px;">
                  <el-option
                      v-for="item in genreList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="rate" label="評価">
                <el-rate
                  v-model="form.rate"
                  :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                  :texts="['面白くない', 'あまり面白くない', '普通', '面白い', 'とても面白い']"
                  show-text>
                </el-rate>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item prop="memo" label="感想">
            <el-input type="textarea" :rows="4" v-model="form.memo"></el-input>
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Constant from '@/constant.js'
import DateUtil from '@/DateUtil.js'
import MessageUtil from '@/MessageUtil.js'
import BookInfo from '@/components/BookInfo.vue'
import Menu from '@/components/Menu.vue'
import PasswordDialog from '@/components/PasswordDialog.vue'
const axios = require('axios')
const URL_SEARCH_BOOK = "https://www.googleapis.com/books/v1/volumes?q="
const PAGE_SIZE = 10

export default {
  name: 'About',
  components: {
    BookInfo,
    Menu,
    PasswordDialog
  },
  data: function() {
    return {
      form: {
        id: null,
        image: '',
        title: '',
        price: '',
        author: '',
        publisher: '',
        published: '',
        completeDate: '',
        memo: '',
        rate: 3,
        genre: '',
        info: ''
      },
      rules: {
        title: [
          {required: true, message: 'タイトルが未入力です。', trigger: 'blur'},
          {max: 50, message: '50文字以内で入力してください。', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '値段が未入力です。', trigger: 'blur'}
        ],
        author: [
          {required: true, message: '著者が未入力です。', trigger: 'blur'},
          {max: 50, message: '50文字以内で入力してください。', trigger: 'blur'}
        ],
        publisher: [
          {required: true, message: '出版社が未入力です。', trigger: 'blur'},
          {max: 50, message: '50文字以内で入力してください。', trigger: 'blur'}
        ],
        published: [
          {required: true, message: '発売日が未入力です。', trigger: 'blur'}
        ],
        completeDate: [
          {required: true, message: '読了日が未入力です。', trigger: 'blur'}
        ],
        rate: [
          {required: true, message: '評価が未入力です。', trigger: 'blur'}
        ],
        genre: [
          {required: true, message: 'ジャンルが未入力です。', trigger: 'blur'}
        ],
        memo: [
          {max: 500, message: '500文字以内で入力してください。', trigger: 'blur'}
        ]
      },
      searchDialogVisible: false,
      searchForm: {
        title: ''
      },
      searchRules: {
        title: [
          {required: true, message: 'キーワードが未入力です。', trigger: 'blur'}
        ]
      },
      genreList: [],
      googleBookList: [],
      searchBookList: [],
      currentPage: 1,
      bookSearchForm: {
        title: '',
        author: '',
        genre: null,
        rate: null,
        completeDate: ''
      },
      searchLoading: false,
      editFlg: false,
      infoFlg: false,
      loading: false
    }
  },
  methods: {
    // 登録処理
    regist: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let book = {
            key: {
              userId: this.$store.state.user.id,
              seqNo: this.form.id,
            },
            title: this.form.title,
            price: this.form.price,
            author: this.form.author,
            publisher: this.form.publisher,
            published: DateUtil.dateToStr(this.form.published),
            completeDate: DateUtil.dateToStr(this.form.completeDate),
            memo: this.form.memo,
            rate: this.form.rate,
            genre: {
              id: this.form.genre
            },
            imgUrl: this.form.image,
            infoUrl: this.form.info
          }

          axios.post(Constant.URL_BOOK_REGIST, book).then((res) => {
            // 登録した本の連番が戻ってくる
            this.form.id = res.data
            // 編集中にする。
            this.editFlg = true

            this.$message(MessageUtil.MSG_SUCCESS_REGIST());
            // 再検索
            this.bookSearch()
          })
        }
      })
    },
    // クリア処理
    clear: function() {
      // フォームに空をセットするだけだとvalidateが動いてしまうので以下のようにする。
      this.$refs['form'].resetFields();
      this.form.info = ''
      this.form.id = null
      this.infoFlg = false
      this.editFlg = false
      // グーグル検索のキーワードと、検索結果もクリアする。
      this.searchForm.title = ''
      this.googleBookList = []
      // 検索結果の選択状態を解除する。
      this.$refs.displayBookList.setCurrentRow()
    },
    // 削除処理
    remove: function() {
      axios.delete(Constant.URL_BOOK_DELETE + this.$store.state.user.id + '/' + this.form.id).then(() => {
        this.$message(MessageUtil.MSG_SUCCESS_DELETE())
        // 入力欄クリア
        this.clear()
        // 再検索処理
        this.bookSearch()
      })
    },
    googleSearch: function() {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.googleBookList = []
          this.searchLoading = true
          axios.get(URL_SEARCH_BOOK + this.searchForm.title).then((res) => {
            res.data.items.forEach((book) => {
              let authors = book.volumeInfo.authors
              let price = book.saleInfo.listPrice
              let img = book.volumeInfo.imageLinks
              this.googleBookList.push({
                id: book.id,
                title: book.volumeInfo.title,
                author: authors ? authors.join(',') : '',
                price: price ? price.amount: '-',
                publisher: book.volumeInfo.publisher,
                published: book.volumeInfo.publishedDate,
                image: img ? img.thumbnail : '',
                info: book.volumeInfo.infoLink
              })
              this.searchLoading = false
            })
          })
        }
      })
    },
    rateClear: function() {
      this.bookSearchForm.rate = null
    },
    bookClick: function(book) {
      this.searchDialogVisible = false
      // いったんフォームをリセット
      this.$refs['form'].resetFields();

      this.form.image = book.image
      this.form.title = book.title
      if (book.price == '-') {
        this.form.price = 0
      } else {
        this.form.price = book.price
      }
      this.form.author = book.author
      this.form.publisher = book.publisher
      if (book.published) {
        let publishedArr = book.published.split('-')
        if (publishedArr.length == 3) {
          this.form.published = new Date(publishedArr[0], publishedArr[1] - 1, publishedArr[2])
        } else if (publishedArr.length == 2) {
          this.form.published = new Date(publishedArr[0], publishedArr[1] - 1, 1)
        } else if (publishedArr.length == 1) {
          this.form.published = new Date(publishedArr[0], 0, 1)
        }
      } else {
        this.form.published = ''
      }
      this.form.info = book.info
      if (book.info) {
        this.infoFlg = true
      }
    },
    // 検索処理
    bookSearch: function() {
      // 検索条件生成
      let cond = {
        userId: this.$store.state.user.id,
        title: this.bookSearchForm.title,
        author: this.bookSearchForm.author,
        completeDateFrom: this.bookSearchForm.completeDate ? DateUtil.dateToStr(this.bookSearchForm.completeDate[0]) : '',
        completeDateTo: this.bookSearchForm.completeDate ? DateUtil.dateToStr(this.bookSearchForm.completeDate[1]) : '',
        genre: this.bookSearchForm.genre ? this.bookSearchForm.genre : 0,
        rate: this.bookSearchForm.rate ? this.bookSearchForm.rate : 0
      }
      // ローディング開始
      this.loading = true
      axios.post(Constant.URL_BOOK_SEARCH, cond).then((res) => {
        this.searchBookList = []
        res.data.forEach((book) => {
          this.searchBookList.push(book)
        })
        // 1ページ目を設定
        this.pageChange(1)
        // ローディング解除
        this.loading = false
      }).catch(() => {
        // ローディング解除
        this.loading = false
      })
    },
    // 検索結果に表示する日付用フォーマッター
    formatDate: function(row, column, cellValue, index) { // eslint-disable-line
      // yyyy-MM-ddをyyyy年MM月dd日にする。
      let year = cellValue.slice(0, 4)
      let month = cellValue.slice(5, 7)
      month = Number(month)
      let day = cellValue.slice(8, 10)
      day = Number(day)
      return year + "年" + month + "月" + day + "日"
    },
    // 検索結果の行をクリックしたとき
    rowClick: function(row) {
      if (row) {
        // いったんフォームをリセットする。
        this.$refs['form'].resetFields();
        // 選択行の内容をフォームにセットする。
        this.form.id = row.key.seqNo
        this.form.image = row.imgUrl
        this.form.title = row.title
        this.form.price = row.price
        this.form.author = row.author
        this.form.publisher = row.publisher
        // 発行日 yyyy-MM-ddを日付に変換する。
        let publishedArr = row.published.split('-')
        this.form.published = new Date(publishedArr[0], publishedArr[1] - 1, publishedArr[2])
        // 読了日 yyyy-MM-ddを日付に変換する。
        let completeDateArr = row.completeDate.split('-')
        this.form.completeDate = new Date(completeDateArr[0], completeDateArr[1] - 1, completeDateArr[2])
        this.form.memo = row.memo
        this.form.rate = row.rate
        this.form.genre = row.genre.id
        this.form.info = row.infoUrl

        // 詳細リンクを持っている場合はリンクを表示する。
        if (row.infoUrl) {
          this.infoFlg = true
        } else {
          this.infoFlg = false
        }
        // 編集状態にする。
        this.editFlg = true
      }
    },
    // ページ切り替え時
    pageChange: function(page) {
      this.currentPage = page
    },
    // 検索結果テーブルのインデックス設定
    indexMethod: function(index) {
      return (index + 1) + (this.currentPage - 1) * PAGE_SIZE
    }
  },
  computed: {
    getTotalAmount: function() {
      let totalAmount = 0
      this.searchBookList.forEach((book) => {
        totalAmount = totalAmount + book.price
      })
      return totalAmount.toLocaleString()
    },
    getCurrentPageList: function() {
      return this.searchBookList.slice((this.currentPage - 1) * PAGE_SIZE, (this.currentPage - 1) * PAGE_SIZE + PAGE_SIZE)
    },
    getPageSize: function() {
      return PAGE_SIZE
    }
  },
  created: function() {
    axios.get(Constant.URL_GENRE_GETLIST).then((res) => {
      res.data.forEach((genre) => {
        this.genreList.push({value: genre.id, label: genre.name})
      })
    })

    // 検索処理
    this.bookSearch()

    console.log(this.$route.path)
  }
}
</script>

<style scoped>
#leftPart, #rightPart {
  margin: 0;
  padding: 0;
  height: 70vh;
  padding-left: 20px;
  padding-right: 20px;
}

.titleImg {
  width: 200px;
  height: 260px;
  position: relative;
}

img {
  position: absolute;
  top:  0;                     /* 位置指定 */
  bottom:  0;                  /* 位置指定 */
  left:  0;                    /* 位置指定 */
  right:  0;                   /* 位置指定 */
  margin:  auto;               /* 中央寄せ */
}

.infoLink {
  position: absolute;
  bottom:  0;                  /* 位置指定 */
  left:  0;                    /* 位置指定 */
}

.keyword {
  margin-bottom: 20px;
}

#userIcon {
  text-align: right;
}

.loader {
  color: #000000;
  font-size: 20px;
  margin: 100px auto;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  -webkit-animation: load4 1.3s infinite linear;
  animation: load4 1.3s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}

.pager {
  margin-top: 10px;
}

.totalAmount {
  font-weight: bold;
  color: red;
}

@-webkit-keyframes load4 {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}
@keyframes load4 {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}
</style>
