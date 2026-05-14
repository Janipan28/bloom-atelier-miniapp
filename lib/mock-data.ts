import type {
  Addon,
  Address,
  Branch,
  Category,
  Collection,
  OrderSummary,
  Product,
  PromoCode,
  Review,
} from "./types";

const SIZES_STANDARD = [
  { code: "S" as const, label: "S · компактный", multiplier: 0.85 },
  { code: "M" as const, label: "M · стандартный", multiplier: 1 },
  { code: "L" as const, label: "L · большой", multiplier: 1.35 },
];

const SIZES_PREMIUM = [
  { code: "M" as const, label: "M · 25 цветков", multiplier: 1 },
  { code: "L" as const, label: "L · 51 цветок", multiplier: 1.8 },
];

/* ────────────────────────────────────────────────────────────────
   Real Unsplash photos. Stable IDs that Unsplash guarantees to keep.
   `auto=format&fit=crop&w=900&q=80` makes them lightweight.
   ──────────────────────────────────────────────────────────────── */
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Букет «Нежность»",
    slug: "nezhnost",
    price: 4900,
    oldPrice: 5800,
    description:
      "Невесомый букет из пионов и эвкалипта — мягкие переходы пастельных тонов и долгая стойкость.",
    composition:
      "Пионы — 5 шт., эвкалипт парвифолия, лента из натурального шёлка",
    images: [
      img("1487530811176-3780de880c2d"),
      img("1490578474895-699cd4e2cf59"),
      img("1502977249166-824b3a8a4d6d"),
    ],
    stock_status: "available",
    is_featured: true,
    is_new: false,
    badges: ["bestseller", "sale"],
    category: "romance",
    collectionSlugs: ["pastel", "bestsellers"],
    tags: ["пионы", "пастель", "свидание"],
    rating: 4.9,
    reviewCount: 124,
    sizes: SIZES_STANDARD,
  },
  {
    id: 2,
    title: "Композиция «Весна»",
    slug: "vesna",
    price: 3500,
    description:
      "Сезонная композиция в плетёной корзинке. Свежие тюльпаны и фактурная зелень.",
    composition: "Тюльпаны 7 шт., рускус, ваксфлауэр, плетёная корзинка",
    images: [
      img("1469474968028-56623f02e42e"),
      img("1455659817273-f96807779a8a"),
    ],
    stock_status: "available",
    is_featured: true,
    is_new: true,
    badges: ["new"],
    category: "seasonal",
    collectionSlugs: ["spring", "compositions"],
    tags: ["тюльпаны", "весна", "корзинка"],
    rating: 4.8,
    reviewCount: 67,
    sizes: SIZES_STANDARD,
  },
  {
    id: 3,
    title: "Монобукет «Алые розы»",
    slug: "alye-rozy",
    price: 6900,
    description:
      "Классика жанра: голландские эквадорские розы Freedom высотой 70 см.",
    composition: "Роза Freedom 25 шт., упаковка крафт",
    images: [
      img("1561181286-d3fee7d55364"),
      img("1490578474895-699cd4e2cf59"),
    ],
    stock_status: "available",
    is_featured: true,
    is_new: false,
    badges: ["bestseller"],
    category: "romance",
    collectionSlugs: ["bestsellers", "mono"],
    tags: ["розы", "красные", "классика"],
    rating: 5,
    reviewCount: 312,
    sizes: SIZES_PREMIUM,
  },
  {
    id: 4,
    title: "Букет «Утро»",
    slug: "utro",
    price: 4200,
    description:
      "Свежий микс с ароматной фрезией и кустовой розой. Бодрит как кофе по утрам.",
    composition: "Фрезия, кустовая роза, гипсофила, эвкалипт",
    images: [
      img("1469259943454-aa100abba749"),
      img("1490750967868-88aa4486c946"),
    ],
    stock_status: "available",
    is_featured: false,
    is_new: true,
    badges: ["new"],
    category: "everyday",
    collectionSlugs: ["spring"],
    tags: ["фрезия", "ароматный"],
    rating: 4.7,
    reviewCount: 41,
    sizes: SIZES_STANDARD,
  },
  {
    id: 5,
    title: "Букет «Премиум Bordeaux»",
    slug: "premium-bordeaux",
    price: 12900,
    description:
      "Глубокие винные розы, орхидеи и амарант в шёлковой обёртке. Для важных моментов.",
    composition: "Роза Black Baccara 11 шт., орхидея, амарант, шёлк, лента",
    images: [
      img("1518895949257-7621c3c786d7"),
      img("1490578474895-699cd4e2cf59"),
    ],
    stock_status: "low_stock",
    is_featured: true,
    is_new: false,
    badges: ["premium"],
    category: "premium",
    collectionSlugs: ["premium", "mono"],
    tags: ["премиум", "розы", "винный"],
    rating: 5,
    reviewCount: 28,
    sizes: SIZES_PREMIUM,
  },
  {
    id: 6,
    title: "Букет «Полевой»",
    slug: "polevoy",
    price: 2800,
    description:
      "Лёгкий букет в стиле «только что с луга». Полевые ромашки и луговые травы.",
    composition: "Ромашки, васильки, лаванда, дикий овёс, шпагат",
    images: [
      img("1463320726281-696a485928c7"),
      img("1493882552576-fce827c6161e"),
    ],
    stock_status: "available",
    is_featured: false,
    is_new: false,
    badges: [],
    category: "everyday",
    collectionSlugs: ["compositions"],
    tags: ["полевые", "натуральный"],
    rating: 4.6,
    reviewCount: 52,
    sizes: SIZES_STANDARD,
  },
  {
    id: 7,
    title: "Букет «Невеста»",
    slug: "nevesta",
    price: 8500,
    description:
      "Белоснежный свадебный букет с пионами, эустомой и нежной зеленью. Сборка под ваш день.",
    composition: "Пионы белые, эустома, ранункулюс, эвкалипт, атлас",
    images: [
      img("1525772764200-be829a350797"),
      img("1518895949257-7621c3c786d7"),
    ],
    stock_status: "available",
    is_featured: true,
    is_new: false,
    badges: ["premium"],
    category: "wedding",
    collectionSlugs: ["wedding", "pastel"],
    tags: ["свадьба", "белый", "пионы"],
    rating: 5,
    reviewCount: 19,
    sizes: SIZES_STANDARD,
  },
  {
    id: 8,
    title: "Композиция «Сад»",
    slug: "sad",
    price: 5200,
    description:
      "Зелёная композиция в керамическом кашпо. Долго радует и легко уходит за собой.",
    composition: "Гипсофила, рускус, питтоспорум, керамика",
    images: [
      img("1455659817273-f96807779a8a"),
      img("1469259943454-aa100abba749"),
    ],
    stock_status: "available",
    is_featured: false,
    is_new: true,
    badges: ["new"],
    category: "compositions",
    collectionSlugs: ["compositions"],
    tags: ["зелёный", "керамика"],
    rating: 4.7,
    reviewCount: 33,
    sizes: SIZES_STANDARD,
  },
  {
    id: 9,
    title: "Букет «Тропики»",
    slug: "tropiki",
    price: 7400,
    description:
      "Яркий контраст: стрелиции, антуриумы и монстера. Уверенно держат форму до 10 дней.",
    composition: "Стрелиция, антуриум, монстера, бамбук",
    images: [
      img("1490578474895-699cd4e2cf59"),
      img("1518895949257-7621c3c786d7"),
    ],
    stock_status: "available",
    is_featured: false,
    is_new: false,
    badges: [],
    category: "exotic",
    collectionSlugs: ["bestsellers"],
    tags: ["экзотика", "яркий"],
    rating: 4.8,
    reviewCount: 22,
    sizes: SIZES_STANDARD,
  },
  {
    id: 10,
    title: "Букет «Mama»",
    slug: "mama",
    price: 4500,
    oldPrice: 5200,
    description:
      "Тёплый микс ярких роз и сухоцвета — подарок, который хочется отправить маме.",
    composition: "Роза Шангрила, гипсофила, лагурус, крафт-упаковка",
    images: [
      img("1487530811176-3780de880c2d"),
      img("1469259943454-aa100abba749"),
    ],
    stock_status: "available",
    is_featured: true,
    is_new: false,
    badges: ["sale", "bestseller"],
    category: "everyday",
    collectionSlugs: ["bestsellers"],
    tags: ["для мамы", "розы"],
    rating: 4.9,
    reviewCount: 89,
    sizes: SIZES_STANDARD,
  },
  {
    id: 11,
    title: "Корпоративный букет «Office»",
    slug: "office",
    price: 6200,
    description:
      "Сдержанный сезонный букет для офиса. Подойдёт под любой интерьер.",
    composition: "Хризантема, рускус, лизиантус, статица",
    images: [
      img("1469474968028-56623f02e42e"),
      img("1502977249166-824b3a8a4d6d"),
    ],
    stock_status: "available",
    is_featured: false,
    is_new: false,
    badges: [],
    category: "corporate",
    collectionSlugs: [],
    tags: ["корпоратив", "офис"],
    rating: 4.5,
    reviewCount: 14,
    sizes: SIZES_STANDARD,
  },
  {
    id: 12,
    title: "Букет «Лаванда»",
    slug: "lavanda",
    price: 3200,
    description:
      "Маленький, но насыщенный букет с натуральной лавандой. Аромат держится неделями.",
    composition: "Лаванда, лагурус, эвкалипт, бечёвка",
    images: [
      img("1490578474895-699cd4e2cf59"),
      img("1455659817273-f96807779a8a"),
    ],
    stock_status: "available",
    is_featured: false,
    is_new: false,
    badges: [],
    category: "dried",
    collectionSlugs: ["compositions"],
    tags: ["лаванда", "сухоцвет"],
    rating: 4.8,
    reviewCount: 76,
    sizes: SIZES_STANDARD,
  },
  {
    id: 13,
    title: "Букет «Парижанка»",
    slug: "parijanka",
    price: 5400,
    description:
      "Романтичный букет в стиле парижских цветочных лавок. С нежной хлопковой обёрткой.",
    composition: "Роза кустовая, маттиола, эвкалипт, хлопок",
    images: [
      img("1502977249166-824b3a8a4d6d"),
      img("1525772764200-be829a350797"),
    ],
    stock_status: "available",
    is_featured: true,
    is_new: true,
    badges: ["new"],
    category: "romance",
    collectionSlugs: ["pastel"],
    tags: ["романтика", "пастель"],
    rating: 4.9,
    reviewCount: 47,
    sizes: SIZES_STANDARD,
  },
  {
    id: 14,
    title: "Букет «Сезон ягод»",
    slug: "season-yagod",
    price: 6700,
    description:
      "Тёплый осенний микс с гиперикумом и ветками рябины. Согревает в любую погоду.",
    composition: "Роза, гиперикум, рябина, эвкалипт, лента",
    images: [
      img("1493882552576-fce827c6161e"),
      img("1469474968028-56623f02e42e"),
    ],
    stock_status: "available",
    is_featured: false,
    is_new: false,
    badges: ["bestseller"],
    category: "seasonal",
    collectionSlugs: ["bestsellers"],
    tags: ["осень", "ягоды"],
    rating: 4.8,
    reviewCount: 35,
    sizes: SIZES_STANDARD,
  },
  {
    id: 15,
    title: "Букет «День Рождения»",
    slug: "den-rozhdeniya",
    price: 4800,
    description:
      "Яркий и весёлый букет с герберами и кустовыми розами. Универсальный подарок.",
    composition: "Гербера, кустовая роза, статица, ваксфлауэр",
    images: [
      img("1518895949257-7621c3c786d7"),
      img("1487530811176-3780de880c2d"),
    ],
    stock_status: "available",
    is_featured: true,
    is_new: false,
    badges: [],
    category: "birthday",
    collectionSlugs: ["bestsellers"],
    tags: ["день рождения", "яркий"],
    rating: 4.8,
    reviewCount: 102,
    sizes: SIZES_STANDARD,
  },
  {
    id: 16,
    title: "Премиум коробка «51 роза»",
    slug: "51-roza",
    price: 14900,
    description:
      "51 эквадорская роза в дизайнерской шляпной коробке. Производит впечатление с первого взгляда.",
    composition: "Эквадорская роза 51 шт., шляпная коробка, флористическая пена",
    images: [
      img("1561181286-d3fee7d55364"),
      img("1518895949257-7621c3c786d7"),
    ],
    stock_status: "low_stock",
    is_featured: true,
    is_new: false,
    badges: ["premium", "bestseller"],
    category: "premium",
    collectionSlugs: ["premium"],
    tags: ["премиум", "коробка", "розы"],
    rating: 5,
    reviewCount: 58,
    sizes: SIZES_PREMIUM,
  },
];

