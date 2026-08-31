import './index.scss'
import { initSectionPagination } from '@js/common/section-pagination.js'
import Swiper from 'swiper'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import Sortable from 'sortablejs'
import '@components/layout/slider/slider.scss'

const navigationEntry = performance.getEntriesByType('navigation')[0]

if (navigationEntry?.type === 'reload') {
	window.history.scrollRestoration = 'manual'
	window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
	window.scrollTo(0, 0)
}

initSectionPagination()

function initFeatureCardLoops() {
	document.querySelectorAll('.noesis-features article').forEach((card) => {
		if (card.querySelector('.noesis-features__track')) return

		const content = document.createElement('div')
		content.className = 'noesis-features__content'
		content.append(...card.children)

		const duplicate = content.cloneNode(true)
		duplicate.setAttribute('aria-hidden', 'true')

		const track = document.createElement('div')
		track.className = 'noesis-features__track'
		track.append(content, duplicate)
		card.append(track)
	})
}

initFeatureCardLoops()

function initTopicListHover() {
	const topicList = document.querySelector('.noesis-topic-list')
	const rows = topicList ? [...topicList.querySelectorAll('li')] : []
	const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)')
	if (!topicList || !rows.length || !supportsHover.matches) return

	let settleTimer
	let leaveTimer
	const hoverClasses = rows.map((_, index) => `--topic-hover-${index + 1}`)

	const resetSettledState = () => rows.forEach((row) => row.classList.remove('--topic-hover-settled'))
	const scheduleArrow = (row) => {
		window.clearTimeout(settleTimer)
		resetSettledState()
		settleTimer = window.setTimeout(() => row.classList.add('--topic-hover-settled'), 500)
	}

	const activateRow = (row, index) => {
		window.clearTimeout(leaveTimer)
		topicList.classList.remove(...hoverClasses)
		topicList.classList.add(hoverClasses[index])
		scheduleArrow(row)
	}

	rows.forEach((row, index) => {
		row.addEventListener('pointerenter', () => activateRow(row, index))
		row.addEventListener('pointermove', () => scheduleArrow(row))
		row.addEventListener('pointerleave', () => {
			window.clearTimeout(settleTimer)
			resetSettledState()
			leaveTimer = window.setTimeout(() => topicList.classList.remove(...hoverClasses), 140)
		})
	})
}

initTopicListHover()

const phoneSlider = document.querySelector('[data-phone-slider]')
phoneSlider?.querySelectorAll('.phone-slider__slide--tournament').forEach((slide) => slide.remove())
const phoneSlides = phoneSlider?.querySelectorAll('.swiper-slide')

if (phoneSlider && phoneSlides && phoneSlides.length > 1) {
	new Swiper(phoneSlider, {
		modules: [Autoplay, Navigation, Pagination],
		slidesPerView: 1,
		loop: true,
		speed: 650,
		autoplay: {
			delay: 4600,
			disableOnInteraction: false,
			pauseOnMouseEnter: true,
		},
		pagination: {
			el: '.phone-slider__pagination',
			clickable: true,
			bulletClass: 'phone-slider__bullet',
			bulletActiveClass: 'phone-slider__bullet--active',
		},
		navigation: {
			prevEl: '.phone-slider__button--prev',
			nextEl: '.phone-slider__button--next',
		},
	})
}

const releaseLabels = {
	uk: { day: 'дн.', hour: 'год.', minute: 'хв.', available: 'Доступно' },
	en: { day: 'd', hour: 'h', minute: 'm', available: 'Available' },
	de: { day: 'T', hour: 'Std.', minute: 'Min.', available: 'Verfügbar' },
}

function getPageLanguage() {
	if (document.documentElement.lang.startsWith('de')) return 'de'
	if (document.documentElement.lang.startsWith('en')) return 'en'
	return 'uk'
}

function initReleaseCountdowns() {
	const releases = [...document.querySelectorAll('[data-release-countdown]')]
	if (!releases.length) return

	const labels = releaseLabels[getPageLanguage()]
	const update = () => {
		const now = Date.now()

		releases.forEach((release) => {
			const timer = release.querySelector('.noesis-release__timer')
			const target = Date.parse(release.dataset.releaseDate)
			if (!timer || Number.isNaN(target)) return

			const remaining = Math.max(0, target - now)
			if (!remaining) {
				release.classList.add('is-available')
				release.disabled = false
				timer.textContent = labels.available
				return
			}

			const totalMinutes = Math.floor(remaining / 60000)
			const days = Math.floor(totalMinutes / 1440)
			const hours = Math.floor((totalMinutes % 1440) / 60)
			const minutes = totalMinutes % 60
			timer.textContent = `${days} ${labels.day} ${String(hours).padStart(2, '0')} ${labels.hour} ${String(minutes).padStart(2, '0')} ${labels.minute}`
		})
	}

	update()
	window.setInterval(update, 60000)
}

initReleaseCountdowns()

const quizMessages = {
	uk: { correct: 'Правильно', incorrect: 'Неправильно' },
	en: { correct: 'Correct', incorrect: 'Incorrect' },
	de: { correct: 'Richtig', incorrect: 'Falsch' },
}

document.querySelectorAll('.phone-question__answers').forEach((answerList) => {
	const answers = [...answerList.querySelectorAll('button')]
	const language = document.documentElement.lang.startsWith('de') ? 'de' : document.documentElement.lang.startsWith('en') ? 'en' : 'uk'
	const messages = quizMessages[language]
	const correctAnswer = answers.find((answer) => ['Венера', 'Venus'].includes(answer.textContent.trim()))

	if (!correctAnswer) return
	const feedback = document.createElement('p')
	feedback.className = 'phone-question__feedback'
	feedback.setAttribute('aria-live', 'polite')
	answerList.insertAdjacentElement('afterend', feedback)

	answers.forEach((answer) => {
		answer.addEventListener('click', () => {
			const isCorrect = answer === correctAnswer
			feedback.classList.toggle('is-correct', isCorrect)
			feedback.classList.toggle('is-incorrect', !isCorrect)
			feedback.textContent = isCorrect ? messages.correct : messages.incorrect
		})
	})
})

const correctPlaceOrders = {
	uk: ['Ейфелева вежа', 'Колізей', 'Бурдж-Халіфа', 'Тадж-Махал', 'Токійська вежа', 'Сіднейський оперний театр'],
	en: ['Eiffel Tower', 'Colosseum', 'Burj Khalifa', 'Taj Mahal', 'Tokyo Tower', 'Sydney Opera House'],
	de: ['Eiffelturm', 'Kolosseum', 'Burj Khalifa', 'Taj Mahal', 'Tokio Tower', 'Sydney Opera House'],
}

document.querySelectorAll('.phone-order__list').forEach((list) => {
	const language = document.documentElement.lang.startsWith('de') ? 'de' : document.documentElement.lang.startsWith('en') ? 'en' : 'uk'
	const correctOrder = correctPlaceOrders[language]
	const checkOrder = () => {
		const currentOrder = [...list.querySelectorAll('.phone-order__item > span')].map((place) => place.textContent.trim())
		const isCorrect = currentOrder.every((place, index) => place === correctOrder[index])
		list.classList.toggle('is-correct-order', isCorrect)
	}

	new Sortable(list, {
		animation: 180,
		handle: '.phone-order__handle',
		draggable: '.phone-order__item',
		ghostClass: 'is-drag-ghost',
		chosenClass: 'is-dragging',
		forceFallback: true,
		fallbackOnBody: true,
		delay: 110,
		delayOnTouchOnly: true,
		touchStartThreshold: 3,
		onEnd: checkOrder,
	})
})
