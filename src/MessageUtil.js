const MSG_SUCCSESS = {
    showClose: true,
    type: 'success'
}

const MSG_ERROR = {
    showClose: true,
    type: 'error'
  }

export default {
    MSG_ERROR_LOGIN: function() {
        return {...MSG_ERROR, message: 'ログインできませんでした。'}
    },
    MSG_ERROR_REGIST: function() {
        return {...MSG_ERROR, message: '登録できませんでした。'}
    },
    MSG_ERROR_PASSWORD_CHANGE: function() {
        return {...MSG_ERROR, message: 'パスワードとパスワード（確認）が異なります。'}
    },
    MSG_SUCCESS_REGIST: function() {
        return {...MSG_SUCCSESS, message: '登録が完了しました。'}
    },
    MSG_SUCCESS_DELETE: function() {
        return {...MSG_SUCCSESS, message: '削除が完了しました。'}
    }
}
