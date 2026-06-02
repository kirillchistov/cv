// Год в футере
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- PDF ----------
function handlePdfClick() {
  window.print();
}
["pdfButton", "pdfButtonBottom", "pdfButtonMobile"].forEach((id) => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", handlePdfClick);
});

// ---------- Проекты ----------
const projects = [
  {
    name: "SaaS Admin Dashboard",
    description:
      "Experiments with SaaS dashboards martech product (marketplace analytics and ROMI boosting)",
    stack: ["Next.js 16", "TypeScript", "Tailwind CSS v4", "Shadcn UI"],
    url: "https://github.com/kirillchistov/next-admin-dash"
  },
  {
    name: "eGrocery Dashboard",
    description:
      "Playing around with eGrocery dashboard for rapid competitive intel and brand digital shelf healthchecks",
    stack: ["Next.js 15", "React 19", "Tailwind CSS v4", "Drizzle"],
    url: "https://github.com/kirillchistov/growcery-admin"
  },
  {
    name: "NextJS Ecommerce Project",
    description:
      "Experiments with NextJS 15 and tennis racket e-shop",
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS v4"],
    url: "https://github.com/kirillchistov/next-admin-dash"
  },
  {
    name: "SaaS Product Landing",
    description:
      "Responsive landing page dedicated to SaaS martech product (marketplace analytics and ROMI boosting)",
    stack: ["HTML", "CSS", "JS"],
    url: "https://kirillchistov.github.io/points-track-landing/"
  },
  {
    name: "The place to socialize",
    description:
      "Single‑page app for sharing pleasant travel photos and explore the yet unseen",
    stack: ["HTML", "CSS", "JavaScript"],
    url: "https://github.com/kirillchistov/mesto"
  },
  {
    name: "Russian Travel",
    description:
      "Responsive landing page dedicated to travelling around Russia. First take on Web development",
    stack: ["HTML", "CSS", "Adaptve Responsive"],
    url: "https://github.com/kirillchistov/russian-travel"
  },
];

const projectsGrid = document.getElementById("projectsGrid");
if (projectsGrid) {
  projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.innerHTML = `
      <h3 class="project-name">${project.name}</h3>
      <p class="project-desc">${project.description}</p>
      <div class="project-meta">
        <div class="project-tags">
          ${project.stack
            .map((tag) => `<span class="project-tag">${tag}</span>`)
            .join("")}
        </div>
        <a href="${project.url}" target="_blank" rel="noopener" class="project-link">
          GitHub
        </a>
      </div>
    `;
    projectsGrid.appendChild(card);
  });
}

// ---------- Форма ----------
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

