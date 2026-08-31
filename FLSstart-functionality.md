# Функціонал шаблону FLSstart у проєкті Noesis

Цей документ описує можливості шаблону, які вже є в проєкті `noesis-site`, і як їх варто використовувати під час розробки сайту Noesis.

## 1. Збірка і структура

Шаблон побудований на Vite і має компонентну структуру:

- `src/components/pages` - окремі сторінки сайту.
- `src/components/layout` - готові layout-компоненти: хедер, меню, попапи, таби, слайдери тощо.
- `src/components/forms` - готові елементи форм.
- `src/components/effects` - візуальні ефекти та поведінка при скролі.
- `src/styles` - глобальні стилі, налаштування контейнера, міксини, змінні.
- `src/assets/img` - зображення.
- `src/assets/video` - відео.
- `src/files` - файли для завантаження.

Основні команди:

- `npm run dev` - запуск локального сайту.
- `npm run build` - production-збірка.
- `npm run preview` - перегляд production-збірки.
- `npm run zip` - збірка і пакування в архів.
- `npm run add` - генерація нового компонента.
- `npm run new` - генерація нової сторінки.
- `npm run wp`, `npm run wpbuild` - WordPress-режим.

## 2. Налаштування шаблону

Головний файл налаштувань: `template.config.js`.

У ньому керуються:

- локальний сервер;
- HTML-форматування;
- оптимізація стилів;
- `pxtorem`;
- code splitting CSS/JS;
- оптимізація зображень;
- генерація WebP/AVIF;
- SVG sprite;
- шрифти;
- React/Vue-режим;
- WordPress/PHP-режим;
- FTP-деплой;
- dev-навігаційна панель;
- статистика збірки;
- alias-шляхи `@components`, `@styles`, `@img`, `@video`, `@files`.

Для Noesis важливо використовувати alias-шляхи замість довгих відносних шляхів. Наприклад:

```html
<video src="@video/sciense/science_hero/Big_Bang_scrub_1080.mp4"></video>
```

## 3. SCSS-можливості

Файл `src/styles/includes/index.scss` автоматично підключається до всіх SCSS-файлів. Тому в компонентах можна напряму використовувати змінні, функції й міксини шаблону.

Основне:

- `@include adaptiveValue("font-size", 80, 36);` - адаптивна властивість через `clamp()`.
- `toRem(16)` - конвертація px у rem.
- `toEm(992)` - конвертація px у em для media queries.
- `percent(300, 1200)` - відсотки від базового значення.
- `@include gridCards(...)` - швидка адаптивна сітка карток.
- `@include gridContainer(...)` - grid-контейнер за логікою шаблону.

Для Noesis:

- адаптивний текст і великі відступи краще задавати через `adaptiveValue`;
- не використовувати inline-стилі в HTML;
- відстані між великими секціями краще задавати через `padding-block` самих секцій;
- верхні `margin` для відштовхування секцій краще уникати.

## 4. Контейнер

У `src/styles/settings.scss` задані:

- `$minWidth: 320`;
- `$maxWidth: 1920`;
- `$maxWidthContainer: 1170`;
- `$containerPadding: 30`;
- `$responsiveType: 1`.

Класи, які містять `__container`, автоматично отримують поведінку контейнера шаблону.

Приклад:

```html
<div class="section__container">
	...
</div>
```

## 5. Загальні JS-хелпери

Файл `src/js/common/functions.js` містить базові функції:

- `FLS(...)` - логування шаблону.
- `isMobile` - визначення мобільного браузера.
- `addTouchAttr()` - додає `data-fls-touch`.
- `addLoadedAttr()` - додає `data-fls-loaded` після завантаження.
- `slideUp`, `slideDown`, `slideToggle` - плавне відкриття/закриття блоків.
- `bodyLock`, `bodyUnlock`, `bodyLockToggle` - блокування скролу, наприклад для меню або попапів.
- `getHash`, `setHash` - робота з hash в URL.
- `gotoBlock(...)` - плавний скрол до блока.
- `dataMediaQueries(...)` - обробка адаптивних data-атрибутів.
- `getDigFormat(...)` - форматування чисел.

## 6. Header і меню

Компоненти:

- `src/components/layout/header`
- `src/components/layout/menu`

Можливості:

