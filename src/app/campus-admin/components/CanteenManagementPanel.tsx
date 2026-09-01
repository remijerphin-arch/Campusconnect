'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChefHat, Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { DEFAULT_CANTEENS, buildSeedMenuForDate, createEmptyMenu, formatDayName, formatDisplayDate, getMenuForDate, readLocalCanteens, readLocalMenus, saveCanteensToLocalStorage, saveMenusToLocalStorage, type Canteen, type MenuCategory, type MenuItem, type MenuRecord } from '@/lib/canteenData';

const BASE_CATEGORIES = [
  'Breakfast',
  'Lunch',
  'American Fast Food',
  'Lunch Special',
  'Action Counter Lunch',
  'Chinese',
  'Starters',
  'Dinner',
  'Pan Asian Dinner',
];

const CATEGORY_TIMINGS: Record<string, string> = {
  Breakfast: '8:00 AM - 10:30 AM',
  Lunch: '11:30 AM - 2:00 PM',
  'American Fast Food': '12:00 PM - 9:00 PM',
  'Lunch Special': '1:00 PM - 3:00 PM',
  'Action Counter Lunch': '11:30 AM - 3:00 PM',
  Chinese: '2:30 PM - 9:00 PM',
  Starters: '2:30 PM - 9:00 PM',
  Dinner: '6:00 PM - 9:00 PM',
  'Pan Asian Dinner': '6:00 PM - 9:00 PM',
};

const emptyItemDraft: {
  id: string;
  name: string;
  description: string;
  foodType: 'Vegetarian' | 'Non-Vegetarian' | 'Mixed';
  price: number;
  isAvailable: boolean;
  variants: string;
  category: string;
} = {
  id: '',
  name: '',
  description: '',
  foodType: 'Vegetarian',
  price: 0,
  isAvailable: true,
  variants: '',
  category: BASE_CATEGORIES[0],
};

