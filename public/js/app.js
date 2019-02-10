

$(document).on("click", ".test", function () {

    var id = $(this).data("id")
    var text = $("#" + id).text()
    var anchor = $("#" + id).children().attr("href")
   
    $.ajax({
        method: "POST",
        url: "/update/",
        data: {
            title: text,
            link: anchor,
            id: id
        }
    }).then(function (data) {
        console.log(data)
    })


})