export const CATEGORIES: Category[] = [
  { slug: "romance", title: "Романтика", emoji: "💕" },
  { slug: "birthday", title: "День рождения", emoji: "🎂" },
  { slug: "wedding", title: "Свадебные", emoji: "💍" },
  { slug: "premium", title: "Премиум", emoji: "✨" },
  { slug: "everyday", title: "На каждый день", emoji: "🌸" },
  { slug: "seasonal", title: "Сезонные", emoji: "🍂" },
  { slug: "compositions", title: "Композиции", emoji: "🌿" },
  { slug: "exotic", title: "Экзотика", emoji: "🌺" },
  { slug: "dried", title: "Сухоцветы", emoji: "🌾" },
  { slug: "corporate", title: "Корпоративные", emoji: "🏢" },
];

export const COLLECTIONS: Collection[] = [
  {
    slug: "pastel",
    title: "Пастельная коллекция",
    subtitle: "Нежные тона и спокойные сочетания",
    cover: img("1525772764200-be829a350797"),
  },
  {
    slug: "bestsellers",
    title: "Хиты сезона",
    subtitle: "Чаще всего заказывают",
    cover: img("1561181286-d3fee7d55364"),
  },
  {
    slug: "premium",
    title: "Премиум линия",
    subtitle: "Особые моменты заслуживают особого подхода",
    cover: img("1518895949257-7621c3c786d7"),
  },
  {
    slug: "spring",
    title: "Весна 2026",
    subtitle: "Сезонные находки наших флористов",
    cover: img("1469474968028-56623f02e42e"),
  },
  {
    slug: "wedding",
    title: "Свадьбы",
    subtitle: "Сборка букета невесты под ваш день",
    cover: img("1525772764200-be829a350797"),
  },
  {
    slug: "compositions",
    title: "Композиции",
    subtitle: "В корзинках и шляпных коробках",
    cover: img("1455659817273-f96807779a8a"),
  },
  {
    slug: "mono",
    title: "Моно-букеты",
    subtitle: "Один сорт, максимальный эффект",
    cover: img("1469474968028-56623f02e42e"),
  },
];

