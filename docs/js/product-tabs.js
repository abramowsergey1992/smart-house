document.addEventListener('DOMContentLoaded', function() {
  const productsTabs = document.querySelectorAll('.products-tabs');
  
  productsTabs.forEach(productsTab => {
    const tabsList = productsTab.querySelector('.products-tabs__list');
    const tabsItems = productsTab.querySelectorAll('.products-tabs__item');
    const slider = productsTab.querySelector('.products-tabs__slider');
    const slides = productsTab.querySelectorAll('.swiper-slide');

    const swiper = new Swiper(slider, {
      allowTouchMove: false,
      autoHeight: true,
      speed: 300,
      on: {
        slideChange: function() {
          const activeIndex = this.activeIndex;
          tabsItems.forEach((item, index) => {
            if (index === activeIndex) {
              item.classList.add('_active');
            } else {
              item.classList.remove('_active');
            }
          });
          
          setTimeout(() => {
            this.updateAutoHeight();
          }, 10);
        }
      }
    });

    tabsItems.forEach((tab, index) => {
      tab.addEventListener('click', function() {
        const slideIndex = parseInt(this.getAttribute('data-slide'));
        swiper.slideTo(slideIndex);
        tabsItems.forEach(item => item.classList.remove('_active'));
        this.classList.add('_active');
      });
    });

    window.addEventListener('resize', function() {
      swiper.updateAutoHeight();
    });

    setTimeout(() => {
      swiper.updateAutoHeight();
    }, 100);
  });
});