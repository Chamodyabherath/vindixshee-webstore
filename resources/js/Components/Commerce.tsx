import { Link, router, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';

export function AnimatedButton({ children, className = '', ...props }: any) {
    return <button className={`rounded-md bg-[#17120c] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#b77918] hover:shadow-lg disabled:opacity-60 ${className}`} {...props}>{children}</button>;
}

export function RatingStars({ value = 0 }: { value?: number }) {
    const stars = Math.round(value);
    return <span className="text-amber-500">{'★'.repeat(stars)}<span className="text-neutral-300">{'★'.repeat(5 - stars)}</span></span>;
}

export function EmptyState({ title = 'Nothing here yet' }) {
    return <div className="rounded-lg border border-dashed border-[#d9cbb8] bg-[#fffaf3] p-10 text-center font-semibold text-[#8a7a66]">{title}</div>;
}

export function LoadingSkeleton() {
    return <div className="h-32 animate-pulse rounded-lg bg-neutral-100" />;
}

export function QuantityInput({ value, setValue }: { value: number; setValue: (value: number) => void }) {
    return <div className="inline-flex overflow-hidden rounded-md border"><button className="px-3" onClick={() => setValue(Math.max(1, value - 1))} type="button">-</button><span className="px-4 py-2">{value}</span><button className="px-3" onClick={() => setValue(value + 1)} type="button">+</button></div>;
}

export function ProductCard({ product }: any) {
    return (
        <div className="group rounded-xl border border-[#eadfce] bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <Link href={`/products/${product.slug}`}><img className="aspect-square w-full rounded-lg object-cover" src={product.primary_image?.image_path ?? `https://picsum.photos/seed/${product.id}/600/600`} alt={product.name} /></Link>
            <div className="mt-3">
                <Link href={`/products/${product.slug}`} className="font-black text-[#17120c]">{product.name}</Link>
                <p className="text-sm font-semibold text-[#9a8e7e]">{product.sku}</p>
                <div className="mt-2 flex items-center justify-between"><strong>${product.price}</strong><button onClick={() => router.post('/cart', { product_id: product.id, quantity: 1 })} className="rounded-full bg-[#17120c] px-3 py-1 text-xs font-black text-white hover:bg-[#b77918]" type="button">Add</button></div>
            </div>
        </div>
    );
}

export function ProductGrid({ products }: any) {
    const list = products?.data ?? products ?? [];
    return list.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{list.map((product: any) => <ProductCard key={product.id} product={product} />)}</div> : <EmptyState title="No products found" />;
}

export function SearchInput(props: any) {
    return <input {...props} className={`w-full rounded-md border-[#d9cbb8] bg-[#fffaf3] text-sm focus:border-[#b77918] focus:ring-[#b77918] ${props.className ?? ''}`} />;
}

export function ProductFilters({ filters = {} }: any) {
    return (
        <aside className="rounded-lg border border-[#eadfce] bg-white p-4 shadow-sm">
            <SearchInput defaultValue={filters.search ?? ''} placeholder="Search products" onKeyDown={(event: any) => { if (event.key === 'Enter') router.get('/products', { ...filters, search: event.currentTarget.value }, { preserveState: true }); }} />
            <div className="mt-4 grid gap-2 text-sm text-neutral-500">
                <span>Price, brand, rating, availability, size and color filters are server-ready.</span>
            </div>
        </aside>
    );
}

export function ProductGallery({ images = [] }: any) {
    const first = images[0]?.image_path ?? 'https://picsum.photos/seed/gallery/900/900';
    return <div><img className="aspect-square w-full rounded-lg object-cover" src={first} alt="" /><div className="mt-3 grid grid-cols-4 gap-2">{images.map((image: any) => <img key={image.id} className="rounded object-cover" src={image.image_path} alt={image.alt_text ?? ''} />)}</div></div>;
}

export function Pagination({ links = [] }: any) {
    return <div className="mt-6 flex flex-wrap gap-2">{links.map((link: any, index: number) => <Link key={index} href={link.url ?? '#'} dangerouslySetInnerHTML={{ __html: link.label }} className={`rounded border px-3 py-1 text-sm font-bold ${link.active ? 'border-[#17120c] bg-[#17120c] text-white' : 'border-[#eadfce] bg-white text-[#6f5d47] hover:border-[#b77918]'}`} />)}</div>;
}

export function StatusBadge({ status }: { status: string }) {
    const palette: Record<string, string> = {
        active: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
        inactive: 'bg-rose-100 text-rose-700 ring-rose-200',
        draft: 'bg-amber-100 text-amber-700 ring-amber-200',
        pending: 'bg-amber-100 text-amber-700 ring-amber-200',
        confirmed: 'bg-sky-100 text-sky-700 ring-sky-200',
        packing: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
        processing: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
        packed: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
        in_courier: 'bg-cyan-100 text-cyan-700 ring-cyan-200',
        shipped: 'bg-cyan-100 text-cyan-700 ring-cyan-200',
        delivered: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
        returned: 'bg-violet-100 text-violet-700 ring-violet-200',
        cancelled: 'bg-rose-100 text-rose-700 ring-rose-200',
    };

    return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black capitalize ring-1 ${palette[status] ?? 'bg-neutral-100 text-neutral-700 ring-neutral-200'}`}>{status.replace('_', ' ')}</span>;
}

export function DataTable({ rows = [], columns = [] }: any) {
    return (
        <div className="overflow-hidden rounded-lg border border-[#eadfce] bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-[#fffaf3] text-xs uppercase tracking-wide text-[#8a7a66]">
                        <tr>{columns.map((column: any) => <th className="whitespace-nowrap px-5 py-4 text-left font-black" key={column.key}>{column.label}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0e6d8]">
                        {rows.length ? rows.map((row: any) => (
                            <tr className="transition hover:bg-[#fffaf3]" key={row.id}>
                                {columns.map((column: any) => <td className="px-5 py-4 align-middle text-[#6f5d47]" key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}
                            </tr>
                        )) : (
                            <tr><td className="px-5 py-10 text-center font-semibold text-[#9a8e7e]" colSpan={columns.length}>No records found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function ConfirmDialog({ children }: PropsWithChildren) { return <>{children}</>; }
export function ImageUploader() { return <input type="file" className="rounded-md border p-2" />; }
export function RichTextEditor(props: any) { return <textarea {...props} className="min-h-40 w-full rounded-md border-neutral-300" />; }

export function MegaMenu({ categories = [] }: any) {
    return <div className="hidden gap-5 md:flex">{categories.slice(0, 6).map((category: any) => <Link key={category.id} href={`/categories/${category.slug}`} className="text-sm hover:text-neutral-950">{category.name}</Link>)}</div>;
}

export function Navbar() {
    const [open, setOpen] = useState(false);
    const page = usePage().props as any;
    const user = page.auth?.user;
    const dashboardHref = '/dashboard';
    const navLinks = [
        ['Shop', '/products'],
        ['Categories', '/products'],
        ['Offers', '/season-offers'],
        ['Cart', '/cart'],
    ];

    return (
        <header className="sticky top-0 z-40 border-b border-amber-100 bg-white/90 shadow-sm backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <Link href="/" className="group flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17120c] text-sm font-black text-white shadow-lg transition group-hover:-rotate-3">VX</span>
                    <span>
                        <span className="block text-lg font-black text-neutral-950">VINDIXSHEE</span>
                        <span className="hidden text-xs font-semibold text-amber-700 sm:block">Fashion finds, fast checkout</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-1 rounded-full border border-amber-100 bg-[#fffaf3] p-1 text-sm font-semibold shadow-sm lg:flex">
                    {navLinks.map(([label, href]) => (
                        <Link key={label} href={href} className="rounded-full px-4 py-2 text-neutral-600 transition hover:bg-[#17120c] hover:text-white">
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    {user ? (
                        <>
                            <Link href={dashboardHref} className="rounded-full bg-[#17120c] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-700">
                                Dashboard
                            </Link>
                            <button type="button" onClick={() => router.post('/logout')} className="rounded-full border px-4 py-2.5 text-sm font-bold text-neutral-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="rounded-full px-4 py-2.5 text-sm font-bold text-neutral-700 hover:bg-neutral-100">Login</Link>
                            <Link href="/register" className="rounded-full bg-[#17120c] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-700">Create account</Link>
                        </>
                    )}
                </div>

                <button type="button" onClick={() => setOpen(!open)} className="rounded-md border px-3 py-2 text-sm font-bold lg:hidden">
                    Menu
                </button>
            </div>

            {open && (
                <div className="border-t bg-white px-4 py-4 lg:hidden">
                    <div className="grid gap-2">
                        {navLinks.map(([label, href]) => <Link key={label} href={href} className="rounded-md px-3 py-2 font-semibold text-neutral-700 hover:bg-neutral-100">{label}</Link>)}
                        {user ? <Link href={dashboardHref} className="rounded-md bg-neutral-950 px-3 py-2 font-bold text-white">Dashboard</Link> : <Link href="/login" className="rounded-md bg-neutral-950 px-3 py-2 font-bold text-white">Login</Link>}
                    </div>
                </div>
            )}
        </header>
    );
}

export function Footer() {
    return (
        <footer className="overflow-hidden bg-[#17120c] text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr]">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2bd61] text-lg font-black text-[#17120c]">VX</span>
                        <div>
                            <p className="text-xl font-black">VINDIXSHEE</p>
                            <p className="text-sm text-white/55">Fashion finds, fast checkout.</p>
                        </div>
                    </div>
                    <p className="mt-5 max-w-md text-sm leading-7 text-white/60">Discover seasonal offers, curated fashion collections, secure checkout, order tracking, and a customer dashboard built for everyday shopping.</p>
                    <div className="mt-6 flex gap-2">
                        {['Fast delivery', 'Secure checkout', 'Easy returns'].map((label) => <span key={label} className="rounded-full border border-[#f2bd61]/20 bg-[#f2bd61]/10 px-3 py-1 text-xs font-bold text-[#f8d99d]">{label}</span>)}
                    </div>
                </div>
                <div>
                    <p className="font-black">Shop</p>
                    <div className="mt-4 grid gap-3 text-sm text-white/60"><Link className="hover:text-[#f2bd61]" href="/products">All products</Link><Link className="hover:text-[#f2bd61]" href="/season-offers">Season offers</Link><Link className="hover:text-[#f2bd61]" href="/cart">Cart</Link></div>
                </div>
                <div>
                    <p className="font-black">Account</p>
                    <div className="mt-4 grid gap-3 text-sm text-white/60"><Link className="hover:text-[#f2bd61]" href="/login">Login</Link><Link className="hover:text-[#f2bd61]" href="/account/dashboard">Dashboard</Link><Link className="hover:text-[#f2bd61]" href="/profile">Profile</Link></div>
                </div>
                <div>
                    <p className="font-black">Stay in the loop</p>
                    <p className="mt-4 text-sm text-white/60">Get launches, drops, and seasonal discount alerts.</p>
                    <div className="mt-4 flex overflow-hidden rounded-md bg-white">
                        <input className="min-w-0 flex-1 border-0 px-3 py-3 text-sm text-neutral-950 focus:ring-0" placeholder="Email address" />
                        <button className="bg-[#b77918] px-4 text-sm font-bold hover:bg-[#f2bd61] hover:text-[#17120c]">Join</button>
                    </div>
                </div>
            </div>
            <div className="border-t border-[#f2bd61]/10 py-5 text-center text-xs font-semibold text-white/40">VINDIXSHEE. Built with Laravel, Inertia, React, and Tailwind.</div>
        </footer>
    );
}

export function PublicLayout({ children, fullBleed = false }: PropsWithChildren<{ fullBleed?: boolean }>) {
    return (
        <div className="min-h-screen bg-[#f6f2ec]">
            <Navbar />
            <main className={fullBleed ? 'w-full' : 'mx-auto max-w-7xl px-4 py-8'}>{children}</main>
            <Footer />
        </div>
    );
}

export function CustomerLayout({ children }: PropsWithChildren) {
    const user = (usePage().props as any).auth?.user;
    const navItems = [
        ['Dashboard', '/account/dashboard'],
        ['My Orders', '/account/orders'],
        ['Wishlist', '/account/dashboard#wishlist'],
        ['Reviews', '/account/dashboard#reviews'],
        ['Profile', '/profile'],
        ['Shop More', '/products'],
    ];

    return (
        <PublicLayout>
            <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
                <aside className="overflow-hidden rounded-lg border border-[#eadfce] bg-white shadow-sm">
                    <div className="bg-gradient-to-br from-[#17120c] via-[#5a3510] to-[#b77918] p-6 text-white">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-black ring-4 ring-[#f2bd61]/30">
                            {(user?.name ?? 'C').slice(0, 1)}
                        </div>
                        <h2 className="mt-4 text-xl font-black">{user?.name ?? 'Customer'}</h2>
                        <p className="text-sm text-white/80">{user?.email}</p>
                    </div>

                    <nav className="grid gap-2 p-4">
                        {navItems.map(([label, href]) => (
                            <Link key={label} href={href} className="rounded-md px-4 py-3 text-sm font-semibold text-[#6f5d47] transition hover:bg-[#fff4df] hover:text-[#b77918]">
                                {label}
                            </Link>
                        ))}
                    </nav>

                    <div className="border-t p-4">
                        <button
                            type="button"
                            onClick={() => router.post('/logout')}
                            className="w-full rounded-md bg-[#17120c] px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-lg"
                        >
                            Logout
                        </button>
                    </div>
                </aside>

                <section>{children}</section>
            </div>
        </PublicLayout>
    );
}

export function AdminSidebar() {
    const page = usePage();
    const items = [
        ['Dashboard', '/admin/dashboard'],
        ['Products', '/admin/products'],
        ['Categories', '/admin/categories'],
        ['Brands', '/admin/brands'],
        ['Orders', '/admin/orders'],
        ['Reviews', '/admin/reviews'],
        ['Coupons', '/admin/coupons'],
        ['Banners', '/admin/banners'],
        ['Customers', '/admin/customers'],
        ['Inventory', '/admin/inventory'],
        ['Reports', '/admin/reports'],
        ['Settings', '/admin/settings'],
    ];

    return (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 overflow-y-auto bg-[#17120c] text-white shadow-2xl lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,189,97,0.25),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(183,121,24,0.22),transparent_34%)]" />
            <div className="relative p-5">
                <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-lg border border-[#f2bd61]/20 bg-white/10 p-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2bd61] text-lg font-black text-[#17120c]">VX</span>
                    <span>
                        <span className="block text-base font-black">VINDIXSHEE Admin</span>
                        <span className="text-xs font-semibold text-[#f8d99d]/70">Fashion control room</span>
                    </span>
                </Link>

                <nav className="mt-6 grid gap-1.5">
                    {items.map(([label, href]) => {
                        const active = page.url === href || (href !== '/admin/dashboard' && page.url.startsWith(href));
                        return (
                            <Link
                                className={`rounded-lg px-4 py-3 text-sm font-bold transition ${active ? 'bg-[#f2bd61] text-[#17120c] shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                                key={href}
                                href={href}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8 rounded-lg border border-[#f2bd61]/20 bg-white/10 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-[#f8d99d]">Fast actions</p>
                    <div className="mt-3 grid gap-2">
                        <Link href="/admin/products/create" className="rounded-md bg-[#f2bd61] px-3 py-2 text-sm font-black text-[#17120c]">Add product</Link>
                        <Link href="/admin/categories/create" className="rounded-md border border-[#f2bd61]/20 px-3 py-2 text-sm font-black text-white hover:bg-white/10">Add category</Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export function AdminTopbar() {
    const page = usePage().props as any;
    const user = page.auth?.user;

    return (
        <div className="sticky top-0 z-30 border-b border-[#eadfce] bg-white/90 px-4 py-4 shadow-sm backdrop-blur-xl sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b77918]">Admin panel</p>
                    <h1 className="text-xl font-black text-[#17120c]">Store management</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/" className="rounded-full border border-[#eadfce] px-4 py-2 text-sm font-bold text-[#6f5d47] hover:bg-[#fffaf3]">View store</Link>
                    <button type="button" onClick={() => router.post('/logout')} className="rounded-full bg-[#17120c] px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-rose-600">Logout</button>
                    <div className="hidden items-center gap-3 rounded-full border border-[#eadfce] bg-white py-1 pl-1 pr-4 sm:flex">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f2bd61] text-sm font-black text-[#17120c]">{(user?.name ?? 'A').slice(0, 1)}</span>
                        <span className="text-sm font-black text-[#6f5d47]">{user?.name ?? 'Admin'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AdminLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-[#f6f2ec]">
            <AdminSidebar />
            <main className="min-h-screen lg:pl-72">
                <AdminTopbar />
                <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</div>
            </main>
        </div>
    );
}
export function CartDrawer() { return null; }