- мобільне burger-меню через `data-fls-menu`;
- блокування скролу сторінки при відкритому меню;
- автоматичне закриття меню при переході на desktop;
- `data-fls-scrollto` для пунктів навігації;
- `data-fls-scrollto-header` для врахування висоти хедера;
- підменю у навігації;
- перенос елементів у мобільне меню через Dynamic Adapt.

У Noesis вже використовується:

```html
<div class="header__langs" data-fls-dynamic=".menu__body, 992, last, .header">
	...
</div>
```

Це означає: на ширині до `992px` блок мов переноситься в `.menu__body`, позиція `last`, пошук всередині `.header`.

## 7. Dynamic Adapt

Компонент: `src/components/layout/dynamic`.

Атрибут:

```html
data-fls-dynamic="куди, breakpoint, позиція, область-пошуку"
```

Приклад:

```html
data-fls-dynamic=".menu__body, 992, last, .header"
```

Позиція може бути:

- `first`;
- `last`;
- число, наприклад `2`.

Для Noesis це корисно для:

- перенесення вибору мови в мобільне меню;
- перенесення CTA-кнопок;
- зміни порядку блоків у складних секціях без дублювання HTML.

## 8. Layout-компоненти

У шаблоні є такі layout-модулі:

- `beforeafter` - порівняння “до/після”.
- `chart` - графіки на Chart.js.
- `digcounter` - анімовані лічильники чисел.
- `dynamic` - перенесення DOM-елементів на breakpoints.
- `fullpage` - повноекранні секції.
- `gallery` - галерея на lightGallery.
- `grid` - data-атрибути для сітки.
- `map` - Google Maps.
- `masonry` - masonry-сітка і фільтри.
- `popup` - модальні вікна, включно з YouTube.
- `showmore` - “показати більше”.
- `slider` - Swiper-слайдер.
- `spollers` - акордеони.
- `tabs` - таби.

Для Noesis найкорисніші:

- `fullpage` для повноекранних блоків;
- `dynamic` для адаптивного меню;
- `scrollto` для навігації;
- `watcher` для появи елементів при скролі;
- `tabs` і `spollers` для майбутніх FAQ/категорій;
- `slider` для слайдів застосунку або відгуків;
- `popup` для відео/демо;
- `digcounter` для метрик.

## 9. Форми

Компоненти в `src/components/forms`:

- `button`;
- `checkbox`;
- `radio`;
- `input`;
- `select`;
- `form`;
- `datepicker`;
- `quantity`;
- `range`;
- `rating`;
- `addtocart`;
- `novaposhta`.

Можливості:

- валідація форм;
- повідомлення про помилки;
- маски інпутів;
- autoheight для textarea;
- показ/приховування пароля;
- кастомні select;
- range-слайдер;
- rating;
- quantity controls.

Для Noesis поки що найрелевантніші:

- форма підписки;
- форма контакту;
- кастомний select для мови або тем;
- textarea з autoheight для фідбеку.

## 10. Ефекти

Компоненти в `src/components/effects`:

- `cursor` - кастомний курсор.
- `darklite` - перемикання темної/світлої теми.
- `gsap` - GSAP-анімації.
- `marquee` - рухомий рядок.
- `mouse` - ефекти, що реагують на рух миші.
- `parallax` - паралакс.
- `preloader` - прелоадер.
- `ripple` - ripple-ефект.
- `screenshot` - знімок блока через html2canvas.
- `scrollto` - плавний скрол.
- `splittype` - розбиття тексту для анімацій.
- `tippy` - tooltip.
- `watcher` - IntersectionObserver.
- `zoom` - збільшення зображення.

Для Noesis найкраще підходять:

- `watcher` для появи текстів;
- `scrollto` для меню;
- `gsap` для складних анімацій;
- `splittype` для анімації заголовків по словах/літерах;
- `parallax` для глибини сцен;
- `preloader`, якщо будуть важкі відео;
- `tippy` для пояснень в інтерфейсі;
- `marquee` для декоративних списків тем або понять.

## 11. Watcher

Компонент: `src/components/effects/watcher`.

Працює через `data-fls-watcher`.

Можливості:

- відстеження появи елементів у viewport;
- одноразове спрацювання через `data-fls-watcher-once`;
- налаштування threshold через `data-fls-watcher-threshold`;
- інтеграція з навігацією через значення `navigator`.

