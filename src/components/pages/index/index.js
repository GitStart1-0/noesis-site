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

function initQuestionCardTilt() {
	const visual = document.querySelector('.noesis-intro__visual')
	const stack = visual?.querySelector('.noesis-question-card__stack')
	const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)')

	if (!visual || !stack || !supportsHover.matches) return

	visual.addEventListener('pointermove', (event) => {
		const rect = visual.getBoundingClientRect()
		const offsetX = (event.clientX - rect.left) / rect.width - 0.5
		const offsetY = (event.clientY - rect.top) / rect.height - 0.5
		stack.style.transition = 'none'
		stack.style.transform = `rotateY(${offsetX * 14}deg) rotateX(${-offsetY * 10}deg) scale(1.03)`
	})

	visual.addEventListener('pointerleave', () => {
		stack.style.transition = ''
		stack.style.transform = ''
	})
}

initQuestionCardTilt()

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

function initCursorTrail() {
	const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
	const target = document.querySelector('.noesis-methodology')
	if (!target || !supportsFinePointer.matches || reduceMotion.matches) return

	const canvas = document.createElement('canvas')
	canvas.className = 'noesis-cursor-trail'
	canvas.setAttribute('aria-hidden', 'true')
	target.append(canvas)

	const context = canvas.getContext('2d')
	const trails = []
	const trailColor = '201, 165, 102'
	const pointLifetime = 1200
	const maxTrailLength = 600
	let activeTrail
	let brush
	let lastMoveAt = 0
	let frameRequested = false

	const resize = () => {
		const bounds = target.getBoundingClientRect()
		const ratio = Math.min(window.devicePixelRatio || 1, 2)
		canvas.width = Math.round(bounds.width * ratio)
		canvas.height = Math.round(bounds.height * ratio)
		context.setTransform(ratio, 0, 0, ratio, 0, 0)
	}

	const addPoint = (trail, x, y, time) => {
		const previousPoint = trail.points.at(-1)
		if (previousPoint && Math.hypot(x - previousPoint.x, y - previousPoint.y) < 1) return

		trail.points.push({ x, y, time })
		let length = 0

		for (let index = trail.points.length - 1; index > 0; index -= 1) {
			const point = trail.points[index]
			const previous = trail.points[index - 1]
			length += Math.hypot(point.x - previous.x, point.y - previous.y)

			if (length > maxTrailLength) {
				trail.points.splice(0, index)
				break
			}
		}
	}

	const drawTrail = (trail, now) => {
		const latestPoint = trail.points.at(-1)
		const points = trail.points.filter((point) => point === latestPoint || now - point.time < pointLifetime)
		trail.points = points
		if (points.length < 2) return now - points[0].time < pointLifetime

		context.beginPath()
		context.moveTo(points[0].x, points[0].y)

		for (let index = 1; index < points.length - 1; index += 1) {
			const point = points[index]
			const nextPoint = points[index + 1]
			context.quadraticCurveTo(point.x, point.y, (point.x + nextPoint.x) / 2, (point.y + nextPoint.y) / 2)
		}

		const lastPoint = points[points.length - 1]
		context.lineTo(lastPoint.x, lastPoint.y)
		context.strokeStyle = `rgba(${trail.color}, 0.5)`
		context.lineWidth = 1.5
		context.lineCap = 'round'
		context.lineJoin = 'round'
		context.stroke()
		return true
	}

	const render = (now) => {
		frameRequested = false
		context.clearRect(0, 0, canvas.width, canvas.height)

		if (brush) {
			brush.x += (brush.targetX - brush.x) * 0.18
			brush.y += (brush.targetY - brush.y) * 0.18
			addPoint(brush.trail, brush.x, brush.y, now)

			if (Math.hypot(brush.targetX - brush.x, brush.targetY - brush.y) < 0.5) brush = undefined
		}

		for (let index = trails.length - 1; index >= 0; index -= 1) {
			if (!drawTrail(trails[index], now)) trails.splice(index, 1)
		}

		if (trails.length || brush) {
			frameRequested = true
			window.requestAnimationFrame(render)
		}
	}

	target.addEventListener('pointermove', (event) => {
		if (event.pointerType !== 'mouse') return

		const now = performance.now()
		const bounds = target.getBoundingClientRect()
		const x = event.clientX - bounds.left
		const y = event.clientY - bounds.top

		if (!activeTrail || now - lastMoveAt > 160) {
			activeTrail = { color: trailColor, points: [] }
			trails.push(activeTrail)
			brush = { trail: activeTrail, x, y, targetX: x, targetY: y }
			addPoint(activeTrail, x, y, now)
		} else if (!brush) {
			const lastPoint = activeTrail.points.at(-1) || { x, y }
			brush = { trail: activeTrail, x: lastPoint.x, y: lastPoint.y, targetX: x, targetY: y }
		} else if (brush) {
			brush.targetX = x
			brush.targetY = y
		}

		lastMoveAt = now

		if (!frameRequested) {
			frameRequested = true
			window.requestAnimationFrame(render)
		}
	}, { passive: true })

	target.addEventListener('pointerleave', () => {
		activeTrail = undefined
		brush = undefined
		lastMoveAt = 0
	})

	new ResizeObserver(resize).observe(target)
	resize()
}

initCursorTrail()

const phoneSlider = document.querySelector('[data-phone-slider]')
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
