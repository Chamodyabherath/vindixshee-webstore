import { Head, Link, router } from '@inertiajs/react';
import { Pagination, PublicLayout } from '@/Components/Commerce';

function discountPercent(product: any) {
    const price = Number(product.price ?? 0);
    const compare = Number(product.compare_price ?? price);

    return compare > price ? Math.round(((compare - price) / compare) * 100) : 0;
}

function OfferProductCard({ product }: { product: any }) {
    const discount = discountPercent(product);

    return (
        <Link href={`/products/${product.slug}`} className="group overflow-hidden rounded-xl border border-[#eadfce] bg-white shadow-[0_14px_34px_rgba(53,39,22,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(53,39,22,0.16)]">
            <div className="relative">
                <img
                    src={product.primary_image?.image_path ?? `https://picsum.photos/seed/season-${product.id}/800/700`}
                    alt={product.name}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-[#f18719] px-3 py-1 text-xs font-black text-white">
                    {discount}% OFF
                </span>
                <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#6f5d47] backdrop-blur">
                    {product.category?.name ?? 'Season pick'}
                </span>
            </div>
            <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[#b77918]">{product.brand?.name ?? 'VINDIXSHEE'}</p>
                <h3 className="mt-1 text-lg font-black text-[#17120c]">{product.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-[#8a7a66]">{product.short_description}</p>
                <div className="mt-4 flex items-end gap-2">
                    <strong className="text-2xl text-[#17120c]">${product.price}</strong>
                    <span className="text-sm font-semibold text-[#b9aa98] line-through">${product.compare_price}</span>
                </div>
            </div>
        </Link>
    );
}

export default function Index({ products, brands = [], filters = {} }: any) {
    const rows = products?.data ?? [];

    const updateFilter = (key: string, value: string) => {
        router.get('/season-offers', { ...filters, [key]: value || undefined }, { preserveState: true, replace: true });
    };

    return (
        <PublicLayout fullBleed>
            <Head title="Season Offers" />

            <section className="relative overflow-hidden bg-[#17120c] text-white">
                <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=92" alt="" className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover object-center opacity-80 lg:block" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,189,97,0.30),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,154,194,0.18),transparent_32%)]" />
                <div className="absolute inset-y-0 right-0 hidden w-2/3 bg-gradient-to-r from-[#17120c] via-[#17120c]/86 to-transparent lg:block" />
                <div className="relative mx-auto grid min-h-[500px] max-w-7xl items-center gap-8 px-4 py-14 md:px-6 lg:grid-cols-[1fr_360px]">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.35em] text-[#f8d99d]">VINDIXSHEE season offers</p>
                        <h1 className="mt-4 max-w-3xl font-serif text-5xl font-black leading-[0.95] md:text-7xl">Deals made for this season</h1>
                        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/70">
                            Discover discounted fashion picks with real compare prices, curated into one warm, stylish offer page.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/products" className="rounded-full bg-[#f2bd61] px-6 py-3 text-sm font-black text-[#17120c] shadow-xl transition hover:-translate-y-0.5">Shop catalog</Link>
                            <Link href="/cart" className="rounded-full border border-[#f2bd61]/30 bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/20">View cart</Link>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-[#f2bd61]/20 bg-white/10 p-6 shadow-2xl backdrop-blur">
                        <p className="text-sm font-bold text-white/65">Offer highlights</p>
                        <strong className="mt-2 block text-6xl font-black text-[#f2bd61]">{products?.total ?? rows.length}</strong>
                        <p className="mt-1 text-sm font-semibold text-white/70">discounted products available now</p>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
                <div className="mb-6 flex flex-col gap-3 rounded-xl border border-[#eadfce] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-[#17120c]">All seasonal offers</h2>
                        <p className="text-sm text-[#8a7a66]">Filter by brand and sort the best deals your way.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <select className="rounded-md border-[#eadfce] text-sm focus:border-[#b77918] focus:ring-[#b77918]" value={filters.brand ?? ''} onChange={(event) => updateFilter('brand', event.target.value)}>
                            <option value="">All brands</option>
                            {brands.map((brand: any) => <option value={brand.slug} key={brand.id}>{brand.name}</option>)}
                        </select>
                        <select className="rounded-md border-[#eadfce] text-sm focus:border-[#b77918] focus:ring-[#b77918]" value={filters.sort ?? ''} onChange={(event) => updateFilter('sort', event.target.value)}>
                            <option value="">Biggest discount</option>
                            <option value="price_low">Price low to high</option>
                            <option value="price_high">Price high to low</option>
                        </select>
                    </div>
                </div>

                {rows.length ? (
                    <>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {rows.map((product: any) => <OfferProductCard key={product.id} product={product} />)}
                        </div>
                        <Pagination links={products?.links} />
                    </>
                ) : (
                    <div className="rounded-lg border border-dashed border-[#d9cbb8] bg-white p-12 text-center">
                        <h3 className="text-2xl font-black text-[#17120c]">No offers found</h3>
                        <p className="mt-2 text-[#8a7a66]">Try clearing filters or check back for the next seasonal drop.</p>
                    </div>
                )}
            </section>
        </PublicLayout>
    );
}
