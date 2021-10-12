
var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    slidesPerView: 1,
    paginationClickable: true,
    loop: true,
       paginationBulletRender: function (index, className) {
        var tabsName = ['Optie 1', 'Optie 2'];
        if ( index === (tabsName.length - 1) ) {
                console.log('check');
        }
        }
});