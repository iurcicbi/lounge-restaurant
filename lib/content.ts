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
  { label: 'Acasă', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Rezervă', href: '/prenotazioni' },
  { label: 'Narghilă', href: '/narghile' },
  { label: 'Evenimente', href: '/eventi' },
  { label: 'Contacte', href: '/contatti' }
];

export const signatureDishes: MenuItem[] = [
  {
    name: 'Wagyu A5 & Aur',
    description: 'Miyazaki A5 la cuptor pe piatră vulcanică, emulsie de trufă Alba și frunză de aur comestibilă.',
    price: 85,
    category: 'cucina',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfzdxdlFsLTUwYvfZ1ZdSfUWMwuEo_jAfbQTdgoiktsk7QbZO1w3QbqUGkKAigLTgQ0Yg_yo6689--tMbVw6uQnpO7yCoeOy_x9pV1astBXgbckSGm32PoC1ICgGqXqD5EmKdWPhCmUGtXuAj6E5xMLCLHdo9MAOwCiulWZElDmN27waUyILY2nFoZSEVEX5vo0xUFbJ-3eHljDPYe_XwImQOl7tOfo3MSNjgn-QIIVaxaT-_MyHC_MA',
    tags: ['Semnătură', 'Specialul Bucătarului'],
    pairing: 'Barolo Riserva'
  },
  {
    name: 'Risotto cu Trufă',
    description: 'Oryza Acquerello Riserva, finisat cu ulei de nucă și lamele de trufă neagră de Alba.',
    price: 42,
    category: 'cucina',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRbtMdxk6HZnhy1P7UM0L8zJ6_NX9W5Omw0zlbZF4w-m_aaTdX-SX8YT9-_ir_xMRkRwLUJjwGoGFJYuYcbJx3RZklHZilvqZ4ciYoQfPeBfePA9nUkFF1Au0EkQad8lkcG_frl1PNxZPoquVqUN70tnsUNLlmExTsU3M5MqELA3JVh6YP4eMKkgTR-N8crTbQDHwTgHA_TmUzSmOzPP7evlqik5xD0Jz0Xy5YPF5Qm_samej1JBWFlw',
    tags: ['Vegetarian'],
    pairing: 'Blanc de Noirs'
  },
  {
    name: 'The Golden Smoke',
    description: 'Whisky turbă, bitter artizanal ambră, vapori de scorțișoară și miere de citrice.',
    price: 26,
    category: 'cocktails',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5AjJnJdk0v0TPRGI51r-k2d65ZxkwtsfY57VwmEJDfxCRwNOgryduIqShvIpraxYxUNbZIfo9dkG28CHaThKVnCZv5wCIKRd-CHKZq1Uh2fI0AcgT4VyAAGXRst4cx458JHJk5yjjo3sUZD3EUyOAbBu13scVtHDCY3cUJaOhlk9ixZIKRgJzKUoo7HXIjjFBw6MPpBoGqVzdYkE-WEXZ0oLwHoxrevFwoWtn_4Ir3zF4yANtbTMpxQ',
    tags: ['Mixologie', 'Afumat'],
    pairing: 'Dark Leaf Bourbon'
  }
];

export const menuItems: MenuItem[] = [
  ...signatureDishes,
  {
    name: 'Crudo de Biban',
    description: 'Biban mediteraneean, citrace siciliene, ulei de măsline extravirgin și piper Garniers.',
    price: 24,
    category: 'cucina',
    image: signatureDishes[0].image,
    tags: ['Crudo', 'Pește'],
    pairing: 'Etna Bianco'
  },
  {
    name: 'Tartar de Vită',
    description: 'Vită Black Angus, capere, gălbenuș preparat și sos de piper negru.',
    price: 28,
    category: 'cucina',
    image: signatureDishes[0].image,
    tags: ['Crud', 'Piper negru'],
    pairing: 'Negroni'
  },
  {
    name: 'Black Forest',
    description: 'Rum-barolo, cireașă neagră, cacao prăjită și fum de lemn de cedru.',
    price: 24,
    category: 'cocktails',
    image: signatureDishes[2].image,
    tags: ['Sour', 'Matured în Butoi'],
    pairing: 'Ciocolată neagră'
  },
  {
    name: 'Velvet No. 7',
    description: 'Vodka infuzată cu vanilie, vermut alb, lime și o notă de piper roz.',
    price: 22,
    category: 'cocktails',
    image: signatureDishes[2].image,
    tags: ['Semnătură', 'Botanic'],
    pairing: 'Oscietra'
  },
  {
    name: 'Midnight Garden',
    description: 'Melasă, ceai negru afumat, lime, mentă sălbatică și tonic dry.',
    price: 19,
    category: 'cocktails',
    image: signatureDishes[2].image,
    tags: ['Fără alcool', 'Afumat'],
    pairing: 'Fără alcool'
  },
  {
    name: 'Dark Russian Blend',
    description: 'Frunză întunecată selectată manual, sirop de măr fiert și note de vanilie.',
    price: 32,
    category: 'shisha',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBetW-1hn85wjRMoHbd-IYCRgDCncTsrqRc0QpEsVl50Q6SsR49DeA0dN7yTlalhYbz3hufu4fSFe478ggk2-1sxRb-Tn-fFaCk2jSD2mHb6Ab6O5eEkleVxvNTj8hvULx_KfroT7uZRX6E4G6_vFVD6QIq07CRECEfiWi3ktC0qAOefssAbadyzgUlUMOnGWRmFqwjGQJxUurVnk_6ABudj8b0qFATHMJf-PIEt-wTmdryJbQg4n1B6g',
    tags: ['Intensitate 5/5', 'Fermentat'],
    pairing: 'Whisky turbă'
  },
  {
    name: 'White Grape Ceremony',
    description: 'Tutun ușor, struguri Muscat, flori de iasomie și cărbuni de cocos.',
    price: 28,
    category: 'shisha',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBetW-1hn85wjRMoHbd-IYCRgDCncTsrqRc0QpEsVl50Q6SsR49DeA0dN7yTlalhYbz3hufu4fSFe478ggk2-1sxRb-Tn-fFaCk2jSD2mHb6Ab6O5eEkleVxvNTj8hvULx_KfroT7uZRX6E4G6_vFVD6QIq07CRECEfiWi3ktC0qAOefssAbadyzgUlUMOnGWRmFqwjGQJxUurVnk_6ABudj8b0qFATHMJf-PIEt-wTmdryJbQg4n1B6g',
    tags: ['Intensitate 3/5', 'Floral'],
    pairing: 'Sake Junmai'
  }
];

