 function slideUp(target, duration = 500) {

	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.boxSizing = 'border-box';
	target.style.height = target.offsetHeight + 'px';
	target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {
		target.style.display = 'none';
		target.style.removeProperty('height');
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		//alert("!");
	}, duration);
}
 function slideDown(target, duration = 500) {

	target.style.removeProperty('display');
	let display = window.getComputedStyle(target).display;
	if (display === 'none') display = 'block';
	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.boxSizing = 'border-box';
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + 'ms';
	target.style.height = height + 'px';
	target.style.removeProperty('padding-top');
	target.style.removeProperty('padding-bottom');
	target.style.removeProperty('margin-top');
	target.style.removeProperty('margin-bottom');
	window.setTimeout(() => {
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
	}, duration);
}
 function slideToggle(target, duration = 500) {
	if (window.getComputedStyle(target).display === 'none') {
		return slideDown(target, duration);
	} else {
		return slideUp(target, duration);
	}
}

document.querySelectorAll('.rs-catalog-filter__item').forEach(item=>{

	item.querySelector('.rs-catalog-filter__item-toggle')?.addEventListener("click",()=>{
		item.classList.toggle('_open');
		item.classList.contains('_open')?slideDown(item.querySelector('.rs-catalog-filter__item-body')):slideUp(item.querySelector('.rs-catalog-filter__item-body'));
	})
})

document.querySelectorAll('.rs-catalog-filter__link-list li:has(ul)').forEach(item=>{

	item.querySelector('.rs-catalog-filter__link-list-toggle')?.addEventListener("click",()=>{
		item.classList.toggle('_open');
		item.classList.contains('_open')?slideDown(item.querySelector('ul')):slideUp(item.querySelector('ul'));
	})
})

document.querySelectorAll('.rs-catalog-price').forEach((item)=>{
	const slider = item.querySelector('.rs-catalog-price__ranger')
	const rangeMin = parseInt(item.dataset.min);
	const rangeMax = parseInt(item.dataset.max);
	const step = parseInt(item.dataset.step);
	const fromInpt = document.querySelector('.rs-catalog-price__from');
	const toInpt = document.querySelector('.rs-catalog-price__to');

console.log(toInpt)
	noUiSlider.create(slider, {
		start: [rangeMin, rangeMax],
		connect: true,
		step: step,
		range: {
			'min': rangeMin,
			'max': rangeMax
		},
		format: {
			to: value => value,
			from: value => value
		}
	});
	
	slider.noUiSlider.on('update', (values, handle) => { 
			toInpt.value = new Intl.NumberFormat('ru-RU').format(values[1]); 
			fromInpt.value = new Intl.NumberFormat('ru-RU').format(values[0]); 
		
	});

	fromInpt.addEventListener('change', () => {
		slider.noUiSlider.setHandle(0, parseInt(fromInpt.value.replace(/\s/g, '')));
	})
	toInpt.addEventListener('change', () => {
		slider.noUiSlider.setHandle(1, parseInt(toInpt.value.replace(/\s/g, '')));
	})
	
		
})