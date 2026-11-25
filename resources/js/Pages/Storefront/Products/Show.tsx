import { Head, Link, router } from '@inertiajs/react';
import { ProductGrid, PublicLayout, QuantityInput, StatusBadge } from '@/Components/Commerce';
import { useMemo, useState } from 'react';

function money(value: string | number) {
    return Number(value ?? 0).toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

function discountPercent(price: string | number, compare?: string | number | null) {
    const current = Number(price ?? 0);
    const previous = Number(compare ?? 0);

    return previous > current ? Math.round(((previous - current) / previous) * 100) : 0;
}

function MiniInfo({ label, value }: { label: string; value: string }) {
    return (
        <div className="group rounded-lg border border-[#eadfce] bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#f2bd61] hover:shadow-lg">
            <p className="text-xs font-black uppercase tracking-widest text-[#b77918]">{label}</p>
            <p className="mt-1 font-bold text-[#17120c]">{value}</p>
        </div>
    );
}

function FeaturePill({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="rounded-lg border border-white/15 bg-white/10 p-4 text-white shadow-lg backdrop-blur">
            <p className="text-sm font-black">{title}</p>
            <p className="mt-1 text-xs font-semibold text-white/65">{subtitle}</p>
        </div>
    );
}

function RatingMeter({ value, count }: { value: number; count: number }) {
    const percent = Math.min(100, Math.max(0, (value / 5) * 100));

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="h-2 w-28 overflow-hidden rounded-full bg-[#eadfce]">
                <span className="block h-full rounded-full bg-gradient-to-r from-[#f2bd61] to-[#b77918]" style={{ width: `${percent}%` }} />
            </div>
            <span className="text-sm font-black text-[#17120c]">{value ? value.toFixed(1) : 'New'}</span>
            <span className="text-sm font-semibold text-[#8a7a66]">{count} reviews</span>
        </div>
    );
}

function StockPulse({ inStock, stockQuantity, managesStock }: { inStock: boolean; stockQuantity: number; managesStock: boolean }) {
    const stockPercent = managesStock ? Math.min(100, Math.max(8, (Number(stockQuantity || 0) / 25) * 100)) : 100;

    return (
        <div className="rounded-lg border border-[#eadfce] bg-[#fffaf3] p-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#b77918]">Availability</p>
                    <p className="mt-1 text-sm font-bold text-[#6f5d47]">{managesStock ? `${stockQuantity} available` : 'Available for order'}</p>
                </div>
                <span className={`h-3 w-3 rounded-full ${inStock ? 'bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.15)]' : 'bg-rose-500 shadow-[0_0_0_6px_rgba(244,63,94,0.15)]'}`} />
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#eadfce]">
                <span className={`block h-full rounded-full transition-all duration-700 ${inStock ? 'bg-gradient-to-r from-emerald-400 to-[#f2bd61]' : 'bg-rose-400'}`} style={{ width: `${stockPercent}%` }} />
            </div>
        </div>
    );
}

