export function initSectionPagination() {
	const pagination = document.querySelector('[data-section-pagination]')
	const sections = [...document.querySelectorAll('[data-section-pagination-item]')]
	if (!pagination || !sections.length) return

	pagination.textContent = ''

	function easeInOutCubic(value) {
		return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2
	}

	function animateScrollTo(targetTop) {
		const startTop = window.scrollY
		const distance = targetTop - startTop
		const duration = Math.min(1200, Math.max(520, Math.abs(distance) * 0.45))
		const startTime = performance.now()

		function step(now) {
			const progress = Math.min(1, (now - startTime) / duration)
			window.scrollTo(0, startTop + distance * easeInOutCubic(progress))

			if (progress < 1) {
				requestAnimationFrame(step)
				return
			}

			window.scrollTo(0, targetTop)
		}

		requestAnimationFrame(step)
	}

	function getTargetTop(section) {
		const sectionTop = section.getBoundingClientRect().top + window.scrollY
		if (section.dataset.sectionPaginationLanding === 'top') return sectionTop

		const headerHeight = document.querySelector('.header')?.offsetHeight || 0
		return sectionTop - headerHeight
	}

	const buttons = sections.map((section, index) => {
		if (!section.id) section.id = `section-${index + 1}`

		const button = document.createElement('button')
		button.className = 'section-pagination__item'
		button.type = 'button'
		button.setAttribute('aria-label', `Section ${index + 1}`)
		button.addEventListener('click', () => {
			animateScrollTo(getTargetTop(section))
		})
		pagination.append(button)
		return button
	})

	function setActiveSection() {
		const viewportTarget = window.innerHeight / 2
		let activeIndex = 0
		let activeDistance = Number.POSITIVE_INFINITY

		sections.forEach((section, index) => {
			const rect = section.getBoundingClientRect()
			const containsTarget = rect.top <= viewportTarget && rect.bottom >= viewportTarget
			const sectionTarget = containsTarget ? viewportTarget : rect.top + rect.height / 2
			const distance = Math.abs(sectionTarget - viewportTarget)

			if (distance < activeDistance) {
				activeDistance = distance
				activeIndex = index
			}
		})

		buttons.forEach((button, index) => {
			const isActive = index === activeIndex
			button.classList.toggle('--active', isActive)
			button.setAttribute('aria-current', isActive ? 'true' : 'false')
		})
	}

	window.addEventListener('scroll', setActiveSection, { passive: true })
	window.addEventListener('resize', setActiveSection)
	setActiveSection()
}
