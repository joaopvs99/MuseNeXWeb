$(function(){
    // toggle sidebar collapse
    $('.btn-toggle-sidebar').on('click', function(){
        $('.wrapper').toggleClass('sidebar-collapse');
    });
    $('.sb-item').on('click', function(){
        if ($(this).hasClass('btn-toggle-sidebar')) {
          return; 
        }
        $(this).siblings().removeClass('active');
        $(this).siblings().find('.sb-item').removeClass('active');
        $(this).addClass('active');
    })
});

document.getElementById('header').addEventListener('click', function() {
    window.location.href = '../index.html';
});


$(document).ready(function () {
    $(".sidebar-buttons").on("click", function () {

        var pageId = $(this).data("page-id");

        nextpage(pageId);
    });
});

function nextpage(idd) {
    $.get("homecontent/page" + idd + ".html")
        .done(function (data) {
            $("#pageContent").html(data);
        })
        .fail(function (error) {
            console.error("Error fetching page:", error);
        });
}


