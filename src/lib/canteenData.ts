export type FoodType = 'Vegetarian' | 'Non-Vegetarian' | 'Mixed';

export interface Canteen {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
  openingHours: string;
}

export interface MenuItemVariant {
  id: string;
  name: string;
  price: number | null;
  note?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  foodType: FoodType;
  price: number | null;
  isAvailable: boolean;
  image?: string;
  displayOrder: number;
  variants?: MenuItemVariant[];
}

export interface MenuCategory {
  id: string;
  name: string;
  displayOrder: number;
  timing: string;
  items: MenuItem[];
}

export interface MenuRecord {
  id: string;
  canteenId: string;
  canteenName: string;
  date: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  categories: MenuCategory[];
}

export const CANTEEN_DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const DEFAULT_CANTEENS: Canteen[] = [
  {
    id: 'south-canteen',
    name: 'South Canteen',
    location: 'South Block',
    status: 'active',
    openingHours: '7:00 AM - 9:00 PM',
  },
];

export function getNextDayOfWeek(targetDay: number): string {
  const today = new Date();
  const current = today.getDay();
  const diff = (targetDay - current + 7) % 7 || 7;
  const next = new Date(today);
  next.setDate(today.getDate() + diff);
  return next.toISOString().slice(0, 10);
}

export function formatDayName(dateString: string): string {
  const parsed = new Date(`${dateString}T00:00:00`);
  return CANTEEN_DAY_NAMES[parsed.getDay() === 0 ? 6 : parsed.getDay() - 1] ?? 'Thursday';
}

export function formatDisplayDate(dateString: string): string {
  const parsed = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(parsed);
}

const createMenuItem = (
  id: string,
  name: string,
  price: number | null,
  foodType: FoodType,
  displayOrder: number,
  description?: string,
  variants?: MenuItemVariant[],
  isAvailable = true,
): MenuItem => ({
  id,
  name,
  description,
  foodType,
  price,
  isAvailable,
  displayOrder,
  variants,
});

export const DEFAULT_MENU_DATE = getNextDayOfWeek(4);

