 function faqSlideUp(target,faq, duration = 500) {
	faq.style.setProperty('--h', faq.querySelector('.rs-faq__head').offsetHeight + 'px');
	faq.style.setProperty('--h2', 0+ 'px');
}
 function faqSlideDown(target, faq, duration = 500) {

	faq.style.setProperty('--h2',  target.offsetHeight + 'px');
	console.log(target,
		target.offsetHeight,parseInt(faq.querySelector('.rs-faq__head').offsetHeight) )
	faq.style.setProperty('--h',target.offsetHeight +  parseInt(faq.querySelector('.rs-faq__head').offsetHeight) + 'px');
}

document.querySelectorAll('.rs-faqs').forEach((wrap)=>{
	wrap.querySelectorAll('.rs-faq').forEach((faq)=>{
		faq.querySelector('.rs-faq__head').addEventListener('click', () => {
			if(faq.classList.contains('_open')){
				wrap.querySelectorAll('.rs-faq').forEach((faq)=>{
					faq.classList.remove('_open')
					faqSlideUp(faq.querySelector('.rs-faq__body'),faq)
				})
				
			}else{
				wrap.querySelectorAll('.rs-faq').forEach((faq2)=>{
					if(faq!=faq2) {
						faq2.classList.remove('_open')
						faqSlideUp(faq2.querySelector('.rs-faq__body'),faq2)
					}
				})
				faq.classList.add("_open");
				faqSlideDown(faq.querySelector('.rs-faq__body'),faq)
			}
		});
	})
})