export const ADDONS: Addon[] = [
  {
    code: "packaging",
    title: "Премиум упаковка",
    description: "Шёлковая лента, дизайнерская крафт-бумага",
    price: 300,
  },
  {
    code: "postcard",
    title: "Открытка от руки",
    description: "Флорист напишет ваше пожелание чернилами",
    price: 150,
  },
  {
    code: "balloon",
    title: "Воздушный шар",
    description: "Латексный шар или фольгированная фигура",
    price: 350,
  },
  {
    code: "candy",
    title: "Шоколадные конфеты",
    description: "Коробка крафтовых трюфелей 12 шт.",
    price: 600,
  },
  {
    code: "vase",
    title: "Стеклянная ваза",
    description: "Прозрачная цилиндрическая ваза 25 см",
    price: 800,
  },
];

export const BRANCHES: Branch[] = [
  {
    id: 1,
    slug: "center",
    title: "Bloom Atelier · Центр",
    address: "ул. Цветочная, 10",
    work_hours: "10:00–21:00",
    phone: "+7 800 000-00-01",
  },
  {
    id: 2,
    slug: "north",
    title: "Bloom Atelier · Север",
    address: "ул. Лесная, 5",
    work_hours: "09:00–20:00",
    phone: "+7 800 000-00-02",
  },
  {
    id: 3,
    slug: "south",
    title: "Bloom Atelier · Юг",
    address: "ул. Садовая, 18",
    work_hours: "10:00–22:00",
    phone: "+7 800 000-00-03",
  },
];