function setError(fieldName, message) {
  const errorEl = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (errorEl) errorEl.textContent = message || "";
}

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    let hasError = false;

    if (!name) {
      setError("name", getText("errName"));
      hasError = true;
    } else setError("name", "");

    if (!email) {
      setError("email", getText("errEmailEmpty"));
      hasError = true;
    } else if (!validateEmail(email)) {
      setError("email", getText("errEmailBad"));
      hasError = true;
    } else setError("email", "");

    if (!message) {
      setError("message", getText("errMsg"));
      hasError = true;
    } else setError("message", "");

    if (hasError) {
      formStatus.textContent = "";
      return;
    }

    const subject = encodeURIComponent(getText("mailSubject"));
    const body = encodeURIComponent(
      `${getText("formNameLabel")}: ${name}\nEmail: ${email}\n\n${getText(
        "formMsgLabel"
      )}:\n${message}`
    );

    const mailtoLink = `mailto:kchistov@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    formStatus.textContent = getText("formStatus");
  });
}

// ---------- Тема (☀ / 🌙) ----------
const htmlEl = document.documentElement;

function applyTheme(theme) {
  htmlEl.setAttribute("data-theme", theme);
  document
    .querySelectorAll(".theme-btn")
    .forEach((btn) => btn.classList.remove("theme-btn-active"));
  if (theme === "dark") {
    document
      .querySelectorAll("#darkThemeBtn,#darkThemeBtnMobile")
      .forEach((btn) => btn.classList.add("theme-btn-active"));
  } else {
    document
      .querySelectorAll("#lightThemeBtn,#lightThemeBtnMobile")
      .forEach((btn) => btn.classList.add("theme-btn-active"));
  }
  localStorage.setItem("kch-theme", theme);
}

["lightThemeBtn", "darkThemeBtn", "lightThemeBtnMobile", "darkThemeBtnMobile"]
  .forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener("click", () => {
      applyTheme(id.includes("dark") ? "dark" : "light");
    });
  });

const storedTheme = localStorage.getItem("kch-theme");
applyTheme(storedTheme === "dark" ? "dark" : "light");

// ---------- Языки (RU / EN / FR / ES) ----------
// простой словарь: ключ -> перевод в 4 языках
const i18n = {
  metaTitle: {
    ru: "Кирилл Чистов — Product Growth",
    en: "Kirill Chistov — Product & Growth",
    fr: "Kirill Chistov — Product & Growth",
    es: "Kirill Chistov — Product & Growth"
  },
  role: {
    ru: "Продукты и прибыль",
    en: "Products & Profit",
    fr: "Produits et revenus",
    es: "Productos e ingresos"
  },
  industries: {
    ru: "AdTech / MarTech / FinTech",
    en: "AdTech / MarTech / FinTech",
    fr: "AdTech / MarTech / FinTech",
    es: "AdTech / MarTech / FinTech"
  },
  name: {
    ru: "Кирилл Чистов",
    en: "Kirill Chistov",
    fr: "Kirill Chistov",
    es: "Kirill Chistov"
  },
  heroSubtitle: {
    ru: "Свежие продукты в AdTech/MarTech: помогу расти быстрее",
    en: "Fresh MarTech products for the market, help grow faster",
    fr: "Des produits MarTech innovants, pour une croissance plus rapide",
    es: "Nuevos productos MarTech para el mercado, ayudan a crecer más rápido"
  },
  heroP1: {
    ru: "Более 20 лет в product, маркетинге и развитии бизнеса в AdTech, MarTech, FinTech и IT. Помог 20+ martech‑стартапам пройти путь от гипотез до продукта с выручкой за 6–12 месяцев",
    en: "20+ years in product, marketing, and business growth across AdTech, MarTech, FinTech, and IT. Helped 20+ martech startups go from hypotheses to revenue‑generating products in 6–12 months",
    fr: "Plus de 20 ans en produit, marketing et développement de business dans l’AdTech, MarTech, FinTech et IT. J’ai aidé plus de 20 startups martech à passer des hypothèses aux produits générant du revenu en 6–12 mois",
    es: "Más de 20 años en producto, marketing y desarrollo de negocio en AdTech, MarTech, FinTech e IT. Ayudé a más de 20 startups martech a pasar de hipótesis a productos con ingresos en 6–12 meses"
  },
  heroP2: {
    ru: "Специализация: запуск и масштабирование B2B/B2B2B‑продуктов, unit‑экономика, сквозная аналитика и кратный рост выручки",
    en: "Focus: launching and scaling B2B/B2B2B products, unit economics, end‑to‑end analytics, and revenue growth",
    fr: "Spécialisation : lancement et scaling de produits B2B/B2B2B, unit economics, analytics de bout en bout et croissance du revenu",
    es: "Especialización: lanzamiento y escalado de productos B2B/B2B2B, unit economics, analítica end‑to‑end y crecimiento de ingresos"
  },
  contactsTitle: {
    ru: "Контакты",
    en: "Contacts",
    fr: "Contacts",
    es: "Contacto"
  },
  phoneLabel: {
    ru: "Телефон",
    en: "Phone",
    fr: "Téléphone",
    es: "Teléfono"
  },
  emailLabel: {
    ru: "Email",
    en: "Email",
    fr: "Email",
    es: "Email"
  },
  expTitle: {
    ru: "Опыт",
    en: "Experience",
    fr: "Expérience",
    es: "Experiencia"
  },
  expSubtitle: {
    ru: "Фокус на digital продуктах, активации роста выручки с помощью данных и креатива",
    en: "Focus on digital products, data-driven yet creative revenue growth activation",
    fr: "Concentrez-vous sur les produits numériques et activez une croissance des revenus à la fois créative et axée sur les données",
    es: "Centrarse en productos digitales, activación del crecimiento de ingresos creativo pero basado en datos"
  },
  exp1Role: {
    ru: "Директор по развитию продуктов",
    en: "Head of Product Growth",
    fr: "Directeur du développement produit",
    es: "Director de desarrollo de producto"
  },
  exp1Company: {
    ru: "ADV GROUP / ADV Tech · AdTech, MarTech",
    en: "ADV GROUP / ADV Tech · AdTech, MarTech",
    fr: "ADV GROUP / ADV Tech · AdTech, MarTech",
    es: "ADV GROUP / ADV Tech · AdTech, MarTech"
  },
  exp1Dates: {
    ru: "09.2019 – 04.2026",
    en: "09.2019 – 04.2026",
    fr: "09.2019 – 04.2026",
    es: "09.2019 – 04.2026"
  },
  exp1P1: {
    ru: "Провел 20+ martech‑стартапов от идеи до MVP с выручкой за <10 месяцев",
    en: "Helped 20+ martech startups jump from customer discovery to MVPs with revenue in under 10 months",
    fr: "Accélération de plus de 20 startups martech, du customer discovery au MVP/MLP générant du revenu en 6–12 mois",
    es: "Aceleración de más de 20 startups martech desde el customer discovery hasta el MVP/MLP con ingresos en 6–12 meses"
  },
  exp1P2: {
    ru: "Настройка продуктовых метрик, unit‑экономики и roadmap кратного роста",
    en: "Set up product metrics, unit economics, and growth roadmaps",
    fr: "Mise en place des métriques produit, de l’unit economics et des roadmaps de croissance",
    es: "Definición de métricas de producto, unit economics y roadmaps de crecimiento"
  },
  exp1P3: {
    ru: "Запуск и развитие B2B‑продуктов в AdTech‑экосистеме группы",
    en: "Launched and scaled B2B products in the group’s AdTech ecosystem",
    fr: "Lancement et scaling de produits B2B dans l’écosystème AdTech du groupe",
    es: "Lanzamiento y escalado de productos B2B en el ecosistema AdTech del grupo"
  },
  exp2Role: {
    ru: "Директор по маркетингу и развитию в ЮВА",
    en: "Chief Marketing Officer, Head of SEA Growth",
    fr: "Directeur marketing, responsable de la croissance en Asie du Sud-Est",
    es: "Director de Marketing, Responsable de Crecimiento del Sudeste Asiático"
  },
  exp2Company: {
    ru: "Стартап в сфере финансовых технологий",
    en: "FinTech startup",
    fr: "Startup de FinTech",
    es: "Startup de FinTec"
  },
  exp2Dates: {
    ru: "08.2018 – 09.2019",
    en: "08.2018 – 09.2019",
    fr: "08.2018 – 09.2019",
    es: "08.2018 – 09.2019"
  },
  exp2P1: {
    ru: "Рост объема выручки, расширение клиентской базы, повышени ROI",
    en: "Increase revenue, expand customer base, improve ROI",
    fr: "Recherche d'entreprise, gestion de la base client, optimisation du retour sur investissement",
    es: "Aumentar los ingresos, ampliar la base de clientes, mejorar el ROI"
  },
  exp3Role: {
    ru: "Директор по развитию, исполнительный директор",
    en: "Managing Director, Head of Growth",
    fr: "Directeur général, responsable de la croissance",
    es: "Director General, Jefe de Crecimiento"
  },
  exp3Company: {
    ru: "Digital агентства (Performance & Programmatic)",
    en: "Digital agencies (Performance & Programmatic)",
    fr: "Agences numériques (Performance et Programmatique)",
    es: "Agencias digitales (Performance y Programática)"
  },
  exp3Dates: {
    ru: "12.2010 – 07.2018",
    en: "12.2010 – 07.2018",
    fr: "12.2010 – 07.2018",
    es: "12.2010 – 07.2018"
  },
  exp3P1: {
    ru: "Создание новых продуктов - генераторов выручки, расширение базы ключевых клиентов",
    en: "Creation of new revenue-generating products and expansion of the key customer base",
    fr: "Création de nouveaux produits générateurs de revenus et élargissement de la clientèle clé",
    es: "Creación de nuevos productos generadores de ingresos y expansión de la base de clientes clave"
  },
  projectsTitle: {
    ru: "Проекты по вайб-разработке",
    en: "Vibecoding Projects",
    fr: "Projets de Vibecoding",
    es: "Proyectos de codificación de vibraciones"
  },
  projectsSubtitle: {
    ru: "Публичные репозитории и pet‑проекты с GitHub",
    en: "Public repositories and pet projects on GitHub",
    fr: "Dépôts publics et projets personnels sur GitHub",
    es: "Repositorios públicos y proyectos personales en GitHub"
  },
  skillsTitle: {
    ru: "Навыки",
    en: "Skills",
    fr: "Compétences",
    es: "Habilidades"
  },
  skillsPgTitle: {
    ru: "Управление продуктами",
    en: "Product Management",
    fr: "Gestion de produits",
    es: "Gestión de productos"
  },
  skillsAmTitle: {
    ru: "Управление маркетингом",
    en: "Marketing Management",
    fr: "Gestion de marketing",
    es: "Gestión de marketing"
  },
  skillsLeadTitle: {
    ru: "Командное лидерство",
    en: "Team Leadership",
    fr: "Leadership d'équipe",
    es: "Liderazgo de equipo"
  },
  skillsPg1: {
    ru: "Проработка продуктовых гипотез, стратегия вывода продукта на рынок",
    en: "Product discovery, customer development, Go-To-Market roadmap",
    fr: "Découverte de produits, développement de la clientèle, feuille de route de commercialisation",
    es: "Descubrimiento de productos, desarrollo de clientes, hoja de ruta de salida al mercado"
  },
  skillsPg2: {
    ru: "Создание MVP с подтвержденной ценностью, управление разработкой",
    en: "Build MVPs with proven value, manage development teams and projects",
    fr: "Création de MVP à valeur ajoutée avérée, gestion des équipes de développement et des projets",
    es: "Desarrollar MVP con valor demostrado, gestionar equipos de desarrollo y proyectos"
  },  
  skillsPg3: {
    ru: "Управление монетизацией, бюджетом и инвестициями",
    en: "Monetization, budget and investment management",
    fr: "Monétisation, gestion budgétaire et des investissements",
    es: "Monetización, gestión de presupuestos e inversiones"
  },
  skillsAm1: {
    ru: "Аналитика, атрибуция, расчет ROI по ключевых срезам",
    en: "Analytics, attribution, ROI drill-down by key metrics",
    fr: "Analyse, attribution, calcul du retour sur investissement par indicateurs clés",
    es: "Análisis, atribución y cálculo del ROI mediante métricas clave"
  },
  skillsAm2: {
    ru: "Управление рекламными и маркетинговыми кампаниями по целям",
    en: "Performance-driven marketing campaign management",
    fr: "Gestion de campagnes marketing axée sur la performance",
    es: "Gestión de campañas de marketing orientadas al rendimiento"
  },  
  skillsAm3: {
    ru: "Сегментация и анализ клиентов, удержание и рост LTV",
    en: "Customer analysis, retention and loyalty management",
    fr: "Analyse client, fidélisation et gestion de la loyauté",
    es: "Análisis, retención y gestión de fidelización de clientes"
  },
  skillsLead1: {
    ru: "Построение и развитие продуктовых команд в Lean формате",
    en: "Building and upgrading product teams using Lean approach",
    fr: "Création et amélioration des équipes produit selon l'approche Lean",
    es: "Creación y actualización de equipos de productos mediante el enfoque Lean"
  },
  skillsLead2: {
    ru: "Построение взаимодействия с фаундерами стартапов для ускорения роста",
    en: "Building relationships with startup founders to accelerate growth",
    fr: "Établir des relations avec les fondateurs de startups pour accélérer leur croissance",
    es: "Construir relaciones con fundadores de startups para acelerar el crecimiento"
  },  
  skillsLead3: {
    ru: "Внедрение мотивационных программ для роста эффективности корпоративных инноваций",
    en: "Implementation of incentive programs to increase the effectiveness of corporate innovations",
    fr: "Mise en œuvre de programmes d'incitation pour accroître l'efficacité des innovations d'entreprise",
    es: "Implementación de programas de incentivos para aumentar la efectividad de las innovaciones corporativas"
  },    
  // ... по аналогии можно продолжить остальные ключи,
  eduTitle: {
    ru: "Образование и хобби",
    en: "Education & hobbies",
    fr: "Éducation et loisirs",
    es: "Educación y aficiones"
  },

  eduDegreeTitle: {
    ru: "Высшее и доп.",
    en: "High school etc.",
    fr: "Supérieur etc.",
    es: "Superior etc."
  },

  eduDegree: {
    ru: "1995: МГАХМ, Криогенная техника",
    en: "1995: Academy for chemical engineering, cryogenics",
    fr: "1995: Académie de génie chimique, cryogénie",
    es: "1995: Academia de ingeniería química, criogenia"
  },

  eduAuxiliary: {
    ru: "1995-2026: 50+ тренингов и курсов",
    en: "1995-2026: 50+ trainings completed",
    fr: "1995-2026: 50+ formations terminées",
    es: "1995-2026: 50+ capacitaciones completadas"
  },

  langsTitle: {
    ru: "Языки",
    en: "Languages",
    fr: "Langages",
    es: "Idiomas"
  },

  langSp: {
    ru: "RU, EN, FR, ES",
    en: "RU, EN, FR, ES",
    fr: "RU, EN, FR, ES",
    es: "RU, EN, FR, ES"
  },

  langDev: {
    ru: "TypeScript, SQL, Python, VBA",
    en: "TypeScript, SQL, Python, VBA",
    fr: "TypeScript, SQL, Python, VBA",
    es: "TypeScript, SQL, Python, VBA"
  },

  hobbyTitle: {
    ru: "Хобби",
    en: "Hobbies",
    fr: "Loisirs",
    es: "Aficiones"
  },

  hobby: {
    ru: "путешествия, спорт, образование",
    en: "travel, sports, education",
    fr: "voyages, sports, éducation",
    es: "viajes, deportes, educación"
  },

  btnPdf: {
    ru: "Скачать PDF",
    en: "Download PDF",
    fr: "Télécharger le PDF",
    es: "Descargar PDF"
  },

  btnContact: {
    ru: "Связаться",
    en: "Contact",
    fr: "Contact",
    es: "Contacto"
  },
  formTitle: {
    ru: "Форма для связи",
    en: "Contact form",
    fr: "Formulaire de contact",
    es: "Formulario de contacto"
  },
  formSubtitle: {
    ru: "Задайте вопрос или предложите сотрудничество",
    en: "Ask a question or propose a collaboration",
    fr: "Posez une question ou proposez une collaboration",
    es: "Haz una pregunta o propone una colaboración"
  },
  formNameLabel: {
    ru: "Имя",
    en: "Name",
    fr: "Nom",
    es: "Nombre"
  },
  formEmailLabel: {
    ru: "Email",
    en: "Email",
    fr: "Email",
    es: "Email"
  },
  formMsgLabel: {
    ru: "Сообщение",
    en: "Message",
    fr: "Message",
    es: "Mensaje"
  },
  formSubmit: {
    ru: "Отправить",
    en: "Send",
    fr: "Envoyer",
    es: "Enviar"
  },
  formStatus: {
    ru: "Откроется почтовый клиент с подготовленным письмом",
    en: "Your mail client will open with a prepared message",
    fr: "Votre client mail va s’ouvrir avec un message prérempli",
    es: "Se abrirá tu cliente de correo con un mensaje preparado"
  },
  errName: {
    ru: "Пожалуйста, укажите имя",
    en: "Please enter your name",
    fr: "Merci d’indiquer votre nom",
    es: "Por favor indica tu nombre"
  },
  errEmailEmpty: {
    ru: "Пожалуйста, укажите email",
    en: "Please enter your email",
    fr: "Merci d’indiquer votre email",
    es: "Por favor indica tu email"
  },
  errEmailBad: {
    ru: "Похоже, это некорректный email",
    en: "This doesn’t look like a valid email",
    fr: "Cet email ne semble pas valide",
    es: "Este email no parece válido"
  },
  errMsg: {
    ru: "Напишите, пожалуйста, сообщение",
    en: "Please write a message",
    fr: "Merci d’écrire un message",
    es: "Por favor escribe un mensaje"
  },
  mailSubject: {
    ru: "Вопрос / предложение по резюме",
    en: "Question / proposal about the resume",
    fr: "Question / proposition concernant le CV",
    es: "Pregunta / propuesta sobre el CV"
  },
  footerText: {
    ru: "© <span id=\"year\"></span> Кирилл Чистов. Все норм",
    en: "© <span id=\"year\"></span> Kirill Chistov. Alright",
    fr: "© <span id=\"year\"></span> Kirill Chistov. Ca va",
    es: "© <span id=\"year\"></span> Kirill Chistov. No pasa nada"
  }
};

function getText(key) {
  const lang = document.documentElement.getAttribute("data-lang") || "ru";
  const entry = i18n[key];
  if (!entry) return "";
  return entry[lang] || entry["en"] || "";
}

function applyLanguage(lang) {
  document.documentElement.setAttribute("data-lang", lang);
  localStorage.setItem("kch-lang", lang);

  // активные кнопки
  document
    .querySelectorAll(".lang-btn")
    .forEach((btn) => btn.classList.remove("lang-btn-active"));
  document
    .querySelectorAll(`.lang-btn[data-lang="${lang}"]`)
    .forEach((btn) => btn.classList.add("lang-btn-active"));

  // все элементы с data-i18n
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key === "footerText") {
      el.innerHTML = getText(key);
      // вернуть год
      const yearEl = document.getElementById("year");
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    } else {
      el.innerHTML = getText(key);
    }
  });

  // title
  document.title = getText("metaTitle");
}

// привязка к кнопкам языков
document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.getAttribute("data-lang");
    applyLanguage(lang);
  });
});

// начальный язык
const storedLang = localStorage.getItem("kch-lang") || "ru";
applyLanguage(storedLang);

// ---------- Mobile menu ----------
const burgerBtn = document.getElementById("burgerBtn");
const mobileMenu = document.getElementById("mobileMenu");
const contactMobileLink = document.getElementById("contactMobileLink");

if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });
}
if (contactMobileLink && mobileMenu) {
  contactMobileLink.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
  });
}
