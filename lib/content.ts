export type MenuCategory = 'cucina' | 'cocktails' | 'shisha';

export type MenuItem = {
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  tags: string[];
  pairing?: string;
  available?: boolean;
};

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Prenota', href: '/prenotazioni' },
  { label: 'Narghilè', href: '/narghile' },
  { label: 'Eventi', href: '/eventi' },
  { label: 'Contatti', href: '/contatti' }
];

export const signatureDishes: MenuItem[] = [
  {
    name: 'Wagyu A5 & Oro',
    description: 'Miyazaki A5 scottato su pietra lavica, emulsione al tartufo d’Alba e foglia d’oro edibile.',
    price: 85,
    category: 'cucina',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfzdxdlFsLTUwYvfZ1ZdSfUWMwuEo_jAfbQTdgoiktsk7QbZO1w3QbqUGkKAigLTgQ0Yg_yo6689--tMbVw6uQnpO7yCoeOy_x9pV1astBXgbckSGm32PoC1ICgGqXqD5EmKdWPhCmUGtXuAj6E5xMLCLHdo9MAOwCiulWZElDmN27waUyILY2nFoZSEVEX5vo0xUFbJ-3eHljDPYe_XwImQOl7tOfo3MSNjgn-QIIVaxaT-_MyHC_MA',
    tags: ['Signature', 'Chef Special'],
    pairing: 'Barolo Riserva'
  },
  {
    name: 'Risotto al Tartufo',
    description: 'Riso Acquerello Riserva, mantecatura all’olio di nocciola e scaglie di tartufo nero uncinato.',
    price: 42,
    category: 'cucina',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRbtMdxk6HZnhy1P7UM0L8zJ6_NX9W5Omw0zlbZF4w-m_aaTdX-SX8YT9-_ir_xMRkRwLUJjwGoGFJYuYcbJx3RZklHZilvqZ4ciYoQfPeBfePA9nUkFF1Au0EkQad8lkcG_frl1PNxZPoquVqUN70tnsUNLlmExTsU3M5MqELA3JVh6YP4eMKkgTR-N8crTbQDHwTgHA_TmUzSmOzPP7evlqik5xD0Jz0Xy5YPF5Qm_samej1JBWFlw',
    tags: ['Vegetariano'],
    pairing: 'Blanc de Noirs'
  },
  {
    name: 'The Golden Smoke',
    description: 'Whisky torbato, bitter artigianale all’ambra, vapore di cannella e miele di zagara.',
    price: 26,
    category: 'cocktails',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5AjJnJdk0v0TPRGI51r-k2d65ZxkwtsfY57VwmEJDfxCRwNOgryduIqShvIpraxYxUNbZIfo9dkG28CHaThKVnCZv5wCIKRd-CHKZq1Uh2fI0AcgT4VyAAGXRst4cx458JHJk5yjjo3sUZD3EUyOAbBu13scVtHDCY3cUJaOhlk9ixZIKRgJzKUoo7HXIjjFBw6MPpBoGqVzdYkE-WEXZ0oLwHoxrevFwoWtn_4Ir3zF4yANtbTMpxQ',
    tags: ['Mixology', 'Smoked'],
    pairing: 'Dark Leaf Bourbon'
  }
];