export const PROMO_CODES: Record<string, PromoCode> = {
  SPRING2026: {
    type: "percent",
    value: 10,
    description: "Сезонная скидка 10% весна 2026",
  },
  FIRST500: {
    type: "fixed",
    value: 500,
    description: "Скидка 500 ₽ на первый заказ",
  },
  LOVE15: {
    type: "percent",
    value: 15,
    description: "−15% к Дню Святого Валентина",
  },
  PREMIUM1000: {
    type: "fixed",
    value: 1000,
    description: "−1 000 ₽ при заказе от 10 000 ₽",
  },
};

export const DELIVERY_PRICE = 500;

export const MOCK_ORDERS: OrderSummary[] = [
  {
    id: 1042,
    productTitle: "Букет «Нежность»",
    total: 5550,
    status: "in_progress",
    statusLabel: "Флорист собирает",
    createdAt: "Сегодня, 14:32",
    itemsCount: 1,
  },
  {
    id: 1041,
    productTitle: "Композиция «Весна»",
    total: 3500,
    status: "delivered",
    statusLabel: "Доставлен",
    createdAt: "9 мая",
    itemsCount: 1,
  },
  {
    id: 1037,
    productTitle: "Букет «Премиум Bordeaux» + 2 шт.",
    total: 17200,
    status: "delivered",
    statusLabel: "Доставлен",
    createdAt: "23 апреля",
    itemsCount: 3,
  },
];

