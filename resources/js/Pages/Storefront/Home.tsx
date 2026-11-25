import { Head, Link, router } from '@inertiajs/react';
import { PublicLayout } from '@/Components/Commerce';
import { useEffect, useMemo, useState } from 'react';

const images = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=92',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=92',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=92',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1800&q=92',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=90',
    'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=90',
];

const categoryColors = ['bg-[#ffd4df]', 'bg-[#c9f0f1]', 'bg-[#cac8b5]', 'bg-[#ffd9cf]', 'bg-[#ffe8de]', 'bg-[#f6c0d7]', 'bg-[#d8ead1]', 'bg-[#f7deb6]', 'bg-[#d7d7f3]', 'bg-[#f0ccd0]', 'bg-[#d9efe8]', 'bg-[#f3d7b9]'];

function money(value: any) {
    return `$${Number(value ?? 0).toFixed(2)}`;
}

function imageFor(product: any, index: number) {
    return product?.primary_image?.image_path ?? images[(index + 4) % images.length];
}

function SectionTitle({ eyebrow, children }: { eyebrow?: string; children: string }) {
    return (
        <div className="mb-9 text-center">
            {eyebrow && <p className="text-xs font-black uppercase tracking-[0.28em] text-[#be7b25]">{eyebrow}</p>}
            <h2 className="mt-2 font-serif text-3xl font-black tracking-tight text-[#17120c] md:text-5xl">{children}</h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#d99b3d]" />
        </div>
    );
}

function ProductTile({ product, index }: { product: any; index: number }) {
    if (!product) return null;

    const compare = Number(product.compare_price ?? 0);
    const price = Number(product.price ?? 0);

    return (
        <Link href={`/products/${product.slug}`} className="group block rounded-xl bg-white p-2.5 shadow-[0_14px_34px_rgba(53,39,22,0.08)] ring-1 ring-[#eadfce] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(53,39,22,0.16)]">
            <div className="relative overflow-hidden rounded-lg bg-[#f5efe6]">
                <img src={imageFor(product, index)} alt={product.name} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105" />
                {compare > price && <span className="absolute left-3 top-3 rounded-full bg-[#f18719] px-3 py-1 text-[10px] font-black uppercase text-white">Sale</span>}
            </div>
            <div className="px-1 pb-1 pt-3">
                <p className="line-clamp-1 text-sm font-black text-[#17120c]">{product.name}</p>
                <p className="mt-1 text-xs font-semibold text-[#9a8e7e]">{product.brand?.name ?? 'Fashion edit'}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                    <div>
                        <p className="text-sm font-black text-[#17120c]">{money(product.price)}</p>
                        {compare > price && <p className="text-xs font-bold text-[#b9aa98] line-through">{money(compare)}</p>}
                    </div>
                    <button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault();
                            router.post('/cart', { product_id: product.id, quantity: 1 }, { preserveScroll: true });
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2bd61] text-base font-black text-[#3a2505] transition hover:bg-[#17120c] hover:text-white"
                    >
                        +
                    </button>
                </div>
            </div>
        </Link>
    );
}

function CategoryBubble({ category, index }: { category: any; index: number }) {
    return (
        <Link href={category.href ?? `/categories/${category.slug}`} className="group text-center">
            <div className={`mx-auto h-24 w-24 overflow-hidden rounded-full ${categoryColors[index % categoryColors.length]} p-2 shadow-[0_16px_28px_rgba(53,39,22,0.10)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_22px_34px_rgba(53,39,22,0.16)] sm:h-28 sm:w-28 lg:h-32 lg:w-32`}>
                <img src={images[(index + 4) % images.length]} alt={category.name} className="h-full w-full rounded-full object-cover" />
            </div>
            <p className="mt-3 text-xs font-black text-[#17120c] sm:text-sm">{category.name}</p>
        </Link>
    );
}

function ServiceCard({ title, body, number, tone }: { title: string; body: string; number: string; tone: string }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-[#eadfce] bg-white p-6 shadow-[0_18px_46px_rgba(53,39,22,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(53,39,22,0.14)]">
            <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full ${tone} opacity-40 blur-2xl`} />
            <div className="relative flex items-start gap-4">
                <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${tone} text-xl font-black text-[#17120c] shadow-inner ring-4 ring-white`}>{number}</span>
                <span>
                    <span className="block text-lg font-black text-[#17120c]">{title}</span>
                    <span className="mt-2 block text-sm font-semibold leading-6 text-[#877967]">{body}</span>
                </span>
            </div>
        </div>
    );
}