export const events = [
  {
    day: '18',
    month: 'OCT',
    title: 'Velvet Jazz & Sax Live',
    description: 'Jazz contemporan și saxofon live pentru o cină care se desfășoară lent.',
    time: '21:30',
    tag: 'Muzică live'
  },
  {
    day: '25',
    month: 'OCT',
    title: 'Deep Atmospheric Grooves',
    description: 'Deep house și organic beats selectate de rezidenți până la zori.',
    time: '23:00',
    tag: 'DJ Set'
  },
  {
    day: '01',
    month: 'NOV',
    title: 'Private Shisha Masterclass',
    description: 'Degustare ghidată a trei blend-uri rare alături de head sommelier-ul nostru.',
    time: '19:30',
    tag: 'Locuri limitate'
  }
];

export const galleryImages = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZS2dRHPUA9XagoChqlt1csvd7ZUiY5W0ib88SY00A68hYuKgCDmRYvxMB1ueVnzvTiNOl5M_Xk4aiZZHdNbvQ-DWhJJDprXKbV5RGt-ElBcp0Yu2eVvzwfrIC9Bod-jWGGGbXjUcDhZUtNxuT4hJPEbvEyALCw3GX0_aUOtDlef1FFs6fQ_eMogseBsmypyy6lP2NrZ80F5RWHPLmC-chobbiWCr8RiuXgUr2vjxqn2mog2uBW0Acqw',
    title: 'Barul mare în onix ambrat',
    alt: 'Bar speakeasy din onix, cu sticle și lumină difuză'
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaY9skiXMxZRr_1oe1_lCKlkwaLDAYhJ6M9GhcpYo21vpRyWeuVASclv3ZbE7lqf317QIhvnSJytLSO6XdzoyUGtqMiBuuah1bB7nSh4MKwXwWtUo3e2_3nZwahEIbqSqg7WtDZktSPBVFTDshqIuNeRbL64lY2VSw6RLnAeZHDvC-k_O7eoePvTChy_9O5_RxHp3wsC1-Ro3Htaw_PQysDcwA8jO2BN7H3WnViMn95TurjYyajB4BdA',
    title: 'Rezerva specială de spiritoase',
    alt: 'Sticle de whiskey și cognac pe rafturi de alamă'
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxAN2suSsSCiKkigM0Lmi9t7CBXqvwah4eF1tid1gkPSZDJJ9rDYvp0K1n0grRId9idzloPkiBVgTczq5lO_A1cbHrhzTiUwgi6pwo9Lb1xSW2wf41hPHEbEhXmgXddYFkrneG54m37OVCFYymZ7gepYi2GL7GFU1uFFEGxKsdS9jdnDUS3tU5C4pdDlNA5Eh6QA_VabXM-03p-KYYpoKptQvQ_PQ9eUstkU8taW-VWkeS8MnFR-Neew',
    title: 'Alcove rezervate & catife',
    alt: 'Alcovă privată cu bănci de catifea neagră și lumină caldă'
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQuxqWO56INERVKLI3u9_9uO1CUnlauaLTYk1eY98DaODkqcnm9hXErp2_E35o2q8uj4AwD4KtK4wFRYIp9KpoR1VrNCu3YaMOaQG93Aqquy-2jSlykRi_Ba45_KyjAxLh4Zm5X8ig0nsDdXOtzHTwM8slexPjJyKdqnlSmnLUgcNsGQPmMb6f0TV7GLJ-LmXsfXJlsNTGR_a5I8V9d_fjmkkQJqavxAp1E9HPh4Je8VaP5KGab26B1w',
    title: 'Volute aromatice',
    alt: 'Fum aromatic într-un pahar de cristal iluminat'
  }
];

export const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8dUl7Ds0uAX1Tpd_bv9lI_L2IECBmCizKHcVNvquGKQrGGm3GuIa0FGfU2I0l2OZ1P6UuBEBr-aXllI9FNJ_MmmhcNTL42ILt4O5rEi2YS-M639PGRZoEgyTj-kFL1SnSmuWtBcsl6sOL4qoS8XlpQbbTNhKhLSuX4MXRyEF3NufxEROpS-6r03UWwsiiudxrIr3IkuswIILx11X0m_jnTDI5PMdapyiv86ywvc0AoIKapSxeVWBwlw';

export const storyImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3n05LEEsCRFFVwTVMjWlpC4dlM8LIAp8dSnXkbppOONGWXhempZlFW0G2PrR50vyeoG4ZJnTEKSHy8cM1lLnYOA9iql_TD5_00wKiOMysKK158gdy3Ba5zVk9eCDSxUqwAD4_Vx6rN7w5RNLzHCM3wOVaks5o25Ceb6_ixQcOqAmOVAvCok8s7qqjKR5h_rAwR_6_goUd07p27aHpRCaUHDP5TnMuKXQ7ce7nK44bi1F_nP7jux0eZA';

export const shishaImage = menuItems[5].image;
