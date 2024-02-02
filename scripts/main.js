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


document.getElementById('btn-logout-modal').addEventListener('click', function() {
    $('#logout-modal').modal('show');
});