export default function Show({ product, related = [] }: any) {
    const images = product.images?.length
        ? product.images
        : [{ id: 'fallback', image_path: `https://picsum.photos/seed/product-${product.id}/1000/1000`, alt_text: product.name }];

    const [activeImage, setActiveImage] = useState(images[0]?.image_path);
    const [selectedVariation, setSelectedVariation] = useState<any>(product.variations?.[0] ?? null);
    const [quantity, setQuantity] = useState(1);
    const [tab, setTab] = useState<'description' | 'details' | 'reviews'>('description');

    const price = selectedVariation?.price ?? product.price;
    const comparePrice = selectedVariation?.compare_price ?? product.compare_price;
    const stockQuantity = selectedVariation?.stock_quantity ?? product.stock_quantity;
    const discount = discountPercent(price, comparePrice);
    const inStock = !product.manage_stock || stockQuantity > 0;
    const heroImage = selectedVariation?.image ?? activeImage;

    const reviewAverage = useMemo(() => {
        const reviews = product.approved_reviews ?? [];
        if (!reviews.length) return 0;

        return reviews.reduce((sum: number, review: any) => sum + Number(review.rating ?? 0), 0) / reviews.length;
    }, [product.approved_reviews]);

    const addToCart = () => {
        router.post('/cart', {
            product_id: product.id,
            product_variation_id: selectedVariation?.id,
            quantity,
        }, { preserveScroll: true });
    };

    const buyNow = () => {
        router.post('/cart', {
            product_id: product.id,
            product_variation_id: selectedVariation?.id,
            quantity,
        }, {
            preserveScroll: true,
            onSuccess: () => router.visit('/checkout'),
        });
    };

    return (
        <PublicLayout fullBleed>
            <Head title={product.meta_title ?? product.name} />

            <section className="relative isolate overflow-hidden bg-[#17120c] text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(242,189,97,0.3),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(183,121,24,0.22),transparent_26%),linear-gradient(135deg,rgba(23,18,12,0.96),rgba(79,45,13,0.88))]" />
                <div className="absolute left-1/2 top-0 h-40 w-[36rem] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[1fr_0.85fr] lg:py-12">
                    <div className="animate-fade-up">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-white/65">
                            <Link href="/" className="transition hover:text-[#f2bd61]">Home</Link>
                            <span>/</span>
                            <Link href="/products" className="transition hover:text-[#f2bd61]">Products</Link>
                            {product.category && <><span>/</span><Link href={`/categories/${product.category.slug}`} className="transition hover:text-[#f2bd61]">{product.category.name}</Link></>}
                        </div>

                        <p className="mt-8 text-sm font-black uppercase tracking-[0.3em] text-[#f8d99d]">{product.brand?.name ?? 'VINDIXSHEE'} selection</p>
                        <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight md:text-6xl">{product.name}</h1>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">{product.short_description}</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:self-end">
                        <FeaturePill title="Fast dispatch" subtitle="Packed quickly after checkout" />
                        <FeaturePill title="Secure payment" subtitle="Protected checkout flow" />
                        <FeaturePill title="Easy returns" subtitle="Simple support after delivery" />
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
                <div className="animate-fade-up [animation-delay:120ms]">
                    <div className="group overflow-hidden rounded-lg border border-[#eadfce] bg-white p-3 shadow-xl shadow-[#17120c]/5">
                        <div className="relative overflow-hidden rounded-md bg-[#fffaf3]">
                            <img key={heroImage} src={heroImage} alt={product.name} className="animate-image-pop aspect-square w-full object-cover transition duration-700 group-hover:scale-105" />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#17120c]/20 via-transparent to-white/20 opacity-70" />
                            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition duration-700 group-hover:animate-shimmer group-hover:opacity-100" />
                            {discount > 0 && <span className="absolute left-5 top-5 rounded-full bg-rose-600 px-4 py-2 text-sm font-black text-white shadow-lg">{discount}% off</span>}
                            <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#17120c] shadow-lg backdrop-blur">Featured view</span>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-5 gap-3">
                        {images.map((image: any, index: number) => (
                            <button
                                key={image.id}
                                type="button"
                                onClick={() => setActiveImage(image.image_path)}
                                className={`group overflow-hidden rounded-md border bg-white p-1 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${activeImage === image.image_path ? 'border-[#b77918] ring-2 ring-[#f2bd61]/40' : 'border-[#eadfce] hover:border-[#f2bd61]'}`}
                                style={{ animationDelay: `${index * 55}ms` }}
                            >
                                <img src={image.image_path} alt={image.alt_text ?? product.name} className="aspect-square w-full rounded object-cover transition duration-300 group-hover:scale-110" />
                            </button>
                        ))}
                    </div>
                </div>

                <aside className="animate-fade-up [animation-delay:220ms] lg:sticky lg:top-24 lg:self-start">
                    <div className="overflow-hidden rounded-lg border border-[#eadfce] bg-white shadow-2xl shadow-[#17120c]/10">
                        <div className="border-b border-[#eadfce] bg-gradient-to-r from-[#fffaf3] to-white p-6">
                            <div className="flex flex-wrap items-center gap-2">
                                {product.brand && <span className="rounded-full bg-[#f2bd61]/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#8a520f]">{product.brand.name}</span>}
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#6f5d47] ring-1 ring-[#eadfce]">SKU {selectedVariation?.sku ?? product.sku}</span>
                                <StatusBadge status={inStock ? 'in stock' : 'out of stock'} />
                            </div>

                            <div className="mt-5">
                                <RatingMeter value={reviewAverage} count={product.approved_reviews?.length ?? 0} />
                            </div>

                            <div className="mt-6 flex flex-wrap items-end gap-3">
                                <strong className="text-4xl font-black text-[#17120c] md:text-5xl">{money(price)}</strong>
                                {comparePrice && <span className="text-lg font-semibold text-[#9a8e7e] line-through">{money(comparePrice)}</span>}
                            </div>
                        </div>

                        <div className="p-6">
                            {product.variations?.length > 0 && (
                                <div>
                                    <p className="text-sm font-black uppercase tracking-widest text-[#8a7a66]">Choose option</p>
                                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                        {product.variations.map((variation: any) => (
                                            <button
                                                key={variation.id}
                                                type="button"
                                                onClick={() => setSelectedVariation(variation)}
                                                className={`rounded-lg border p-3 text-left transition duration-300 hover:-translate-y-0.5 ${selectedVariation?.id === variation.id ? 'border-[#b77918] bg-[#fff4df] shadow-lg ring-2 ring-[#f2bd61]/35' : 'border-[#eadfce] bg-white hover:border-[#f2bd61] hover:shadow-md'}`}
                                            >
                                                <span className="block font-black text-[#17120c]">{variation.sku}</span>
                                                <span className="text-sm font-semibold text-[#8a7a66]">{money(variation.price)} / {variation.stock_quantity} available</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 grid gap-4 md:grid-cols-[auto_1fr]">
                                <div>
                                    <p className="mb-2 text-xs font-black uppercase tracking-widest text-[#8a7a66]">Quantity</p>
                                    <QuantityInput value={quantity} setValue={setQuantity} />
                                </div>
                                <StockPulse inStock={inStock} stockQuantity={stockQuantity} managesStock={Boolean(product.manage_stock)} />
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <button type="button" onClick={addToCart} disabled={!inStock} className="rounded-md bg-[#17120c] px-5 py-3 text-sm font-black text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#b77918] hover:shadow-xl disabled:translate-y-0 disabled:opacity-50">
                                    Add to cart
                                </button>
                                <button type="button" onClick={buyNow} disabled={!inStock} className="rounded-md bg-gradient-to-r from-[#b77918] to-[#17120c] px-5 py-3 text-sm font-black text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl disabled:translate-y-0 disabled:opacity-50">
                                    Buy now
                                </button>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                <MiniInfo label="Shipping" value="Fast dispatch" />
                                <MiniInfo label="Payment" value="Secure checkout" />
                                <MiniInfo label="Returns" value="Easy returns" />
                            </div>
                        </div>
                    </div>
                </aside>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
                <div className="animate-fade-up overflow-hidden rounded-lg border border-[#eadfce] bg-white shadow-xl shadow-[#17120c]/5 [animation-delay:320ms]">
                    <div className="flex flex-wrap gap-2 border-b border-[#eadfce] bg-[#fffaf3] p-4">
                        {[
                            ['description', 'Description'],
                            ['details', 'Specifications'],
                            ['reviews', `Reviews (${product.approved_reviews?.length ?? 0})`],
                        ].map(([key, label]) => (
                            <button key={key} type="button" onClick={() => setTab(key as any)} className={`rounded-full px-4 py-2 text-sm font-black transition duration-300 ${tab === key ? 'bg-[#17120c] text-white shadow-lg' : 'bg-white text-[#6f5d47] ring-1 ring-[#eadfce] hover:-translate-y-0.5 hover:text-[#17120c]'}`}>
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {tab === 'description' && (
                            <div key="description" className="animate-fade-up max-w-4xl text-base leading-8 text-[#6f5d47]">
                                <p>{product.description ?? product.short_description}</p>
                            </div>
                        )}

                        {tab === 'details' && (
                            <div key="details" className="animate-fade-up grid gap-3 md:grid-cols-2">
                                <MiniInfo label="Weight" value={product.weight ? `${product.weight}` : 'Not specified'} />
                                <MiniInfo label="Dimensions" value={[product.length, product.width, product.height].filter(Boolean).join(' x ') || 'Not specified'} />
                                <MiniInfo label="Category" value={product.category?.name ?? 'Uncategorized'} />
                                <MiniInfo label="Brand" value={product.brand?.name ?? 'VINDIXSHEE'} />
                            </div>
                        )}

                        {tab === 'reviews' && (
                            <div key="reviews" className="animate-fade-up grid gap-4 md:grid-cols-2">
                                {(product.approved_reviews ?? []).length ? product.approved_reviews.map((review: any) => (
                                    <div key={review.id} className="rounded-lg border border-[#f2bd61]/30 bg-[#fffaf3] p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                                        <div className="flex items-center justify-between gap-3">
                                            <strong className="text-[#17120c]">{review.customer_name}</strong>
                                            <span className="rounded-full bg-[#f2bd61]/25 px-3 py-1 text-sm font-black text-[#8a520f]">{review.rating}/5</span>
                                        </div>
                                        {review.title && <p className="mt-2 font-bold text-[#17120c]">{review.title}</p>}
                                        <p className="mt-1 text-sm leading-6 text-[#6f5d47]">{review.comment}</p>
                                    </div>
                                )) : (
                                    <div className="rounded-lg border border-dashed border-[#eadfce] bg-[#fffaf3] p-8 text-center font-semibold text-[#8a7a66] md:col-span-2">No reviews yet. Be the first to review this product after purchase.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-br from-[#fffaf3] via-white to-[#f6f2ec] py-12">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="mb-5 flex items-end justify-between gap-3">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b77918]">More to love</p>
                            <h2 className="mt-1 text-3xl font-black text-[#17120c]">Related products</h2>
                        </div>
                        <Link href="/products" className="rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-bold text-[#6f5d47] shadow-sm transition hover:-translate-y-0.5 hover:border-[#f2bd61] hover:text-[#17120c]">View catalog</Link>
                    </div>
                    <ProductGrid products={related} />
                </div>
            </section>
        </PublicLayout>
    );
}
