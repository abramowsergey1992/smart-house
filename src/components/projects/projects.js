document.addEventListener('DOMContentLoaded', function() {
    // Проверяем существование блока
    const swiperContainer = document.querySelector('.swiper.rs-projects__swiper');
    if (!swiperContainer) return;

    // Инициализация Swiper
    const swiper = new Swiper('.swiper.rs-projects__swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: false,
        centeredSlides: false,
        
        // Пагинация с кастомным рендерингом
        pagination: {
            el: '.rs-projects__swiper-pagi',
            type: 'custom',
            renderCustom: function(swiper, current, total) {
                let paginationHTML = '';
                
                // Всегда показываем первую страницу
                paginationHTML += `<span class="swiper-pagination-bullet ${current === 1 ? 'swiper-pagination-bullet-active' : ''}" data-page="1">1</span>`;
                
                // Показываем вторую страницу
                if (total > 1) {
                    paginationHTML += `<span class="swiper-pagination-bullet ${current === 2 ? 'swiper-pagination-bullet-active' : ''}" data-page="2">2</span>`;
                }
                
                // Показываем третью страницу
                if (total > 2) {
                    paginationHTML += `<span class="swiper-pagination-bullet ${current === 3 ? 'swiper-pagination-bullet-active' : ''}" data-page="3">3</span>`;
                }
                
                // Добавляем многоточие если текущая страница не рядом с началом
                if (current > 4) {
                    paginationHTML += `<span class="swiper-pagination-bullet-ellipsis">...</span>`;
                }
                
                // Показываем текущую страницу если она не 1,2,3 и не последние
                if (current > 3 && current < total - 2) {
                    paginationHTML += `<span class="swiper-pagination-bullet swiper-pagination-bullet-active" data-page="${current}">${current}</span>`;
                }
                
                // Добавляем многоточие перед последними страницами
                if (current < total - 3) {
                    paginationHTML += `<span class="swiper-pagination-bullet-ellipsis">...</span>`;
                }
                
                // Показываем последние три страницы
                for (let i = Math.max(total - 2, 4); i <= total; i++) {
                    if (i > 3) { // Чтобы не дублировать 1,2,3
                        paginationHTML += `<span class="swiper-pagination-bullet ${current === i ? 'swiper-pagination-bullet-active' : ''}" data-page="${i}">${i}</span>`;
                    }
                }
                
                return paginationHTML;
            }
        },
        
        // Навигация
        navigation: {
            nextEl: '.rs-projects__swiper-next',
            prevEl: '.rs-projects__swiper-prev',
        },
        
        // Эффекты перехода
        effect: 'slide',
        speed: 500,
        
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
            768: {
                slidesPerView: 1,
                spaceBetween: 30
            },
            1024: {
                slidesPerView: 1,
                spaceBetween: 40
            }
        }
    });

    // Обработчик клика по пагинации
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('swiper-pagination-bullet') && 
            !e.target.classList.contains('swiper-pagination-bullet-active')) {
            const page = parseInt(e.target.getAttribute('data-page'));
            swiper.slideTo(page - 1); // Swiper использует 0-based индекс
        }
    });

    // Обновляем пагинацию при изменении слайда
    swiper.on('slideChange', function() {
        // Пагинация автоматически обновляется через renderCustom
    });

    // Добавляем обработчики для клавиатуры
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            swiper.slidePrev();
        } else if (e.key === 'ArrowRight') {
            swiper.slideNext();
        }
    });

    // Добавляем классы для инициализации
    swiperContainer.classList.add('swiper-initialized');
    swiperContainer.classList.add('swiper-horizontal');
});