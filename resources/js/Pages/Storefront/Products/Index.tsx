import { Head, Link, router } from '@inertiajs/react';
import { Pagination, PublicLayout } from '@/Components/Commerce';
import { FormEvent, useState } from 'react';

function money(value: string | number) {
    return Number(value ?? 0).toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

function discountPercent(product: any) {
    const price = Number(product.price ?? 0);
    const compare = Number(product.compare_price ?? 0);

    return compare > price ? Math.round(((compare - price) / compare) * 100) : 0;
}

function CatalogCard({ product }: { product: any }) {
    const discount = discountPercent(product);
    const inStock = !product.manage_stock || product.stock_quantity > 0;

    return (
        <div className="group overflow-hidden rounded-xl border border-[#eadfce] bg-white shadow-[0_14px_34px_rgba(53,39,22,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(53,39,22,0.16)]">
            <Link href={`/products/${product.slug}`} className="relative block overflow-hidden bg-[#f5efe6]">
                <img
                    src={product.primary_image?.image_path ?? `https://picsum.photos/seed/catalog-${product.id}/800/800`}
                    alt={product.name}
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    {discount > 0 && <span className="rounded-full bg-[#f18719] px-3 py-1 text-xs font-black text-white">{discount}% OFF</span>}
                    {product.is_new && <span className="rounded-full bg-[#17120c] px-3 py-1 text-xs font-black text-white">NEW</span>}
                    {product.is_bestseller && <span className="rounded-full bg-[#f2bd61] px-3 py-1 text-xs font-black text-[#17120c]">BEST</span>}
                </div>
            </Link>

            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#b77918]">{product.brand?.name ?? 'VINDIXSHEE'}</p>
                        <Link href={`/products/${product.slug}`} className="mt-1 block text-lg font-black leading-snug text-[#17120c] hover:text-[#b77918]">
                            {product.name}
                        </Link>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${inStock ? 'bg-[#d7efe3] text-[#286044]' : 'bg-red-50 text-red-700'}`}>
                        {inStock ? 'In stock' : 'Sold out'}
                    </span>
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-[#8a7a66]">{product.short_description}</p>

                <div className="mt-4 flex items-end gap-2">
                    <strong className="text-2xl text-[#17120c]">{money(product.price)}</strong>
                    {product.compare_price && <span className="text-sm font-semibold text-[#b9aa98] line-through">{money(product.compare_price)}</span>}
                </div>

                <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                    <button
                        type="button"
                        disabled={!inStock}
                        onClick={() => router.post('/cart', { product_id: product.id, quantity: 1 }, { preserveScroll: true })}
                        className="rounded-md bg-[#17120c] px-4 py-2.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#b77918] disabled:opacity-50"
                    >
                        Add to cart
                    </button>
                    <Link href={`/products/${product.slug}`} className="rounded-md border border-[#eadfce] px-4 py-2.5 text-center text-sm font-black text-[#6f5d47] transition hover:border-[#f2bd61] hover:bg-[#fffaf3] hover:text-[#b77918]">
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function Index({ products, brands = [], filters = {} }: any) {
    const rows = products?.data ?? [];
    const [search, setSearch] = useState(filters.search ?? '');
    const [minPrice, setMinPrice] = useState(filters.min_price ?? '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price ?? '');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const applyFilters = (extra: Record<string, any> = {}) => {
        router.get('/products', {
            ...filters,
            search: search || undefined,
            min_price: minPrice || undefined,
            max_price: maxPrice || undefined,
            ...extra,
        }, { preserveState: true, replace: true });
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        applyFilters();
    };

    const clearFilters = () => {
        setSearch('');
        setMinPrice('');
        setMaxPrice('');
        router.get('/products', {}, { preserveState: true, replace: true });
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    const FiltersPanel = (
        <aside className="rounded-xl border border-[#eadfce] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#17120c]">Filters</h2>
                {activeFilterCount > 0 && <button type="button" onClick={clearFilters} className="text-sm font-bold text-red-600">Clear</button>}
            </div>

            <form onSubmit={submit} className="mt-5 grid gap-5">
                <label className="grid gap-2 text-sm font-bold text-[#6f5d47]">
                    Search
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className="rounded-md border-[#eadfce] bg-[#fffaf3] px-4 py-3 text-sm focus:border-[#b77918] focus:ring-[#b77918]"
                        placeholder="Search products"
                    />
                </label>

                <label className="grid gap-2 text-sm font-bold text-[#6f5d47]">
                    Brand
                    <select
                        value={filters.brand ?? ''}
                        onChange={(event) => applyFilters({ brand: event.target.value || undefined })}
                        className="rounded-md border-[#eadfce] bg-[#fffaf3] px-4 py-3 text-sm focus:border-[#b77918] focus:ring-[#b77918]"
                    >
                        <option value="">All brands</option>
                        {brands.map((brand: any) => <option key={brand.id} value={brand.slug}>{brand.name}</option>)}
                    </select>
                </label>

                <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-2 text-sm font-bold text-[#6f5d47]">
                        Min
                        <input
                            value={minPrice}
                            onChange={(event) => setMinPrice(event.target.value)}
                            className="rounded-md border-[#eadfce] bg-[#fffaf3] px-3 py-3 text-sm focus:border-[#b77918] focus:ring-[#b77918]"
                            placeholder="$0"
                        />
                    </label>
                    <label className="grid gap-2 text-sm font-bold text-[#6f5d47]">
                        Max
                        <input
                            value={maxPrice}
                            onChange={(event) => setMaxPrice(event.target.value)}
                            className="rounded-md border-[#eadfce] bg-[#fffaf3] px-3 py-3 text-sm focus:border-[#b77918] focus:ring-[#b77918]"
                            placeholder="$500"
                        />
                    </label>
                </div>

                <button className="rounded-md bg-[#17120c] px-4 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#b77918]">
                    Apply filters
                </button>
            </form>

            <div className="mt-6 rounded-lg bg-[#fff4df] p-4">
                <p className="text-sm font-black text-[#17120c]">Season deals</p>
                <p className="mt-1 text-sm text-[#8a7a66]">Looking for discounted products?</p>
                <Link href="/season-offers" className="mt-3 inline-block text-sm font-black text-[#b77918]">Browse offers</Link>
            </div>
        </aside>
    );

    return (
        <PublicLayout fullBleed>
            <Head title="Products" />

            <section className="relative overflow-hidden bg-[#f5f1ea] text-[#17120c]">
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(95,75,45,0.055)_1px,transparent_1px)] bg-[length:54px_54px]" />
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=92" alt="" className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover object-center opacity-95 lg:block" />
                <div className="absolute inset-y-0 right-0 hidden w-2/3 bg-gradient-to-r from-[#f5f1ea] via-[#f5f1ea]/86 to-transparent lg:block" />
                <div className="relative mx-auto grid min-h-[500px] max-w-7xl items-center gap-8 px-4 py-14 md:px-6 lg:grid-cols-[1fr_360px]">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.35em] text-[#b77918]">VINDIXSHEE Catalog</p>
                        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-black leading-[0.95] md:text-7xl">Shop the full fashion collection</h1>
                        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[#6f5d47]">
                            Browse new arrivals, best sellers, seasonal deals, and everyday outfits with fast checkout.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/season-offers" className="rounded-full bg-[#17120c] px-6 py-3 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[#b77918]">Season offers</Link>
                            <Link href="/cart" className="rounded-full border border-[#c99655] bg-white/60 px-6 py-3 text-sm font-black text-[#6f5d47] backdrop-blur transition hover:bg-white">View cart</Link>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#eadfce] bg-white/85 p-6 shadow-[0_24px_54px_rgba(53,39,22,0.12)] backdrop-blur">
                        <p className="text-sm font-bold text-[#8a7a66]">Products found</p>
                        <strong className="mt-2 block text-6xl font-black text-[#17120c]">{products?.total ?? rows.length}</strong>
                        <p className="mt-2 text-sm font-semibold text-[#8a7a66]">Curated products ready to ship.</p>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
                <div className="mb-6 grid gap-4 lg:grid-cols-[280px_1fr]">
                    <div className="hidden lg:block">{FiltersPanel}</div>

                    <div>
                        <div className="mb-5 rounded-xl border border-[#eadfce] bg-white p-4 shadow-sm">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-[#17120c]">Products</h2>
                                    <p className="text-sm text-[#8a7a66]">
                                        Showing {rows.length} of {products?.total ?? rows.length} products
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <button type="button" onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)} className="rounded-md border px-4 py-2.5 text-sm font-black lg:hidden">
                                        {mobileFiltersOpen ? 'Hide filters' : 'Show filters'}
                                    </button>
                                    <select
                                        value={filters.sort ?? 'latest'}
                                        onChange={(event) => applyFilters({ sort: event.target.value })}
                                        className="rounded-md border-[#eadfce] text-sm font-semibold focus:border-[#b77918] focus:ring-[#b77918]"
                                    >
                                        <option value="latest">Latest</option>
                                        <option value="price_low">Price low to high</option>
                                        <option value="price_high">Price high to low</option>
                                    </select>
                                </div>
                            </div>

                            {activeFilterCount > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {Object.entries(filters).filter(([, value]) => Boolean(value)).map(([key, value]) => (
                                        <span key={key} className="rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-bold text-fuchsia-700">
                                            {key}: {String(value)}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {mobileFiltersOpen && <div className="mb-5 lg:hidden">{FiltersPanel}</div>}

                        {rows.length ? (
                            <>
                                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                    {rows.map((product: any) => <CatalogCard key={product.id} product={product} />)}
                                </div>
                                <Pagination links={products?.links} />
                            </>
                        ) : (
                            <div className="rounded-lg border border-dashed bg-white p-12 text-center shadow-sm">
                                <h3 className="text-2xl font-black text-neutral-950">No products found</h3>
                                <p className="mt-2 text-neutral-500">Try clearing filters or searching for something else.</p>
                                <button type="button" onClick={clearFilters} className="mt-5 rounded-md bg-neutral-950 px-5 py-3 text-sm font-black text-white">Clear filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