Приклад:

```html
<section id="science-next" data-fls-watcher="navigator"></section>
```

## 12. Scrollto

Компонент: `src/components/effects/scrollto`.

Приклад:

```html
<a href="#interface" data-fls-scrollto="#interface" data-fls-scrollto-header>Інтерфейс</a>
```

Можливості:

- плавний скрол;
- врахування висоти хедера;
- активний пункт меню через watcher;
- закриття мобільного меню після кліку.

## 13. Fullpage

Компонент: `src/components/layout/fullpage`.

Атрибути:

- `data-fls-fullpage`;
- `data-fls-fullpage-section`;
- `data-fls-fullpage-bullets`;
- `data-fls-fullpage-noevent`.

Для Noesis можна використовувати для повноекранних storytelling-секцій. Але для video scroll-scrub на сторінці науки зараз краще лишити кастомну логіку, бо вона точніше контролює кадр відео.

## 14. GSAP і складні анімації

У шаблоні є компонент `gsap` і залежність `gsap` у `package.json`.

Це означає, що можна робити:

- timeline-анімації;
- scroll-triggered анімації;
- появу текстів;
- пульсації;
- вибухи/розліт елементів;
- зміни положень блоків при скролі.

Для дуже складних сцен на Noesis краще комбінувати:

- GSAP для DOM-анімацій;
- CSS для простих transition/keyframes;
- video scroll-scrub для кінематографічних сцен;
- canvas/WebGL тільки якщо потрібні частинки або 3D.

## 15. Зображення і відео

Налаштування зображень у `template.config.js`:

- оптимізація;
- генерація сучасного формату;
- зміна HTML після оптимізації;
- підтримка `@img`.

Для відео є alias `@video`.

Рекомендація для Noesis:

- фото тримати в `src/assets/img`;
- відео тримати в `src/assets/video`;
- великі відео для scroll-scrub перекодовувати окремо під web;
- використовувати MP4/H.264 для сумісності;
- короткі декоративні відео можна дублювати WebM, якщо потрібно.

## 16. WordPress/PHP-можливості

У шаблоні є WordPress-структура і команди:

- `npm run wp`;
- `npm run wpbuild`;
- `npm run wpdeploy`;
- `npm run wpstop`.

Також є PHP-режим у `template.config.js`.

Для поточного Noesis-сайту це не обов'язково. Але якщо сайт у майбутньому треба буде переносити у WordPress, шаблон уже має відповідну базу.

## 17. React/Vue/Tailwind

У `template.config.js` є перемикачі:

- `react: false`;
- `vue: false`;
- `tailwindcss: false`.

Залежності встановлені, але зараз сайт зроблений як HTML/SCSS/JS через компоненти шаблону.

Для Noesis краще не вмикати React/Vue без потреби, щоб не ускладнювати статичний сайт.

## 18. Що вже використано в Noesis

У поточному сайті вже використовуються:

- компонентний хедер;
- мобільне меню;
- `data-fls-dynamic` для перенесення вибору мови;
- `data-fls-scrollto`;
- `data-fls-scrollto-header`;
- багатомовні сторінки `index.html`, `en.html`, `de.html`;
- сторінка `science.html`;
- відео з `@video`;
- адаптивний SCSS через `adaptiveValue`;
- кастомний scroll-scrub для hero-блоку науки.

## 19. Рекомендований підхід для подальшої розробки Noesis

1. Спочатку перевіряти, чи є потрібна можливість у шаблоні.
2. Якщо є готовий FLS-компонент, використовувати його.
3. Якщо потрібна нестандартна поведінка, писати кастомний компонент, але зберігати FLS-підхід: окремі `html`, `scss`, `js`.
4. Для адаптивних текстів і великих відступів використовувати `adaptiveValue`.
5. Для переміщення елементів між desktop/mobile використовувати `data-fls-dynamic`.
6. Для появи елементів при скролі спершу розглядати `watcher`.
7. Для складних storytelling-анімацій використовувати GSAP або scroll-scrub, а не намагатися зробити все CSS-ом.
8. Не дублювати HTML для desktop/mobile, якщо це можна зробити через Dynamic Adapt.
9. Не використовувати inline `style`.
10. Не робити великі відстані між секціями через верхні margin попередніх/наступних елементів.

