$(function(){
    // toggle sidebar collapse
    $('.btn-toggle-sidebar').on('click', function(){
        $('.wrapper').toggleClass('sidebar-collapse');
    });
    // mark sidebar item as active when clicked
    $('.sb-item').on('click', function(){
        if ($(this).hasClass('btn-toggle-sidebar')) {
          return; // already actived
        }
        $(this).siblings().removeClass('active');
        $(this).siblings().find('.sb-item').removeClass('active');
        $(this).addClass('active');
    })
});