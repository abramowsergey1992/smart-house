document.querySelectorAll('.product-slider').forEach(slider=>{
	const swiper = new Swiper(slider, {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: false,
        centeredSlides: false,

        navigation: {
            nextEl: slider.querySelector('.product-slider__next'),
            prevEl: slider.querySelector('.product-slider__prev'),
        },
        // Клавиатура
        keyboard: {
            enabled: true,
        },
        
        // Мышь
        mousewheel: {
            forceToAxis: true,
        },
        
        // Адаптивность
        breakpoints: {
           500: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            992: {
                slidesPerView: 3,
                spaceBetween: 30
            },
            1124: {
                slidesPerView:4,
                spaceBetween: 40
            }
        }
    });
})
