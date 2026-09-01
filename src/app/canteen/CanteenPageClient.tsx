'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { BellRing, CalendarDays, ChefHat, Eye, UtensilsCrossed } from 'lucide-react';
import { DEFAULT_CANTEENS, formatDayName, formatDisplayDate, getMenuForDate, readLocalCanteens, readLocalMenus, type MenuCategory, type MenuItem, type MenuRecord } from '@/lib/canteenData';

const categoryOrder = [
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

export default function CanteenPageClient() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [canteens, setCanteens] = useState(DEFAULT_CANTEENS);
  const [selectedCanteenId, setSelectedCanteenId] = useState('south-canteen');
  const [selectedDate, setSelectedDate] = useState(today);
  const [menu, setMenu] = useState<MenuRecord | null>(null);
  const [isOriginalOpen, setIsOriginalOpen] = useState(false);
  const navRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    setCanteens(readLocalCanteens());
  }, []);

  useEffect(() => {
    const menus = readLocalMenus();
    const nextMenu = getMenuForDate(selectedCanteenId, selectedDate, menus) ?? {
      id: `menu-${selectedCanteenId}-${selectedDate}`,
      canteenId: selectedCanteenId,
      canteenName: canteens.find((canteen) => canteen.id === selectedCanteenId)?.name ?? 'South Canteen',
      date: selectedDate,
      status: 'draft',
      categories: [],
    };
    setMenu(nextMenu);
  }, [selectedCanteenId, selectedDate, canteens]);

  const categoryList = (menu?.categories ?? []).sort((a, b) => a.displayOrder - b.displayOrder);
  const selectedCanteen = canteens.find((canteen) => canteen.id === selectedCanteenId) ?? canteens[0];

  const scrollToCategory = (categoryName: string) => {
    const el = navRefs.current[categoryName];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderItemCard = (item: MenuItem) => (
    <div key={item.id} className={`rounded-[1.25rem] border bg-muted/30 p-3 transition-all ${item.isAvailable ? 'border-border' : 'border-dashed border-muted-foreground/40 opacity-60'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold text-foreground">{item.name}</p>
          {item.description && <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>}
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-primary">₹{item.price ?? '—'}</p>
          <div className="mt-2 flex items-center justify-end gap-1 text-[10px] font-semibold uppercase tracking-[0.1em]">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 ${item.foodType === 'Vegetarian' ? 'border-success/30 bg-success/10 text-success' : item.foodType === 'Non-Vegetarian' ? 'border-danger/30 bg-danger/10 text-danger' : 'border-accent/30 bg-accent/10 text-accent'}`}>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              {item.foodType}
            </span>
          </div>
        </div>
      </div>

      {item.variants && item.variants.length > 0 && (
        <div className="mt-3 space-y-1.5 border-t border-border/80 pt-3">
          {item.variants.map((variant) => (
            <div key={variant.id} className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>{variant.name}</span>
              <span className="font-semibold text-foreground">₹{variant.price ?? '—'}</span>
            </div>
          ))}
        </div>
      )}

      {!item.isAvailable && (
        <div className="mt-3 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-600">
          Currently unavailable
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl pb-12">
      <div className="rounded-[2rem] border bg-card p-5 shadow-card sm:p-6 lg:p-8">
        <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <UtensilsCrossed size={26} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Canteen</p>
              <h1 className="mt-1 text-3xl font-bold">{selectedCanteen?.name ?? 'South Canteen'}</h1>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-2 text-sm font-medium text-muted-foreground">
              <CalendarDays size={16} className="text-primary" />
              <span>{formatDayName(selectedDate)}, {formatDisplayDate(selectedDate)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-2 text-sm font-semibold text-success">
              <span className="inline-block h-2 w-2 rounded-full bg-success" />
              Open
            </div>
            <button
              type="button"
              onClick={() => setIsOriginalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium text-primary"
            >
              <Eye size={16} />
              View Original Menu
            </button>
          </div>
        </header>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Today&apos;s Menu</p>
            <p className="mt-2 text-sm text-muted-foreground">{selectedCanteen?.openingHours ?? '7:00 AM - 9:00 PM'}</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-muted-foreground">Canteen</label>
            <select
              value={selectedCanteenId}
              onChange={(event) => setSelectedCanteenId(event.target.value)}
              className="rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {canteens.map((canteen) => (
                <option key={canteen.id} value={canteen.id}>{canteen.name}</option>
              ))}
            </select>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <nav className="mt-8 overflow-x-auto pb-2">
          <div className="flex min-w-max gap-2">
            {categoryOrder.map((categoryName) => {
              const enabled = categoryList.some((category) => category.name === categoryName);
              return enabled ? (
                <button
                  key={categoryName}
                  type="button"
                  onClick={() => scrollToCategory(categoryName)}
                  className="rounded-full border bg-muted/50 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  {categoryName}
                </button>
              ) : null;
            })}
          </div>
        </nav>

        {menu && categoryList.length > 0 ? (
          <div className="mt-8 space-y-10">
            {categoryList.map((category, index) => (
              <section
                key={category.id}
                ref={(node) => {
                  navRefs.current[category.name] = node;
                }}
                className="scroll-mt-28 rounded-[1.75rem] border bg-muted/20 p-4 shadow-sm sm:p-5"
                style={{ animation: `fadeInUp 0.35s ease ${index * 0.06}s both` }}
              >
                <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{category.name}</p>
                    <h2 className="mt-2 text-2xl font-bold">{category.name}</h2>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-2 text-sm text-muted-foreground">
                    <BellRing size={15} className="text-primary" />
                    {category.timing}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {category.items.map((item) => renderItemCard(item))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed bg-muted/30 p-10 text-center">
            <ChefHat className="mx-auto text-primary" size={32} />
            <h2 className="mt-4 text-2xl font-bold">No menu has been published for this date yet.</h2>
            <p className="mt-2 text-sm text-muted-foreground">The official menu for {selectedCanteen?.name ?? 'this canteen'} will appear here once it is published.</p>
          </div>
        )}
      </div>

      {isOriginalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Original menu board</p>
                <h3 className="mt-1 text-xl font-bold">South Canteen</h3>
              </div>
              <button type="button" onClick={() => setIsOriginalOpen(false)} className="rounded-full border px-3 py-1 text-sm">Close</button>
            </div>

            <div className="bg-[#d93a1d] p-4 text-white sm:p-6">
              <div className="rounded-[1.5rem] border border-white/20 bg-[#d93a1d] p-4 shadow-inner">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="text-left">
                    <p className="text-2xl font-black uppercase tracking-tight">BREAKFAST</p>
                    <p className="text-[10px] text-white/80">Timing: 8:00 AM to 10:30 AM</p>
                  </div>
                  <div className="rounded-full border border-white/40 bg-[#f3d7aa] px-3 py-1 text-sm font-black text-[#d93a1d]">THURSDAY</div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>Riceputtu with Banana</span><span>₹40</span></div>
                    <div className="flex items-center justify-between"><span>Maggi</span><span>₹30</span></div>
                    <div className="flex items-center justify-between"><span>Set Dosa</span><span>₹30</span></div>
                    <div className="flex items-center justify-between"><span>Ghee Dosa</span><span>₹50</span></div>
                    <div className="flex items-center justify-between"><span>Masala Dosa</span><span>₹50</span></div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>Egg Dosa</span><span>₹50</span></div>
                    <div className="flex items-center justify-between"><span>Appam</span><span>₹30</span></div>
                    <div className="flex items-center justify-between"><span>Upma with Banana</span><span>₹40</span></div>
                    <div className="flex items-center justify-between"><span>Boiled Egg</span><span>₹10</span></div>
                    <div className="flex items-center justify-between"><span>Single Omelet</span><span>₹20</span></div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>Lunch</span><span>—</span></div>
                    <div className="flex items-center justify-between"><span>Veg Meals</span><span>₹60</span></div>
                    <div className="flex items-center justify-between"><span>Chicken Biriyani</span><span>₹120</span></div>
                    <div className="flex items-center justify-between"><span>Chapati</span><span>₹10</span></div>
                    <div className="flex items-center justify-between"><span>Butter Chicken</span><span>₹60</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
