// assets/js/app.js

const I18N = {
  kk: {
    brandTitle: "Сахабалар",
    brandSubtitle: "Өмірбаяндар жинағы",
    footerText: "Материалдарды жарияламас бұрын сенімді дереккөздермен тексеріңіз.",
    eyebrow: "Сира • Тарих • Өмірбаян",
    hero: "Сахабалардың өмірін оқыңыз",
    intro: "Тыныш әрі ыңғайлы оқу үшін жасалған екітілді кітапхана. Іздеңіз, санатпен бөліңіз және әр өмірбаянды жеке оқу бетінде ашыңыз.",
    profiles: "профиль",
    search: "Сахабаны іздеу...",
    notFound: "Ештеңе табылмады.",
    back: "← Барлық сахаба",
    contents: "Мазмұны",
    sources: "Дереккөздер"
  },

  ru: {
    brandTitle: "Сподвижники",
    brandSubtitle: "Собрание биографий",
    footerText: "Перед публикацией проверяйте материалы по надёжным классическим и современным источникам.",
    eyebrow: "Сира • История • Биографии",
    hero: "Читайте о жизни сподвижников",
    intro: "Двуязычная библиотека для спокойного и удобного чтения. Ищите по имени, фильтруйте по категориям и открывайте отдельную страницу биографии.",
    profiles: "профилей",
    search: "Найти сподвижника...",
    notFound: "Ничего не найдено.",
    back: "← Все сподвижники",
    contents: "Содержание",
    sources: "Источники"
  }
};

let lang = localStorage.getItem("lang") || "kk";
let category = "all";
let query = "";

const app = document.getElementById("app");

function t(key) {
  return I18N[lang][key] || key;
}


// ======================================================
// RANDOM BACKGROUND
// ======================================================

const BACKGROUND_COUNT = 10;

function randomBackground() {
  const number = Math.floor(Math.random() * BACKGROUND_COUNT) + 1;

  const path =
    `assets/images/backgrounds/bg-${String(number).padStart(2, "0")}.jpg`;

  const background = document.querySelector(".ambient-bg");

  if (background) {
    background.style.backgroundImage = `url("${path}")`;
  }
}


// ======================================================
// SETTINGS
// ======================================================

function applyPrefs() {
  document.documentElement.dataset.theme =
    localStorage.getItem("theme") || "dark";

  document.documentElement.lang = lang;

  document.querySelectorAll("[data-lang]").forEach(button => {
    button.classList.toggle(
      "is-active",
      button.dataset.lang === lang
    );
  });

  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });
}


// ======================================================
// HOME PAGE
// ======================================================

function home() {

  const filtered = SAHABA.filter(sahaba => {

    const categoryMatches =
      category === "all" ||
      sahaba.categories.includes(category);

    const searchText =
      `${sahaba[lang].name} ${sahaba.arabic}`.toLowerCase();

    const searchMatches =
      searchText.includes(query.toLowerCase());

    return categoryMatches && searchMatches;
  });


  app.innerHTML = `

    <section class="hero">

      <div>
        <div class="eyebrow">
          ${t("eyebrow")}
        </div>

        <h1>
          ${t("hero")}
        </h1>

        <p>
          ${t("intro")}
        </p>
      </div>


      <div class="stats">

        <div class="stat">
          <strong>${SAHABA.length}</strong>
          <span>${t("profiles")}</span>
        </div>

      </div>

    </section>


    <div class="toolbar">

      <input
        id="search"
        class="search"
        value="${query}"
        placeholder="${t("search")}"
      >

    </div>


    <div class="filters">

      ${Object.entries(CATEGORY_LABELS)
        .map(([key, value]) => `

          <button
            class="filter-btn ${category === key ? "is-active" : ""}"
            data-cat="${key}"
          >
            ${value[lang]}
          </button>

        `)
        .join("")}

    </div>


    ${
      filtered.length

      ? `
        <div class="grid">
          ${filtered.map(card).join("")}
        </div>
      `

      : `
        <div class="empty">
          ${t("notFound")}
        </div>
      `
    }

  `;


  document
    .getElementById("search")
    .addEventListener("input", event => {

      query = event.target.value;
      home();

    });


  document
    .querySelectorAll("[data-cat]")
    .forEach(button => {

      button.onclick = () => {

        category = button.dataset.cat;
        home();

      };

    });
}


// ======================================================
// CARD
// ======================================================

function card(sahaba) {

  const data = sahaba[lang];

  return `

    <a
      class="card"
      href="#/s/${sahaba.id}"
    >

      <div class="arabic">
        ${sahaba.arabic}
      </div>

      <h3>
        ${data.name}
      </h3>

      <p>
        ${data.summary}
      </p>

      <div class="chips">

        ${data.facts
          .slice(0, 3)
          .map(fact => `

            <span class="chip">
              ${fact}
            </span>

          `)
          .join("")}

      </div>

    </a>

  `;
}


// ======================================================
// SAHABA DETAIL PAGE
// ======================================================

function detail(id) {

  const sahaba = SAHABA.find(item => item.id === id);

  if (!sahaba) {
    location.hash = "#/";
    return;
  }

  const data = sahaba[lang];


  app.innerHTML = `

    <div class="reader-shell">


      <nav class="reader-nav">

        <strong>
          ${t("contents")}
        </strong>

        ${data.sections
          .map((section, index) => `

            <a href="#sec-${index}">
              ${section.title}
            </a>

          `)
          .join("")}

      </nav>


      <article class="reader">

        <a
          class="back"
          href="#/"
        >
          ${t("back")}
        </a>


        <div class="arabic">
          ${sahaba.arabic}
        </div>


        <h1>
          ${data.name}
        </h1>


        <p class="lead">
          ${data.summary}
        </p>


        <div class="facts">

          ${data.facts
            .map(fact => `

              <div class="fact">
                ${fact}
              </div>

            `)
            .join("")}

        </div>


        ${data.sections
          .map((section, index) => `

            <section id="sec-${index}">

              <h2>
                ${section.title}
              </h2>

              ${section.text
                .map(paragraph => `

                  <p>
                    ${paragraph}
                  </p>

                `)
                .join("")}

            </section>

          `)
          .join("")}


        ${
          data.sources?.length

          ? `

            <section class="sources">

              <h2>
                ${t("sources")}
              </h2>

              ${data.sources
                .map(source => `

                  <p>

                    <a
                      href="${source.url}"
                      target="_blank"
                      rel="noopener"
                    >
                      ${source.label}
                    </a>

                  </p>

                `)
                .join("")}

            </section>

          `

          : ""
        }

      </article>

    </div>

  `;
}


// ======================================================
// ROUTER
// ======================================================

function route() {

  const match =
    location.hash.match(/^#\/s\/(.+)$/);

  if (match) {
    detail(match[1]);
  } else {
    home();
  }

  applyPrefs();
}


// ======================================================
// LANGUAGE
// ======================================================

document
  .querySelectorAll("[data-lang]")
  .forEach(button => {

    button.onclick = () => {

      lang = button.dataset.lang;

      localStorage.setItem(
        "lang",
        lang
      );

      route();

    };

  });


// ======================================================
// DARK / LIGHT
// ======================================================

document
  .getElementById("themeBtn")
  .onclick = () => {

    const next =
      document.documentElement.dataset.theme === "light"
        ? "dark"
        : "light";

    localStorage.setItem(
      "theme",
      next
    );

    applyPrefs();

  };


// ======================================================
// START
// ======================================================

window.addEventListener(
  "hashchange",
  route
);


// random background every full page refresh
randomBackground();

applyPrefs();
route();