export const SOUTH_CANTEEN_MENU_SEED: MenuRecord = {
  id: 'menu-south-thursday',
  canteenId: 'south-canteen',
  canteenName: 'South Canteen',
  date: DEFAULT_MENU_DATE,
  status: 'published',
  publishedAt: new Date().toISOString(),
  categories: [
    {
      id: 'breakfast',
      name: 'Breakfast',
      displayOrder: 1,
      timing: '8:00 AM - 10:30 AM',
      items: [
        createMenuItem('breakfast-riceputtu-banana', 'Riceputtu with Banana', 40, 'Vegetarian', 1),
        createMenuItem('breakfast-maggi', 'Maggi', 30, 'Vegetarian', 2),
        createMenuItem('breakfast-set-dosa', 'Set Dosa', 30, 'Vegetarian', 3),
        createMenuItem('breakfast-ghee-dosa', 'Ghee Dosa', 50, 'Vegetarian', 4),
        createMenuItem('breakfast-masala-dosa', 'Masala Dosa', 50, 'Vegetarian', 5),
        createMenuItem('breakfast-ghee-masala-dosa', 'Ghee Masala Dosa', 60, 'Vegetarian', 6),
        createMenuItem('breakfast-podi-dosa', 'Podi Dosa', 50, 'Vegetarian', 7),
        createMenuItem('breakfast-podi-ghee-dosa', 'Podi Ghee Dosa', 60, 'Vegetarian', 8),
        createMenuItem('breakfast-egg-dosa', 'Egg Dosa', 50, 'Non-Vegetarian', 9),
        createMenuItem('breakfast-poori-bhaji', 'Poori Bhaji', 60, 'Vegetarian', 10),
        createMenuItem('breakfast-appam', 'Appam', 30, 'Vegetarian', 11),
        createMenuItem('breakfast-upma-banana', 'Upma with Banana', 40, 'Vegetarian', 12),
        createMenuItem('breakfast-boiled-egg', 'Boiled Egg', 10, 'Non-Vegetarian', 13),
        createMenuItem('breakfast-single-omelet', 'Single Omelet', 20, 'Non-Vegetarian', 14),
        createMenuItem('breakfast-double-omelet', 'Double Omelet', 30, 'Non-Vegetarian', 15),
        createMenuItem('breakfast-slice-bread', 'Slice Bread (2nos)', 10, 'Vegetarian', 16),
        createMenuItem('breakfast-bread-omelet', 'Bread Omelet', 50, 'Non-Vegetarian', 17),
      ],
    },
    {
      id: 'lunch',
      name: 'Lunch',
      displayOrder: 2,
      timing: '11:30 AM - 2:00 PM',
      items: [
        createMenuItem('lunch-chicken-biriyani', 'Chicken Biriyani', 120, 'Non-Vegetarian', 1),
        createMenuItem('lunch-chicken-meal', 'Chicken Meal', 90, 'Non-Vegetarian', 2),
        createMenuItem('lunch-vegetable-meals', 'Vegetable Meals', 60, 'Vegetarian', 3),
        createMenuItem('lunch-curd-rice', 'Curd Rice', 50, 'Vegetarian', 4),
        createMenuItem('lunch-chapati', 'Chapati', 10, 'Vegetarian', 5),
        createMenuItem('lunch-malabar-paratha', 'Malabar Paratha', 15, 'Vegetarian', 6),
        createMenuItem('lunch-moo-mutter', 'Moo Mutter', 30, 'Vegetarian', 7),
        createMenuItem('lunch-butter-chicken', 'Butter Chicken', 60, 'Non-Vegetarian', 8),
      ],
    },
    {
      id: 'american-fast-food',
      name: 'American Fast Food',
      displayOrder: 3,
      timing: '12:00 PM - 9:00 PM',
      items: [
        createMenuItem('af-food-veg-burger', 'Killer King Veg Burger', 90, 'Vegetarian', 1, 'Served with French Fries & Tomato Ketchup'),
        createMenuItem('af-food-chicken-burger', 'Killer King Chicken Burger', 120, 'Non-Vegetarian', 2, 'Served with French Fries & Tomato Ketchup'),
      ],
    },
    {
      id: 'lunch-special',
      name: 'Lunch Special',
      displayOrder: 4,
      timing: '1:00 PM - 3:00 PM',
      items: [
        createMenuItem('lunch-special-lollipop', 'Peri Peri Chicken Lollipop', 120, 'Non-Vegetarian', 1, 'With 2 pcs Malabar Paratha. Served with crackers & chef sauce.'),
      ],
    },
    {
      id: 'action-counter-lunch',
      name: 'Action Counter Lunch',
      displayOrder: 5,
      timing: '11:30 AM - 3:00 PM',
      items: [
        createMenuItem('action-sandwich', 'Chicken Kabab Sandwich', 60, 'Non-Vegetarian', 1),
        createMenuItem('action-sub', 'Chicken Kabab Sub', 60, 'Non-Vegetarian', 2),
        createMenuItem('action-paneer-sandwich', 'Paneer Sandwich', 60, 'Vegetarian', 3),
        createMenuItem('action-paneer-sub', 'Paneer Sub', 60, 'Vegetarian', 4),
        createMenuItem('action-teriyaki-sandwich', 'Teriyaki Chicken Sandwich', 60, 'Non-Vegetarian', 5),
        createMenuItem('action-teriyaki-sub', 'Teriyaki Chicken Sub', 60, 'Non-Vegetarian', 6),
        createMenuItem('action-veg-cheese-sub', 'Veg Cheese Sub', 50, 'Vegetarian', 7),
        createMenuItem('action-chicken-hotdog', 'Chicken Hotdog', 50, 'Non-Vegetarian', 8),
      ],
    },
    {
      id: 'chinese',
      name: 'Chinese',
      displayOrder: 6,
      timing: '2:30 PM - 9:00 PM',
      items: [
        createMenuItem('chinese-fried-rice', 'Fried Rice', null, 'Mixed', 1, 'Veg / Egg / Chicken', [
          { id: 'fried-rice-veg', name: 'Veg', price: 70 },
          { id: 'fried-rice-egg', name: 'Egg', price: 80 },
          { id: 'fried-rice-chicken', name: 'Chicken', price: 90 },
        ]),
        createMenuItem('chinese-noodles', 'Noodles', null, 'Mixed', 2, 'Veg / Egg / Chicken', [
          { id: 'noodles-veg', name: 'Veg', price: 70 },
          { id: 'noodles-egg', name: 'Egg', price: 80 },
          { id: 'noodles-chicken', name: 'Chicken', price: 90 },
        ]),
        createMenuItem('chinese-shanghai-noodles', 'Shanghai Rice Noodles', null, 'Mixed', 3, 'Veg / Egg / Chicken', [
          { id: 'shanghai-veg', name: 'Veg', price: 70 },
          { id: 'shanghai-egg', name: 'Egg', price: 80 },
          { id: 'shanghai-chicken', name: 'Chicken', price: 90 },
        ]),
      ],
    },
    {
      id: 'starters',
      name: 'Starters',
      displayOrder: 7,
      timing: '2:30 PM - 9:00 PM',
      items: [
        createMenuItem('starters-honey-chilli-potato', 'Honey Chilli Potato', 110, 'Vegetarian', 1),
        createMenuItem('starters-peri-peri-french-fries', 'Peri Peri French Fries', 100, 'Vegetarian', 2),
        createMenuItem('starters-french-fries', 'French Fries', 90, 'Vegetarian', 3),
      ],
    },
    {
      id: 'dinner',
      name: 'Dinner',
      displayOrder: 8,
      timing: '6:00 PM - 9:00 PM',
      items: [
        createMenuItem('dinner-veg-combo', 'Veg Combo', 50, 'Vegetarian', 1, 'Rice, Dal, aloo jeera fry, pickle'),
        createMenuItem('dinner-non-veg-combo', 'Non Veg Combo', 80, 'Non-Vegetarian', 2, 'Rice, Dal, Chicken Curry, pickle'),
        createMenuItem('dinner-kallappam-chicken', 'Kallappam with Chicken Curry', 80, 'Non-Vegetarian', 3),
        createMenuItem('dinner-kallappam-veg', 'Kallappam with Veg Curry', 50, 'Vegetarian', 4),
        createMenuItem('dinner-puttu-rice', 'Puttu Rice', 50, 'Vegetarian', 5),
        createMenuItem('dinner-chapati', 'Chapatti', 10, 'Vegetarian', 6),
        createMenuItem('dinner-malabar-paratha-dinner', 'Malabar Paratha', 15, 'Vegetarian', 7),
        createMenuItem('dinner-veg-curry', 'Veg Curry', 30, 'Vegetarian', 8),
        createMenuItem('dinner-chicken-curry', 'Chicken Curry', 60, 'Non-Vegetarian', 9),
        createMenuItem('dinner-single-omelet', 'Single Omelet', 20, 'Non-Vegetarian', 10),
        createMenuItem('dinner-double-omelet', 'Double Omelet', 30, 'Non-Vegetarian', 11),
        createMenuItem('dinner-chicken-chukka', 'Chicken Chukka', 60, 'Non-Vegetarian', 12),
      ],
    },
    {
      id: 'pan-asian-dinner',
      name: 'Pan Asian Dinner',
      displayOrder: 9,
      timing: '6:00 PM - 9:00 PM',
      items: [
        createMenuItem('pan-asian-smoke-bowl', 'Smoke That Bowl (V)', 90, 'Vegetarian', 1),
        createMenuItem('pan-asian-schezwan', 'Schezwan Chicken Rice Bowl', 110, 'Non-Vegetarian', 2),
      ],
    },
  ],
};