export const menuItems: MenuItem[] = [
  ...signatureDishes,
  {
    name: 'Crudo di Scorfano',
    description: 'Scorfano mediterraneo, agrumi di Sicilia, olio extravergine e pepe di Garniers.',
    price: 24,
    category: 'cucina',
    image: signatureDishes[0].image,
    tags: ['Crudo', 'Pesce'],
    pairing: 'Etna Bianco'
  },
  {
    name: 'Tartare di Manzo',
    description: 'Manzo Black Angus, capperi, yolk confezionato e salsa black pepper.',
    price: 28,
    category: 'cucina',
    image: signatureDishes[0].image,
    tags: ['Raw', 'Black Pepper'],
    pairing: 'Negroni'
  },
  {
    name: 'Black Forest',
    description: 'Rum-barolo, ciliegia nera, cacao tostato e fumo di legno di cedro.',
    price: 24,
    category: 'cocktails',
    image: signatureDishes[2].image,
    tags: ['Sour', 'Barrel Aged'],
    pairing: 'Dark Chocolate'
  },
  {
    name: 'Velvet No. 7',
    description: 'Vodka infusa con vaniglia, vermut bianco, lime e una nota di pepe rosa.',
    price: 22,
    category: 'cocktails',
    image: signatureDishes[2].image,
    tags: ['Signature', 'Botanical'],
    pairing: 'Oscietra'
  },
  {
    name: 'Midnight Garden',
    description: 'Melassa, tè nero affumicato, lime, menta selvatica e tonica secca.',
    price: 19,
    category: 'cocktails',
    image: signatureDishes[2].image,
    tags: ['Zero Proof', 'Smoked'],
    pairing: 'No Alcohol'
  },
  {
    name: 'Dark Russian Blend',
    description: 'Foglia scura selezionata a mano, sciroppo di mela cotta e note di vaniglia.',
    price: 32,
    category: 'shisha',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBetW-1hn85wjRMoHbd-IYCRgDCncTsrqRc0QpEsVl50Q6SsR49DeA0dN7yTlalhYbz3hufu4fSFe478ggk2-1sxRb-Tn-fFaCk2jSD2mHb6Ab6O5eEkleVxvNTj8hvULx_KfroT7uZRX6E4G6_vFVD6QIq07CRECEfiWi3ktC0qAOefssAbadyzgUlUMOnGWRmFqwjGQJxUurVnk_6ABudj8b0qFATHMJf-PIEt-wTmdryJbQg4n1B6g',
    tags: ['Intensità 5/5', 'Fermentato'],
    pairing: 'Whisky torbato'
  },
  {
    name: 'White Grape Ceremony',
    description: 'Tabacco chiaro, uva moscato, fiori di gelsomino e carboni di cocco.',
    price: 28,
    category: 'shisha',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBetW-1hn85wjRMoHbd-IYCRgDCncTsrqRc0QpEsVl50Q6SsR49DeA0dN7yTlalhYbz3hufu4fSFe478ggk2-1sxRb-Tn-fFaCk2jSD2mHb6Ab6O5eEkleVxvNTj8hvULx_KfroT7uZRX6E4G6_vFVD6QIq07CRECEfiWi3ktC0qAOefssAbadyzgUlUMOnGWRmFqwjGQJxUurVnk_6ABudj8b0qFATHMJf-PIEt-wTmdryJbQg4n1B6g',
    tags: ['Intensità 3/5', 'Floral'],
    pairing: 'Sake Junmai'
  }
];

export const events = [
  {
    day: '18',
    month: 'OTT',
    title: 'Velvet Jazz & Sax Live',
    description: 'Jazz contemporaneo e sax dal vivo per una cena che si muove lentamente.',
    time: '21:30',
    tag: 'Live Music'
  },
  {
    day: '25',
    month: 'OTT',
    title: 'Deep Atmospheric Grooves',
    description: 'Deep house e organic beats selezionati dai resident fino all’alba.',
    time: '23:00',
    tag: 'DJ Set'
  },
  {
    day: '01',
    month: 'NOV',
    title: 'Private Shisha Masterclass',
    description: 'Degustazione guidata di tre blend rari con il nostro head sommelier.',
    time: '19:30',
    tag: 'Limited'
  }
];

