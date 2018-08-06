$(document).ready(function () {
  
  $('form').submit(function (e) {
    console.log(112212)
  })

  $("#douban").blur(function () {
    let douban = $(this)
    let id = douban.val()
    if (id) {
      $.ajax({
        url: 'https://api.douban.com/v2/movie/subject/' + id,
        cache: true,
        type: 'get',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'callback',
        success: function (data) {
          // $("#inputCategory").val(data.)
          $("#inputTitle").val(data.title)
          $("#inputDoctor").val(data.directors[0].name)
          $("#inputCountry").val(data.countries.toString())
          $("#inputLanguage").val(data.languages.toString())
          $("#inputPoster").val(data.images.large)
          $("#inputFlash").val(data.trailer_urls)
          $("#inputYear").val(data.year)
          $("#inputSummary").val(data.summary)
        }
      })

    }
  })
})