export function createEmptyMenu(canteenId: string, canteenName: string, date: string): MenuRecord {
  return {
    id: `menu-${canteenId}-${date}`,
    canteenId,
    canteenName,
    date,
    status: 'draft',
    categories: [],
  };
}

export function buildSeedMenuForDate(canteenId: string, canteenName: string, date: string): MenuRecord {
  if (canteenId === 'south-canteen') {
    return {
      ...SOUTH_CANTEEN_MENU_SEED,
      id: `menu-${canteenId}-${date}`,
      date,
      status: 'draft',
      publishedAt: undefined,
      categories: SOUTH_CANTEEN_MENU_SEED.categories.map((category) => ({
        ...category,
        items: category.items.map((item) => ({ ...item, id: `${item.id}-${date}` })),
      })),
    };
  }

  return createEmptyMenu(canteenId, canteenName, date);
}

export function readLocalMenus(): MenuRecord[] {
  if (typeof window === 'undefined') return [SOUTH_CANTEEN_MENU_SEED];
  const stored = window.localStorage.getItem('campusconnect-canteen-menus');
  if (!stored) {
    window.localStorage.setItem('campusconnect-canteen-menus', JSON.stringify([SOUTH_CANTEEN_MENU_SEED]));
    return [SOUTH_CANTEEN_MENU_SEED];
  }

  try {
    return JSON.parse(stored) as MenuRecord[];
  } catch {
    return [SOUTH_CANTEEN_MENU_SEED];
  }
}

export function saveMenusToLocalStorage(menus: MenuRecord[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('campusconnect-canteen-menus', JSON.stringify(menus));
}

export function readLocalCanteens(): Canteen[] {
  if (typeof window === 'undefined') return DEFAULT_CANTEENS;
  const stored = window.localStorage.getItem('campusconnect-canteens');
  if (!stored) {
    window.localStorage.setItem('campusconnect-canteens', JSON.stringify(DEFAULT_CANTEENS));
    return DEFAULT_CANTEENS;
  }

  try {
    return JSON.parse(stored) as Canteen[];
  } catch {
    return DEFAULT_CANTEENS;
  }
}

export function saveCanteensToLocalStorage(canteens: Canteen[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('campusconnect-canteens', JSON.stringify(canteens));
}

export function getMenuForDate(canteenId: string, date: string, menus: MenuRecord[] = readLocalMenus()): MenuRecord | null {
  return menus.find((menu) => menu.canteenId === canteenId && menu.date === date) ?? null;
}

export function getPublishedMenuForDate(canteenId: string, date: string): MenuRecord | null {
  const menus = readLocalMenus();
  return menus.find((menu) => menu.canteenId === canteenId && menu.date === date && menu.status === 'published') ?? null;
}
