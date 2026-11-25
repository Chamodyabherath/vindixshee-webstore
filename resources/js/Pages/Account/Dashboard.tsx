import { CustomerLayout, EmptyState, StatusBadge } from '@/Components/Commerce';
import { Head, Link } from '@inertiajs/react';

function Money({ value }: { value: string | number }) {
    return <>{Number(value ?? 0).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</>;
}

export default function Dashboard({
    orderCount = 0,
    pendingOrderCount = 0,
    activeOrderCount = 0,
    deliveredOrderCount = 0,
    cancelledOrderCount = 0,
    wishlistCount = 0,
    reviewCount = 0,
    addressCount = 0,
    totalSpent = 0,
    recentOrders = [],
    wishlistItems = [],
    recentReviews = [],
}: any) {
    const stats = [
        { label: 'Total Orders', value: orderCount, tone: 'from-sky-500 to-cyan-400' },
        { label: 'Pending', value: pendingOrderCount, tone: 'from-amber-500 to-orange-400' },
        { label: 'In Progress', value: activeOrderCount, tone: 'from-fuchsia-500 to-pink-400' },
        { label: 'Delivered', value: deliveredOrderCount, tone: 'from-emerald-500 to-teal-400' },
        { label: 'Closed', value: cancelledOrderCount, tone: 'from-rose-500 to-red-400' },
        { label: 'Wishlist Items', value: wishlistCount, tone: 'from-indigo-500 to-violet-400' },
        { label: 'Reviews', value: reviewCount, tone: 'from-cyan-500 to-sky-400' },
        { label: 'Addresses', value: addressCount, tone: 'from-slate-700 to-slate-500' },
    ];

    return (
        <CustomerLayout>
            <Head title="Customer Dashboard" />

            <section className="overflow-hidden rounded-lg bg-gradient-to-br from-neutral-950 via-indigo-950 to-fuchsia-900 p-6 text-white shadow-xl md:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Account hub</p>
                <div className="mt-4 grid gap-6 md:grid-cols-[1fr_260px] md:items-end">
                    <div>
                        <h1 className="text-4xl font-black">Your shopping dashboard</h1>
                        <p className="mt-3 max-w-2xl text-white/70">
                            Track orders, revisit favorites, manage reviews, and jump back into the store from one colorful command center.
                        </p>
                    </div>
                    <div className="rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur">
                        <p className="text-sm text-white/60">Total spent</p>
                        <strong className="mt-1 block text-3xl"><Money value={totalSpent} /></strong>
                    </div>
                </div>
            </section>

            <section className="mt-6 grid gap-4 md:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className={`rounded-lg bg-gradient-to-br ${stat.tone} p-5 text-white shadow-lg transition hover:-translate-y-1`}>
                        <p className="text-sm font-semibold text-white/75">{stat.label}</p>
                        <strong className="mt-3 block text-4xl font-black">{stat.value}</strong>
                    </div>
                ))}
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-lg border bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-black">Recent orders</h2>
                        <Link href="/account/orders" className="text-sm font-bold text-fuchsia-700">View all</Link>
                    </div>
                    {recentOrders.length ? (
                        <div className="space-y-3">
                            {recentOrders.map((order: any) => (
                                <Link href={`/account/orders/${order.id}`} key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4 transition hover:border-fuchsia-200 hover:bg-fuchsia-50">
                                    <div>
                                        <p className="font-bold">{order.order_number}</p>
                                        <p className="text-sm text-neutral-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={order.order_status} />
                                        <strong><Money value={order.total_amount} /></strong>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : <EmptyState title="Your recent orders will appear here" />}
                </div>

                <div id="reviews" className="rounded-lg border bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-xl font-black">Recent reviews</h2>
                    {recentReviews.length ? (
                        <div className="space-y-3">
                            {recentReviews.map((review: any) => (
                                <div key={review.id} className="rounded-lg bg-amber-50 p-4">
                                    <div className="flex justify-between gap-3">
                                        <strong>{review.product?.name ?? 'Product'}</strong>
                                        <span className="text-sm font-black text-amber-600">{review.rating}/5</span>
                                    </div>
                                    <p className="mt-2 text-sm text-neutral-600">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    ) : <EmptyState title="No reviews yet" />}
                </div>
            </section>

            <section id="wishlist" className="mt-6 rounded-lg border bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-black">Wishlist picks</h2>
                    <Link href="/products" className="text-sm font-bold text-fuchsia-700">Find more products</Link>
                </div>
                {wishlistItems.length ? (
                    <div className="grid gap-4 md:grid-cols-4">
                        {wishlistItems.map((item: any) => (
                            <Link href={`/products/${item.product?.slug}`} key={item.id} className="rounded-lg border p-3 transition hover:-translate-y-1 hover:shadow-lg">
                                <img src={item.product?.primary_image?.image_path ?? `https://picsum.photos/seed/wishlist-${item.id}/500/500`} className="aspect-square rounded-md object-cover" />
                                <p className="mt-3 font-bold">{item.product?.name}</p>
                                <p className="text-sm text-neutral-500"><Money value={item.product?.price ?? 0} /></p>
                            </Link>
                        ))}
                    </div>
                ) : <EmptyState title="Save products to your wishlist and they will show here" />}
            </section>
        </CustomerLayout>
    );
}
