import './header.scss'
import '@components/layout/menu/menu.js'
import '@components/effects/scrollto/scrollto.js'
import '@components/layout/dynamic/dynamic.js'
import '@components/layout/header/plugins/scroll/scroll.js'

const submenuMedia = window.matchMedia('(max-width: 992px)')

function closeSubmenu(item) {
	item.classList.remove('--submenu-open')
	item.querySelector('.menu__link--submenu')?.setAttribute('aria-expanded', 'false')
}

function initHeaderSubmenus() {
	const submenuItems = document.querySelectorAll('.menu__item--has-submenu')
	if (!submenuItems.length) return

	submenuItems.forEach((item) => {
		const button = item.querySelector('.menu__link--submenu')
		const links = item.querySelectorAll('.menu__sublink')

		button?.addEventListener('click', (event) => {
			event.stopPropagation()
			submenuItems.forEach((otherItem) => {
				if (otherItem !== item) closeSubmenu(otherItem)
			})
			const isOpen = item.classList.toggle('--submenu-open')
			button.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
		})

		links.forEach((link) => {
			link.addEventListener('click', () => {
				closeSubmenu(item)
			})
		})
	})

	document.addEventListener('click', (event) => {
		if (!event.target.closest('.menu__item--has-submenu')) {
			submenuItems.forEach(closeSubmenu)
		}
	})

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') submenuItems.forEach(closeSubmenu)
	})

	submenuMedia.addEventListener('change', () => {
		submenuItems.forEach(closeSubmenu)
	})
}

initHeaderSubmenus()

function initLanguageMenu() {
	const languageMenu = document.querySelector('.header__langs')
	const trigger = languageMenu?.querySelector('.header__lang-current')
	if (!languageMenu || !trigger) return

	trigger.addEventListener('click', (event) => {
		event.stopPropagation()
		const isOpen = languageMenu.classList.toggle('--langs-open')
		trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
	})

	document.addEventListener('click', (event) => {
		if (!event.target.closest('.header__langs')) {
			languageMenu.classList.remove('--langs-open')
			trigger.setAttribute('aria-expanded', 'false')
		}
	})

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			languageMenu.classList.remove('--langs-open')
			trigger.setAttribute('aria-expanded', 'false')
		}
	})
}

initLanguageMenu()
