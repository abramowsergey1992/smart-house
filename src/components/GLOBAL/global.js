function setSafeWidth() {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
}

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.rs-header');
    
    if (!header) {
        return;
    }
    
    let lastScrollTop = 0;
    
    function handleScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 100) {
            header.classList.add('_scroll');
        } else {
            header.classList.remove('_scroll');
        }
        
        if (currentScroll < lastScrollTop) {
            header.classList.add('_view');
        } else {
            header.classList.remove('_view');
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
});

window.addEventListener('resize', setSafeWidth);
setSafeWidth();


AOS.init({
   once: true
});

document.addEventListener('DOMContentLoaded', function() {
    const scrollButton = document.querySelector('.rs-footer-bottom__up');
    
    if (scrollButton) {
        scrollButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});


document.querySelector('.rs-header-mob__menu-open').addEventListener('click',()=>{
	document.querySelector('.rs-header-mob').classList.add('_open')
})

document.querySelector('.rs-header-mob__menu-close').addEventListener('click',()=>{
	document.querySelector('.rs-header-mob').classList.remove('_open')
})

document.querySelectorAll('.rs-header-mob-catalog__go').forEach(btn=>{
	btn.addEventListener('click',()=>{
		let li = btn.closest('li')
		console.log('sasdsa',li.closest('_open'))
		li.closest('._open')?.classList.add('_hidden');
		li.classList.add('_open')
	})
})
document.querySelectorAll('.rs-header-mob-catalog__back').forEach(btn=>{
	btn.addEventListener('click',()=>{
		let li = btn.closest('li')
		li.classList.remove('_open')
		li.closest('._open')?.classList.remove('_hidden');
	})
})