export default function CanteenManagementPanel() {
  const [canteens, setCanteens] = useState<Canteen[]>(DEFAULT_CANTEENS);
  const [selectedCanteenId, setSelectedCanteenId] = useState('south-canteen');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [menus, setMenus] = useState<MenuRecord[]>([]);
  const [menu, setMenu] = useState<MenuRecord | null>(null);
  const [draftMode, setDraftMode] = useState<'draft' | 'preview' | 'published'>('draft');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemDraft, setItemDraft] = useState(emptyItemDraft);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setCanteens(readLocalCanteens());
    setMenus(readLocalMenus());
  }, []);

  useEffect(() => {
    const nextMenus = readLocalMenus();
    setMenus(nextMenus);
    const nextMenu = getMenuForDate(selectedCanteenId, selectedDate, nextMenus) ?? buildSeedMenuForDate(selectedCanteenId, canteens.find((canteen) => canteen.id === selectedCanteenId)?.name ?? 'South Canteen', selectedDate);
    setMenu(nextMenu);
  }, [selectedCanteenId, selectedDate, canteens]);

  const selectedCanteen = useMemo(
    () => canteens.find((canteen) => canteen.id === selectedCanteenId) ?? canteens[0],
    [canteens, selectedCanteenId],
  );

  const persistMenus = (nextMenu: MenuRecord) => {
    const nextMenus = [...menus.filter((item) => !(item.canteenId === selectedCanteenId && item.date === selectedDate)), nextMenu];
    setMenus(nextMenus);
    saveMenusToLocalStorage(nextMenus);
    setMenu(nextMenu);
  };

  const openAddItem = (categoryName?: string) => {
    setEditingItemId(null);
    setItemDraft({
      ...emptyItemDraft,
      category: categoryName ?? BASE_CATEGORIES[0],
    });
    setIsItemModalOpen(true);
  };

  const openEditItem = (category: MenuCategory, item: MenuItem) => {
    setEditingItemId(item.id);
    setItemDraft({
      id: item.id,
      name: item.name,
      description: item.description ?? '',
      foodType: item.foodType,
      price: item.price ?? 0,
      isAvailable: item.isAvailable,
      variants: (item.variants ?? []).map((variant) => `${variant.name}:${variant.price ?? 0}`).join('; '),
      category: category.name,
    });
    setIsItemModalOpen(true);
  };

  const deleteItem = (categoryName: string, itemId: string) => {
    if (!menu) return;
    const nextMenu = {
      ...menu,
      categories: menu.categories.map((category) => category.name === categoryName
        ? { ...category, items: category.items.filter((item) => item.id !== itemId) }
        : category),
    };
    persistMenus(nextMenu);
  };

  const toggleAvailability = (categoryName: string, itemId: string) => {
    if (!menu) return;
    const nextMenu = {
      ...menu,
      categories: menu.categories.map((category) => category.name === categoryName
        ? { ...category, items: category.items.map((item) => item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item) }
        : category),
    };
    persistMenus(nextMenu);
  };

  const saveItem = () => {
    if (!menu || !itemDraft.name.trim()) return;

    const categoryName = itemDraft.category || BASE_CATEGORIES[0];
    const parsedVariants = itemDraft.variants
      .split(';')
      .map((variant) => variant.trim())
      .filter(Boolean)
      .map((variant) => {
        const [name, ...rest] = variant.split(':');
        const priceString = rest.join(':').trim();
        return { id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`, name: name.trim(), price: Number(priceString) || null };
      });

    const newItem: MenuItem = {
      id: editingItemId ?? `item-${Date.now()}`,
      name: itemDraft.name.trim(),
      description: itemDraft.description.trim() || undefined,
      foodType: itemDraft.foodType,
      price: itemDraft.price ?? 0,
      isAvailable: itemDraft.isAvailable,
      displayOrder: Date.now(),
      variants: parsedVariants.length > 0 ? parsedVariants : undefined,
    };

    const nextCategories = menu.categories.length > 0 ? menu.categories : BASE_CATEGORIES.map((name) => ({ id: `cat-${name.toLowerCase()}`, name, displayOrder: BASE_CATEGORIES.indexOf(name) + 1, timing: CATEGORY_TIMINGS[name] ?? 'Daily', items: [] }));

    const updatedCategories = nextCategories.map((category) => {
      if (category.name !== categoryName) return category;
      const existingItems = category.items.filter((item) => item.id !== editingItemId);
      return { ...category, items: [...existingItems, newItem].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)) };
    });

    if (!updatedCategories.some((category) => category.name === categoryName)) {
      updatedCategories.push({
        id: `cat-${categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: categoryName,
        displayOrder: BASE_CATEGORIES.indexOf(categoryName) + 1,
        timing: CATEGORY_TIMINGS[categoryName] ?? 'Daily',
        items: [newItem],
      });
    }

    const nextMenu = { ...menu, categories: updatedCategories.sort((a, b) => a.displayOrder - b.displayOrder) };
    persistMenus(nextMenu);
    setIsItemModalOpen(false);
    setEditingItemId(null);
    setItemDraft({ ...emptyItemDraft });
  };

  const publishMenu = () => {
    if (!menu) return;
    const nextMenu: MenuRecord = { ...menu, status: 'published', publishedAt: new Date().toISOString() };
    persistMenus(nextMenu);
    setDraftMode('published');
  };

  const addCanteen = () => {
    const name = window.prompt('Enter the new canteen name');
    if (!name || !name.trim()) return;
    const next: Canteen[] = [...canteens, { id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: name.trim(), location: 'Campus', status: 'active', openingHours: '8:00 AM - 8:00 PM' }];
    setCanteens(next);
    saveCanteensToLocalStorage(next);
    setSelectedCanteenId(next[next.length - 1].id);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border bg-card p-6 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Campus Admin</p>
            <h1 className="mt-2 text-3xl font-bold">Canteen Management</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={addCanteen} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"> <Plus size={16} /> Add Canteen </button>
            <button type="button" onClick={() => setDraftMode('draft')} className="rounded-full border px-4 py-2 text-sm font-medium">Draft</button>
            <button type="button" onClick={() => setPreviewOpen(true)} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"><Eye size={16} /> Preview Menu</button>
            <button type="button" onClick={publishMenu} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Publish Menu</button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border bg-muted/30 p-4">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Canteen</label>
            <select value={selectedCanteenId} onChange={(event) => setSelectedCanteenId(event.target.value)} className="mt-2 w-full rounded-xl border bg-background px-3 py-2 text-sm">
              {canteens.map((canteen) => <option key={canteen.id} value={canteen.id}>{canteen.name}</option>)}
            </select>
          </div>
          <div className="rounded-[1.5rem] border bg-muted/30 p-4">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Date</label>
            <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="mt-2 w-full rounded-xl border bg-background px-3 py-2 text-sm" />
          </div>
          <div className="rounded-[1.5rem] border bg-muted/30 p-4">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Status</label>
            <p className="mt-2 text-xl font-bold text-primary">{menu?.status ?? 'draft'}</p>
            <p className="mt-1 text-xs text-muted-foreground">{formatDayName(selectedDate)}, {formatDisplayDate(selectedDate)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border bg-card p-6 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ChefHat className="text-primary" size={22} />
            <h2 className="text-2xl font-bold">Menu editor</h2>
          </div>
          <button type="button" onClick={() => openAddItem()} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"> <Plus size={16} /> Add Item </button>
        </div>

        <div className="mt-6 space-y-6">
          {(menu?.categories?.length ?? 0) > 0 ? menu?.categories.map((category) => (
            <div key={category.id} className="rounded-[1.75rem] border bg-muted/20 p-4">
              <div className="flex flex-col gap-3 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{category.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{category.timing}</p>
                </div>
                <button type="button" onClick={() => openAddItem(category.name)} className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium"> <Plus size={16} /> Add Item </button>
              </div>

              <div className="mt-4 space-y-3">
                {category.items.length > 0 ? category.items.map((item) => (
                  <div key={item.id} className={`rounded-[1.25rem] border p-3 ${item.isAvailable ? 'bg-background' : 'border-dashed bg-muted/40 opacity-65'}`}>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full border px-2 py-1">{item.foodType}</span>
                          <span className="rounded-full border px-2 py-1">₹{item.price ?? 0}</span>
                          {!item.isAvailable && <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-amber-700">Unavailable</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => toggleAvailability(category.name, item.id)} className="rounded-full border px-3 py-2 text-xs font-medium">{item.isAvailable ? 'Available' : 'Unavailable'}</button>
                        <button type="button" onClick={() => openEditItem(category, item)} className="rounded-full border p-2"><Pencil size={15} /></button>
                        <button type="button" onClick={() => deleteItem(category.name, item.id)} className="rounded-full border border-danger/30 bg-danger/10 p-2 text-danger"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No menu items yet.</p>}
              </div>
            </div>
          )) : <div className="rounded-[1.5rem] border border-dashed p-6 text-center text-sm text-muted-foreground">No menu items yet. <button type="button" onClick={() => openAddItem()} className="ml-2 font-semibold text-primary">Add Menu Item</button></div>}
        </div>
      </div>

      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[2rem] border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{editingItemId ? 'Edit item' : 'Add menu item'}</h3>
              <button type="button" onClick={() => setIsItemModalOpen(false)} className="rounded-full border px-3 py-1 text-sm">Cancel</button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Food Name</label>
                <input value={itemDraft.name} onChange={(event) => setItemDraft({ ...itemDraft, name: event.target.value })} className="mt-1 w-full rounded-xl border bg-background px-3 py-2" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea value={itemDraft.description} onChange={(event) => setItemDraft({ ...itemDraft, description: event.target.value })} className="mt-1 min-h-24 w-full rounded-xl border bg-background px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select value={itemDraft.category} onChange={(event) => setItemDraft({ ...itemDraft, category: event.target.value })} className="mt-1 w-full rounded-xl border bg-background px-3 py-2">
                  {BASE_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Price</label>
                <input type="number" value={itemDraft.price} onChange={(event) => setItemDraft({ ...itemDraft, price: Number(event.target.value) || 0 })} className="mt-1 w-full rounded-xl border bg-background px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Food Type</label>
                <select value={itemDraft.foodType} onChange={(event) => setItemDraft({ ...itemDraft, foodType: event.target.value as 'Vegetarian' | 'Non-Vegetarian' | 'Mixed' })} className="mt-1 w-full rounded-xl border bg-background px-3 py-2">
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Variants</label>
                <input value={itemDraft.variants} onChange={(event) => setItemDraft({ ...itemDraft, variants: event.target.value })} placeholder="Veg:70; Egg:80" className="mt-1 w-full rounded-xl border bg-background px-3 py-2" />
              </div>
              <div className="flex items-center gap-2 self-end rounded-xl border px-3 py-2">
                <input type="checkbox" checked={itemDraft.isAvailable} onChange={(event) => setItemDraft({ ...itemDraft, isAvailable: event.target.checked })} />
                <span className="text-sm">Available</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setIsItemModalOpen(false)} className="rounded-full border px-4 py-2 text-sm font-medium">Cancel</button>
              <button type="button" onClick={saveItem} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Save Item</button>
            </div>
          </div>
        </div>
      )}

      {previewOpen && menu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl rounded-[2rem] border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Preview</p>
                <h3 className="mt-1 text-2xl font-bold">{menu.canteenName}</h3>
              </div>
              <button type="button" onClick={() => setPreviewOpen(false)} className="rounded-full border px-3 py-1 text-sm">Close</button>
            </div>
            <div className="mt-5 space-y-6">
              {menu.categories.map((category) => (
                <div key={category.id} className="rounded-[1.5rem] border bg-muted/20 p-4">
                  <p className="text-lg font-bold">{category.name}</p>
                  <p className="text-sm text-muted-foreground">{category.timing}</p>
                  <div className="mt-3 space-y-2">
                    {category.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border bg-background px-3 py-2 text-sm">
                        <span>{item.name}</span>
                        <span className="font-semibold">₹{item.price ?? 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