export const galleryImages = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZS2dRHPUA9XagoChqlt1csvd7ZUiY5W0ib88SY00A68hYuKgCDmRYvxMB1ueVnzvTiNOl5M_Xk4aiZZHdNbvQ-DWhJJDprXKbV5RGt-ElBcp0Yu2eVvzwfrIC9Bod-jWGGGbXjUcDhZUtNxuT4hJPEbvEyALCw3GX0_aUOtDlef1FFs6fQ_eMogseBsmypyy6lP2NrZ80F5RWHPLmC-chobbiWCr8RiuXgUr2vjxqn2mog2uBW0Acqw',
    title: 'Il gran bancone in onice ambrato',
    alt: 'Bancone speakeasy in onice con bottiglie e luce cala'
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaY9skiXMxZRr_1oe1_lCKlkwaLDAYhJ6M9GhcpYo21vpRyWeuVASclv3ZbE7lqf317QIhvnSJytLSO6XdzoyUGtqMiBuuah1bB7nSh4MKwXwWtUo3e2_3nZwahEIbqSqg7WtDZktSPBVFTDshqIuNeRbL64lY2VSw6RLnAeZHDvC-k_O7eoePvTChy_9O5_RxHp3wsC1-Ro3Htaw_PQysDcwA8jO2BN7H3WnViMn95TurjYyajB4BdA',
    title: 'Riserva speciale spiriti',
    alt: 'Bottiglie di whiskey e cognac su mensole in ottone'
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxAN2suSsSCiKkigM0Lmi9t7CBXqvwah4eF1tid1gkPSZDJJ9rDYvp0K1n0grRId9idzloPkiBVgTczq5lO_A1cbHrhzTiUwgi6pwo9Lb1xSW2wf41hPHEbEhXmgXddYFkrneG54m37OVCFYymZ7gepYi2GL7GFU1uFFEGxKsdS9jdnDUS3tU5C4pdDlNA5Eh6QA_VabXM-03p-KYYpoKptQvQ_PQ9eUstkU8taW-VWkeS8MnFR-Neew',
    title: 'Alcove riservate & velluto',
    alt: 'Alcova privata con sedili in velluto nero e luce calda'
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQuxqWO56INERVKLI3u9_9uO1CUnlauaLTYk1eY98DaODkqcnm9hXErp2_E35o2q8uj4AwD4KtK4wFRYIp9KpoR1VrNCu3YaMOaQG93Aqquy-2jSlykRi_Ba45_KyjAxLh4Zm5X8ig0nsDdXOtzHTwM8slexPjJyKdqnlSmnLUgcNsGQPmMb6f0TV7GLJ-LmXsfXJlsNTGR_a5I8V9d_fjmkkQJqavxAp1E9HPh4Je8VaP5KGab26B1w',
    title: 'Volute aromatiche',
    alt: 'Fumo aromatico in un bicchiere di cristallo illuminato'
  }
];

export const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8dUl7Ds0uAX1Tpd_bv9lI_L2IECBmCizKHcVNvquGKQrGGm3GuIa0FGfU2I0l2OZ1P6UuBEBr-aXllI9FNJ_MmmhcNTL42ILt4O5rEi2YS-M639PGRZoEgyTj-kFL1SnSmuWtBcsl6sOL4qoS8XlpQbbTNhKhLSuX4MXRyEF3NufxEROpS-6r03UWwsiiudxrIr3IkuswIILx11X0m_jnTDI5PMdapyiv86ywvc0AoIKapSxeVWBwlw';

export const storyImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3n05LEEsCRFFVwTVMjWlpC4dlM8LIAp8dSnXkbppOONGWXhempZlFW0G2PrR50vyeoG4ZJnTEKSHy8cM1lLnYOA9iql_TD5_00wKiOMysKK158gdy3Ba5zVk9eCDSxUqwAD4_Vx6rN7w5RNLzHCM3wOVaks5o25Ceb6_ixQcOqAmOVAvCok8s7qqjKR5h_rAwR_6_goUd07p27aHpRCaUHDP5TnMuKXQ7ce7nK44bi1F_nP7jux0eZA';

export const shishaImage = menuItems[5].image;
