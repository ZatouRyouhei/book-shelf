export default {
    // 日付オブジェクトをyyyy-MM-ddに変換する。
    dateToStr: function(date) {
        let year = date.getFullYear()
        let month = 1 + date.getMonth()
        month = ('0' + month).slice(-2)
        let day = date.getDate()
        day = ('0' + day).slice(-2)
        return year + '-' + month + '-' + day
    }
}