export const MOCK_ADDRESSES: Address[] = [
  { id: 1, title: "Дом", full: "ул. Профсоюзная 12, кв. 45" },
  { id: 2, title: "Работа", full: "БЦ «Цветочная Поляна», офис 305" },
];

export const REVIEWS: Review[] = [
  {
    id: 1,
    author: "Мария К.",
    rating: 5,
    text: "Букет даже красивее, чем на фото. Курьер приехал точно в срок, цветы свежие, на третий день только начали распускаться.",
    date: "12 мая",
  },
  {
    id: 2,
    author: "Александр Г.",
    rating: 5,
    text: "Заказал на годовщину — жена в восторге. Открытка от руки — отдельный приятный сюрприз.",
    date: "8 мая",
  },
  {
    id: 3,
    author: "Ирина С.",
    rating: 4,
    text: "Хороший букет, чуть отличался от картинки по составу, но флорист подобрал замену так, что выглядело даже лучше.",
    date: "29 апреля",
  },
];

/* ────────────────────────────────────────────────────────────────
   Helper accessors
   ──────────────────────────────────────────────────────────────── */

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.category === slug);
}

export function getProductsByCollection(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.collectionSlugs.includes(slug));
}

export function getRelatedProducts(productId: number, limit = 6): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  return PRODUCTS.filter(
    (p) => p.id !== productId && p.category === product.category,
  ).slice(0, limit);
}

export function getAddonByCode(code: string): Addon | undefined {
  return ADDONS.find((a) => a.code === code);
}

export function getPromo(code: string): PromoCode | undefined {
  return PROMO_CODES[code.trim().toUpperCase()];
}

export function categoryCount(): Category[] {
  return CATEGORIES.map((c) => ({
    ...c,
    count: PRODUCTS.filter((p) => p.category === c.slug).length,
  }));
}
