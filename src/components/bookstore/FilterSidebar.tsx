"use client";

const CATEGORIES = ["พีเรียด", "โรแมนติก", "สืบสวน", "แฟนตาซี", "เยาวชน"];

export type FilterState = {
  categories: string[];
  maxPrice: number;
  promotionOnly: boolean;
};

export default function FilterSidebar({
  filters,
  onChange,
  maxPriceLimit,
}: {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  maxPriceLimit: number;
}) {
  function toggleCategory(category: string) {
    const exists = filters.categories.includes(category);
    onChange({
      ...filters,
      categories: exists
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category],
    });
  }

  return (
    <aside className="w-full shrink-0 space-y-8 md:w-56">
      <div>
        <h3 className="mb-3 text-sm font-medium text-ink">หมวดหมู่</h3>
        <ul className="space-y-2">
          {CATEGORIES.map((category) => (
            <li key={category}>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 rounded border-black/20 text-sage focus:ring-sage"
                />
                {category}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-ink">ราคาสูงสุด</h3>
        <input
          type="range"
          min={0}
          max={maxPriceLimit}
          value={filters.maxPrice}
          onChange={(event) => onChange({ ...filters, maxPrice: Number(event.target.value) })}
          className="w-full accent-sage"
        />
        <p className="text-xs text-muted">ไม่เกิน ฿{filters.maxPrice}</p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-ink">โปรโมชัน</h3>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={filters.promotionOnly}
            onChange={(event) => onChange({ ...filters, promotionOnly: event.target.checked })}
            className="h-4 w-4 rounded border-black/20 text-sage focus:ring-sage"
          />
          แสดงเฉพาะหนังสือโปรโมชัน
        </label>
      </div>
    </aside>
  );
}
