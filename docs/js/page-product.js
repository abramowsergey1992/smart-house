document.addEventListener('DOMContentLoaded', function() {
	if(document.querySelector('.rs-page-product')){
		let sub = document.querySelector('.rs-page-product__sub')
		let up = document.querySelector('.rs-page-product__up')
		let count = document.querySelector('.rs-page-product__count')

		up.addEventListener('click', () => {
			count.value =  new Intl.NumberFormat('ru-RU').format(0+  parseInt(count.value.replace(/\s/g, '')) + parseInt(count.dataset.step));
		})
		sub.addEventListener('click', () => {
			if( parseInt(count.value.replace(/\s/g, '')) - parseInt(count.dataset.step)>0){
				count.value =   new Intl.NumberFormat('ru-RU').format( parseInt(count.value.replace(/\s/g, '') - parseInt(count.dataset.step)));
			}else{
				count.value = 0;
			}
		})



		const mainSlider = new Swiper('.rs-page-product__slider-main', {
			slidesPerView: 1,
			spaceBetween: 10,
			navigation: {
				nextEl: '.rs-page-product__next',
				prevEl: '.rs-page-product__prev',
			},
			thumbs: {
				swiper: null 
			}
		});

		const previewSlider = new Swiper('.rs-page-product__slider-preview', {
			slidesPerView: 6,
			spaceBetween: 0,
			direction: 'vertical',
			watchSlidesProgress: true,
			slideToClickedSlide: true,
			breakpoints: {
				320: {
					slidesPerView: 6,
				},
				768: {
					slidesPerView: 6,
					direction: 'vertical'
				}
			}
		});

		mainSlider.params.thumbs.swiper = previewSlider;
		mainSlider.thumbs.swiper = previewSlider;

		mainSlider.update();
		previewSlider.update();

		previewSlider.on('click', function() {
			const activeIndex = previewSlider.activeIndex;
			mainSlider.slideTo(activeIndex);
		});

		mainSlider.on('slideChange', function() {
			previewSlider.slideTo(mainSlider.activeIndex);
		});

		const firstPreviewSlide = document.querySelector('.rs-page-product__slider-preview .swiper-slide');
		if (firstPreviewSlide) {
			firstPreviewSlide.classList.add('active');
		}
	}
});