
var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    slidesPerView: 1,
    paginationClickable: true,
    loop: true,
       paginationBulletRender: function (index, className) {
        var tabsName = ['Optie 1', 'Optie 2'];
        if ( index === (tabsName.length - 1) ) {
                  return	'<span class="waves-effect waves-light blue lighten-1 btn z-depth-1 ' + className + '">'
                          + tabsName[index] + '</span>'
                          + '<div class="active-mark "></div>';
        }
        return '<span class="waves-effect waves-light blue lighten-1 btn z-depth-1 ' + className + '">' + tabsName[index] + '</span>';
        }
});