export default function Home({ categories = [], featured = [], newArrivals = [], bestSellers = [], seasonOffers = [] }: any) {
    const fallbackCategories = [
        { id: 'f1', name: 'Crop Top', href: '/products?search=crop' },
        { id: 'f2', name: 'Pants', href: '/products?search=pants' },
        { id: 'f3', name: 'Shirts', href: '/products?search=shirt' },
        { id: 'f4', name: 'T-shirts', href: '/products?search=t-shirt' },
        { id: 'f5', name: 'Innerwear', href: '/products?search=innerwear' },
        { id: 'f6', name: 'Dresses', href: '/products?search=dress' },
        { id: 'f7', name: 'Skirts', href: '/products?search=skirt' },
        { id: 'f8', name: 'Denim', href: '/products?search=denim' },
        { id: 'f9', name: 'Jackets', href: '/products?search=jacket' },
        { id: 'f10', name: 'Accessories', href: '/products?search=accessories' },
        { id: 'f11', name: 'Shoes', href: '/products?search=shoes' },
        { id: 'f12', name: 'Bags', href: '/products?search=bags' },
    ];
    const categoryList = [...categories.slice(0, 12), ...fallbackCategories].slice(0, 12);
    const offers = (seasonOffers.length ? seasonOffers : featured).slice(0, 6);
    const best = (bestSellers.length ? bestSellers : newArrivals.length ? newArrivals : featured).slice(0, 6);
    const mainOffer = offers[0] ?? best[0];
    const slides = useMemo(() => [
        {
            eyebrow: 'New Arrival',
            title: 'Discover Our New Collection',
            body: 'Style, comfort, and trending fashion for every day. Shop latest outfits with fast delivery and secure checkout.',
            image: images[0],
            cta: 'Shop now',
            href: '/products',
        },
        {
            eyebrow: 'Season Sale',
            title: 'Warm Looks, Hot Offers',
            body: 'Refresh your wardrobe with limited seasonal discounts and hand-picked best sellers.',
            image: images[1],
            cta: 'View offers',
            href: '/season-offers',
        },
        {
            eyebrow: 'Best Sellers',
            title: 'Fashion Customers Love',
            body: 'Explore the pieces shoppers keep adding to cart, from easy basics to standout weekend styles.',
            image: images[2],
            cta: 'Browse products',
            href: '/products?sort=latest',
        },
    ], []);
    const [active, setActive] = useState(0);
    const slide = slides[active];

    useEffect(() => {
        const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 5200);
        return () => window.clearInterval(timer);
    }, [slides.length]);

    return (
        <PublicLayout fullBleed>
            <Head title="VINDIXSHEE" />

            <div className="min-h-screen bg-[#f6f2ec] text-[#17120c]">
                <section className="relative min-h-[calc(100vh-65px)] overflow-hidden bg-[#f5f1ea]">
                    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(95,75,45,0.055)_1px,transparent_1px)] bg-[length:54px_54px]" />
                    {slides.map((item, index) => (
                        <img
                            key={item.title}
                            src={item.image}
                            alt=""
                            className={`absolute inset-y-0 left-0 h-full w-full object-cover object-center transition duration-1000 lg:w-[58%] ${active === index ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`}
                        />
                    ))}
                    <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-t from-[#f5f1ea] via-[#f5f1ea]/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#f5f1ea]/72 lg:to-[#f5f1ea]" />

                    <div className="relative mx-auto grid min-h-[calc(100vh-65px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.84fr]">
                        <div className="hidden lg:block" />
                        <div className="rounded-2xl bg-[#ffe6ba]/95 p-7 shadow-[0_28px_70px_rgba(151,91,20,0.22)] ring-1 ring-[#f1cf98] backdrop-blur sm:p-10">
                            <p className="text-sm font-black text-[#6c5130]">{slide.eyebrow}</p>
                            <h1 className="mt-3 font-serif text-5xl font-black leading-[0.95] text-[#bd8129] sm:text-7xl">
                                {slide.title}
                            </h1>
                            <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-[#6f5d47]">
                                {slide.body}
                            </p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link href={slide.href} className="inline-flex rounded-sm bg-[#af7417] px-6 py-3 text-xs font-black uppercase tracking-wide text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#17120c]">
                                    {slide.cta}
                                </Link>
                                <Link href="#categories" className="inline-flex rounded-sm border border-[#c99655] bg-white/50 px-6 py-3 text-xs font-black uppercase tracking-wide text-[#6c5130] transition hover:bg-white">
                                    Shop categories
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-2">
                        {slides.map((item, index) => (
                            <button
                                key={item.title}
                                type="button"
                                onClick={() => setActive(index)}
                                className={`h-2.5 rounded-full transition-all ${active === index ? 'w-10 bg-[#17120c]' : 'w-2.5 bg-[#b89562]'}`}
                                aria-label={`Show ${item.title}`}
                            />
                        ))}
                    </div>
                </section>

                <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
                    <SectionTitle eyebrow="Explore more">Shop By Category</SectionTitle>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-9 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12">
                        {categoryList.map((category: any, index: number) => <CategoryBubble key={category.id ?? category.slug} category={category} index={index} />)}
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
                    <div className="grid gap-5 lg:grid-cols-3">
                        <ServiceCard title="Fast Delivery" body="Island-wide delivery within 3 to 4 days, with careful packing and order tracking." number="01" tone="bg-[#ffd38f]" />
                        <ServiceCard title="Easy Installments" body="Split your payment into simple installments and shop new arrivals without stress." number="02" tone="bg-[#d7efe3]" />
                        <ServiceCard title="Secure Payments" body="Protected checkout for every order with trusted card, banking, and cash options." number="03" tone="bg-[#d9e4ff]" />
                    </div>
                </section>

                <section className="bg-white py-16 shadow-[inset_0_1px_0_#eadfce,inset_0_-1px_0_#eadfce]">
                    <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="relative min-h-[620px] overflow-hidden rounded-2xl bg-[#ead9c4] shadow-[0_24px_54px_rgba(53,39,22,0.12)]">
                            <img src={images[3]} alt="Model wearing seasonal fashion offer" className="absolute inset-0 h-full w-full object-cover object-center" />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
                            <div className="absolute right-5 top-8 rounded-xl bg-white px-5 py-4 text-center shadow-xl">
                                <p className="rounded-md bg-[#f18719] px-3 py-1 text-sm font-black text-white">Special offer</p>
                                <p className="mt-2 text-5xl font-black text-[#f18719]">25%</p>
                                <p className="-mt-1 text-sm font-black">off</p>
                            </div>
                            {mainOffer && (
                                <Link href={`/products/${mainOffer.slug}`} className="absolute bottom-6 left-6 max-w-[280px] rounded-xl bg-white/95 p-5 shadow-xl backdrop-blur">
                                    <p className="text-xs font-black uppercase tracking-wide text-[#b58c58]">Season pick</p>
                                    <h3 className="mt-1 text-lg font-black">{mainOffer.name}</h3>
                                    <p className="mt-2 text-sm font-black text-[#c27b20]">{money(mainOffer.price)}</p>
                                </Link>
                            )}
                        </div>

                        <div>
                            <SectionTitle eyebrow="Limited deals">Offers in Season</SectionTitle>
                            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                                {offers.map((product: any, index: number) => <ProductTile key={product.id} product={product} index={index} />)}
                            </div>
                            <div className="mt-8 text-center">
                                <Link href="/season-offers" className="inline-flex rounded-full bg-[#17120c] px-7 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#c27b20]">
                                    View season offers
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
                    <div>
                        <SectionTitle eyebrow="Popular now">Most Selling Products</SectionTitle>
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                            {best.map((product: any, index: number) => <ProductTile key={product.id} product={product} index={index + 3} />)}
                        </div>
                    </div>

                    <div className="relative min-h-[620px] overflow-hidden rounded-2xl bg-[#fff4d9] shadow-[0_24px_54px_rgba(53,39,22,0.12)]">
                        <img src={images[1]} alt="Shopper carrying colorful bags" className="absolute inset-0 h-full w-full object-cover object-center" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-white/95 p-6 shadow-xl backdrop-blur sm:right-auto sm:max-w-sm">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c27b20]">Trending now</p>
                            <h3 className="mt-2 font-serif text-3xl font-black leading-tight">Best sellers customers love</h3>
                            <Link href="/products" className="mt-5 inline-flex rounded-sm bg-[#c27b20] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#17120c]">Shop collection</Link>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
