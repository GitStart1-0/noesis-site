// Підключення функціоналу "Чортоги Фрілансера"
import { addTouchAttr, bodyLockStatus, bodyLockToggle, bodyUnlock, FLS } from "@js/common/functions.js"

import './menu.scss'

function menuClose() {
	document.documentElement.removeAttribute("data-fls-menu-open")
	if (document.documentElement.hasAttribute("data-fls-scrolllock")) {
		bodyUnlock(0)
		setTimeout(() => {
			document.body.style.paddingRight = ''
			document.documentElement.removeAttribute("data-fls-scrolllock")
		}, 0)
	}
}

export function menuInit() {
	document.addEventListener("click", function (e) {
		if (bodyLockStatus && e.target.closest('[data-fls-menu]')) {
			bodyLockToggle()
			document.documentElement.toggleAttribute("data-fls-menu-open")
		}
	})

	const desktopMedia = window.matchMedia('(min-width: 993px)')
	const closeMenuOnDesktop = (event) => {
		if (event.matches && document.documentElement.hasAttribute("data-fls-menu-open")) {
			menuClose()
		}
	}
	desktopMedia.addEventListener ? desktopMedia.addEventListener('change', closeMenuOnDesktop) : desktopMedia.addListener(closeMenuOnDesktop)
	closeMenuOnDesktop(desktopMedia)
}

document.querySelector('[data-fls-menu]') ?
	window.addEventListener('load', menuInit) : null
