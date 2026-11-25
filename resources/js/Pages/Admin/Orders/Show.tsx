import { Link, router } from '@inertiajs/react';
import { AdminLayout, StatusBadge } from '@/Components/Commerce';

const money = (value: any) => `$${Number(value ?? 0).toFixed(2)}`;
const workflow = [
    ['pending', 'Pending'],
    ['confirmed', 'Confirm'],
    ['packing', 'Packing'],
    ['in_courier', 'In courier'],
    ['delivered', 'Delivered'],
    ['returned', 'Returned'],
];

export default function Show({ order }: any) {
    const update = (order_status: string) => {
        const note = window.prompt(`Add note for ${order_status.replace('_', ' ')} update`, '');
        router.patch(`/admin/orders/${order.id}/status`, { order_status, note }, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <Link href="/admin/orders" className="text-sm font-black text-fuchsia-700">Back to orders</Link>
                    <h1 className="mt-2 text-3xl font-black text-slate-950">{order.order_number}</h1>
                    <p className="mt-1 text-sm font-semibold text-slate-400">Placed {new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                    <StatusBadge status={order.order_status} />
                    <StatusBadge status={order.payment_status} />
                </div>
            </div>

            <section className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-xl">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.32),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.24),transparent_36%)] p-6">
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-200">Order workflow</p>
                    <div className="mt-5 grid gap-3 md:grid-cols-6">
                        {workflow.map(([status, label]) => (
                            <button key={status} type="button" onClick={() => update(status)} className={`rounded-lg border p-4 text-left transition ${order.order_status === status ? 'border-white bg-white text-slate-950' : 'border-white/15 bg-white/10 text-white hover:bg-white/20'}`}>
                                <p className="text-xs font-black uppercase opacity-60">{status.replace('_', ' ')}</p>
                                <p className="mt-1 font-black">{label}</p>
                            </button>
                        ))}
                    </div>
                    {order.order_status !== 'cancelled' && (
                        <button type="button" onClick={() => update('cancelled')} className="mt-4 rounded-full bg-rose-500 px-5 py-3 text-sm font-black text-white shadow-lg hover:bg-rose-600">Cancel order</button>
                    )}
                </div>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-xl font-black text-slate-950">Items</h2>
                    <div className="mt-5 divide-y divide-slate-100">
                        {order.items?.map((item: any) => (
                            <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                                <div>
                                    <p className="font-black text-slate-950">{item.product_name}</p>
                                    <p className="text-sm font-semibold text-slate-400">SKU {item.product_sku} x {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-950">{money(item.total_price)}</p>
                                    <p className="text-sm text-slate-400">{money(item.unit_price)} each</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-xl font-black text-slate-950">Customer</h2>
                        <div className="mt-4 space-y-2 text-sm font-semibold text-slate-600">
                            <p>{order.customer_name}</p>
                            <p>{order.customer_email}</p>
                            <p>{order.customer_phone}</p>
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-xl font-black text-slate-950">Payment summary</h2>
                        <div className="mt-4 space-y-3 text-sm">
                            <div className="flex justify-between"><span>Subtotal</span><strong>{money(order.subtotal)}</strong></div>
                            <div className="flex justify-between"><span>Discount</span><strong>{money(order.discount_amount)}</strong></div>
                            <div className="flex justify-between"><span>Shipping</span><strong>{money(order.shipping_amount)}</strong></div>
                            <div className="flex justify-between border-t pt-3 text-lg"><span className="font-black">Total</span><strong>{money(order.total_amount)}</strong></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black text-slate-950">Status timeline</h2>
                <div className="mt-5 grid gap-3">
                    {order.histories?.length ? order.histories.map((history: any) => (
                        <div key={history.id} className="rounded-lg bg-slate-50 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    {history.from_status && <StatusBadge status={history.from_status} />}
                                    <span className="font-black text-slate-400">to</span>
                                    <StatusBadge status={history.to_status} />
                                </div>
                                <span className="text-xs font-bold text-slate-400">{new Date(history.created_at).toLocaleString()}</span>
                            </div>
                            {history.note && <p className="mt-2 text-sm font-semibold text-slate-500">{history.note}</p>}
                        </div>
                    )) : <p className="rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-500">No timeline events yet.</p>}
                </div>
            </section>
        </AdminLayout>
    );
}
