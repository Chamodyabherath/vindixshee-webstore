import { CustomerLayout, EmptyState, Pagination, StatusBadge } from '@/Components/Commerce';
import { Head, Link, router } from '@inertiajs/react';

const money = (value: any) => `$${Number(value ?? 0).toFixed(2)}`;

export default function Orders({ orders }: any) {
    const rows = orders?.data ?? [];

    const cancel = (order: any) => {
        if (window.confirm(`Cancel order ${order.order_number}?`)) {
            router.patch(`/account/orders/${order.id}/cancel`, {}, { preserveScroll: true });
        }
    };

    return (
        <CustomerLayout>
            <Head title="My Orders" />

            <section className="overflow-hidden rounded-lg bg-gradient-to-br from-slate-950 via-indigo-950 to-fuchsia-900 p-6 text-white shadow-xl md:p-8">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-200">Order tracking</p>
                <h1 className="mt-4 text-4xl font-black">My orders</h1>
                <p className="mt-3 max-w-2xl text-white/70">Follow purchases from pending confirmation through packing, courier dispatch, delivery, and returns.</p>
            </section>

            <section className="mt-6">
                {rows.length ? (
                    <div className="space-y-4">
                        {rows.map((order: any) => (
                            <div key={order.id} className="rounded-lg border bg-white p-5 shadow-sm transition hover:border-fuchsia-200 hover:shadow-md">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <Link href={`/account/orders/${order.id}`} className="text-lg font-black text-slate-950 hover:text-fuchsia-600">{order.order_number}</Link>
                                        <p className="mt-1 text-sm font-semibold text-slate-400">Placed {new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <StatusBadge status={order.order_status} />
                                        <strong className="text-lg text-slate-950">{money(order.total_amount)}</strong>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Link href={`/account/orders/${order.id}`} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">View details</Link>
                                    {order.order_status === 'pending' && <button type="button" onClick={() => cancel(order)} className="rounded-full bg-rose-100 px-4 py-2 text-xs font-black text-rose-700">Cancel pending order</button>}
                                </div>
                            </div>
                        ))}
                        <Pagination links={orders?.links ?? []} />
                    </div>
                ) : <EmptyState title="Orders will appear here after checkout" />}
            </section>
        </CustomerLayout>
    );
}
