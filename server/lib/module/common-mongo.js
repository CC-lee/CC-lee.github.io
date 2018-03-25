function timeInfo() {
  return {
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  }
}

function likeInfo(string) {
  var obj = {
    [`${stirng}_id`]: { type: 'string' },
    user_id: { type: 'string' },
    like_type: { type: 'string' },
  }
  Object.assign(obj, timeInfo())
  return obj
}

function commentInfo() {
  var obj = {}
  return obj
}

function replyInfo() {
  var obj = {}
  return obj
}

function commentLikeInfo() {
  var obj = {}
  return obj
}

module.exports = {
  timeInfo,
  likeInfo,
  commentInfo,
  replyInfo,
  commentLikeInfo
}