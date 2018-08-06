$(document).ready(function () {
  $(".commentBtn").click(function(e){
    var target = $(this)
    var toId = target.data('tid')
    var commentId = target.data('cid')
    var toEle = $("#toId")
    if (toEle.length > 0) {
      toEle.val(toId)
    } else {
      var fDiv = $('<div></div>')
      $('<input>').attr({
        type: 'hidden',
        id: 'toId',
        name: 'comment[tid]',
        value: toId
      }).appendTo(fDiv)
  
      $('<input>').attr({
        type: 'hidden',
        name: 'comment[cid]',
        value: commentId
      }).appendTo(fDiv)
  
      fDiv.children().appendTo('#commentsForm')
    }
    })
})