class CookieDisclaimer {
	constructor(el) {
		this.container = el;
		this.checkHistory();
		// localStorage.clear(); // debug for mobile devices
	}

	checkHistory() {
		/**
		 * Check if the user has pushed the button
		 */
		if (!window.localStorage.cookieDisclaimerAgree) {
		// if (true) {
			console.log('xx')
			this.create();
		}
	}

	create() {
		/**
		 * Create block from template
		 */
		const html = this.container.innerHTML;
		document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', html);

		this.bindClick();
	}

	bindClick() {
		/**
		 * Hide block on button click
		 */
		document.querySelector('.js-cookie-disclaimer-agree')?.addEventListener('click', () => {
			this.hide()
		});
	}

	hide() {
		/**
		 * Hide block and write it in localStorage
		 */
		const el = document.querySelector('.js-cookie-disclaimer');
		el?.parentNode?.removeChild(el);

		window.localStorage.setItem('cookieDisclaimerAgree', 'true');
	}
}

if (document.querySelector('.js-cookie-disclaimer-template')) {
	new CookieDisclaimer(document.querySelector('.js-cookie-disclaimer-template'));
}
