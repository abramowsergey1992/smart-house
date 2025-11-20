import AOS from 'aos';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import 'aos/dist/aos.css';


AOS.init({
	once: true
});

document
	.querySelectorAll('.about-2__slider')
	.forEach(function (item) {

		new Swiper((item), {
			slidesPerView: 1,
			spaceBetween: 0,
			loop: true,
			pagination: {
				el: item.querySelector(".about-2__pagi"),
				clickable: true

			},
			autoplay: {
				delay: 5000,
			},
		});


	})

document
	.querySelectorAll('.news-swiper')
	.forEach(function (item) {

		new Swiper((item), {
			slidesPerView: 1,
			spaceBetween: 20,
			loop: true,

			navigation: {
				nextEl: item.querySelector(".news-swiper__nav-next"),
				prevEl: item.querySelector(".news-swiper__nav-prev"),
			},
		});


	})


document.addEventListener('DOMContentLoaded', function () {
	if (exposition) {
		const grid = document.querySelector('.exposition__grid');
		const slide = document.querySelector('.exposition__content-slider .swiper-slide');

		const distance = grid.offsetTop - slide.offsetTop;
		document.querySelector('.exposition').style.setProperty('--bottom-space', distance + 'px');
		window.addEventListener('resize', function () {
			distance = grid.offsetTop - slide.offsetTop;
			document.querySelector('.exposition').style.setProperty('--bottom-space', distance + 'px')
		})
		const bg = new Swiper('.exposition__bg-slider', {
			// Основные параметры
			direction: 'horizontal',
			loop: true,
			slidesPerView: 1,
			effect: 'fade',
			speed: 500,

			// Навигация
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},



			// События
			on: {
				init: function () {
					updatePastClass(this);
				},
				beforeSlideChangeStart: function () {
					updatePastClass(this);
				}
			}
		});

		const swiper = new Swiper('.exposition__content-slider', {
			// Основные параметры
			direction: 'horizontal',
			loop: true,
			slidesPerView: 1,
			effect: 'fade',
			speed: 500,
			allowTouchMove: false,
			// Навигация
		

			pagination: {
				el: document.querySelector(".exposition__pagi"),
				type: 'custom',
				renderCustom: function (swiper, current, total) {
					return current.toString().padStart(2, "0") + ' / ' + ((total).toString().padStart(2, "0"));
				}
			},

			// События
			on: {
				init: function () {
					updatePastClass(this);
				},
				beforeSlideChangeStart: function () {
					updatePastClass(this);
				},
				slideChange: function () {
					bg.slideTo(this.realIndex)
					document.querySelectorAll('.exposition__menu-item').forEach((item) => {
						item.classList.remove('active')
						if (item.dataset.slide == this.realIndex) {
							item.classList.add('active')
						}
					})
				}

			}
		});
document.querySelector(".exposition__prev").classList.remove('disabled')
			
		 document.querySelector(".exposition__next").addEventListener('click',()=>{
			swiper.slideTo(swiper.activeIndex+1);
			document.querySelector(".exposition__prev").classList.remove('disabled')
			if(swiper.activeIndex+1 == swiper.slides.length){
				document.querySelector(".exposition__next").classList.add('disabled')
			}
		 })
		 document.querySelector(".exposition__prev").addEventListener('click',()=>{
			swiper.slideTo(swiper.activeIndex-1)
			document.querySelector(".exposition__next").classList.remove('disabled')
			if(swiper.activeIndex==0){
				document.querySelector(".exposition__prev").classList.add('disabled')
			}
		 })
			
		document.querySelectorAll('.exposition__menu-item').forEach((item) => {
			item.addEventListener('click', () => {
				swiper.slideTo(item.dataset.slide)
			})
		})
		// Функция для обновления класса .past
		function updatePastClass(swiperInstance) {
			// Удаляем класс .past со всех слайдов
			swiperInstance.slides.forEach(slide => {
				slide.classList.remove('past');
			});

			console.log(swiperInstance.previousIndex)
			// Добавляем класс .past предыдущему слайду
			if (swiperInstance.previousIndex >= 0) {
				const previousSlide = swiperInstance.slides[swiperInstance.activeIndex];
				if (previousSlide) {
					previousSlide.classList.add('past');
					setTimeout(() => {
						previousSlide.classList.remove('past');
					}, 1000)
				}
			}
		}
	}
});


document.addEventListener('DOMContentLoaded', function () {
	const showMoreBtn = document.querySelector('.news-block__more');
	const itemsPerLoad = 3;
	document.querySelectorAll('.exposition .news').forEach((news, index) => {
		if (index > itemsPerLoad - 1) {
			news.classList.add('hidden-news')
		}
	})
	const hiddenNews = document.querySelectorAll('.hidden-news');

	let currentIndex = 0;

	showMoreBtn?.addEventListener('click', function () {
		// Показываем следующую порцию с анимацией
		for (let i = currentIndex; i < currentIndex + itemsPerLoad && i < hiddenNews.length; i++) {
			setTimeout(() => {
				hiddenNews[i].classList.add('show');
			}, (i - currentIndex) * 100); // Задержка для последовательного появления
		}

		currentIndex += itemsPerLoad;

		// Скрываем кнопку, если все новости показаны
		if (currentIndex >= hiddenNews.length) {
			setTimeout(() => {
				showMoreBtn.classList.add('hidden');
			}, 300);
		}
	});
});




// Функция для копирования координат
function copyCoordinates(button) {
	// Получаем координаты из data-атрибута
	const coords = button.getAttribute('data-coords');

	if (!coords) {
		console.error('Координаты не найдены в data-атрибуте');
		return;
	}

	// Копируем в буфер обмена
	navigator.clipboard.writeText(coords)
		.then(() => {
			button.classList.add('_copy')

			// Возвращаем оригинальный текст через 2 секунды
			setTimeout(() => {
				button.classList.remove('_copy')
			}, 1000);
		})
		.catch(err => {
			alert('Не удалось скопировать координаты');
		});
}

// Добавляем обработчики событий для всех кнопок
document.addEventListener('DOMContentLoaded', function () {
	const copyButtons = document.querySelectorAll('.copy-coords-btn');

	copyButtons.forEach(button => {
		button.addEventListener('click', function (e) {
			e.preventDefault()
			copyCoordinates(this);
		});
	});
});