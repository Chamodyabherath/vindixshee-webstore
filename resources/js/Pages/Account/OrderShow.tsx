import { CustomerLayout, StatusBadge } from '@/Components/Commerce';
import { Head, Link, router } from '@inertiajs/react';

const money = (value: any) => `$${Number(value ?? 0).toFixed(2)}`;
const steps = ['pending', 'confirmed', 'packing', 'in_courier', 'delivered'];

export default function OrderShow({ order }: any) {
    const currentIndex = steps.indexOf(order.order_status);
    const cancel = () => {
        if (window.confirm(`Cancel order ${order.order_number}?`)) {
            router.patch(`/account/orders/${order.id}/cancel`, {}, { preserveScroll: true });
        }
    };

    return (
        <CustomerLayout>
            <Head title={order.order_number} />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <Link href="/account/orders" className="text-sm font-black text-fuchsia-700">Back to my orders</Link>
                    <h1 className="mt-2 text-3xl font-black text-slate-950">{order.order_number}</h1>
                    <p className="mt-1 text-sm font-semibold text-slate-400">Placed {new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                    <StatusBadge status={order.order_status} />
                    {order.order_status === 'pending' && <button type="button" onClick={cancel} className="rounded-full bg-rose-100 px-4 py-2 text-sm font-black text-rose-700">Cancel order</button>}
                </div>
            </div>

            <section className="rounded-lg border bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black text-slate-950">Delivery progress</h2>
                <div className="mt-6 grid gap-3 md:grid-cols-5">
                    {steps.map((step, index) => {
                        const active = currentIndex >= index || ['cancelled', 'returned'].includes(order.order_status);
                        return (
                            <div key={step} className={`rounded-lg border p-4 ${active ? 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
                                <p className="text-xs font-black uppercase">{step.replace('_', ' ')}</p>
                                <p className="mt-1 text-sm font-semibold">{active ? 'Updated' : 'Waiting'}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-lg border bg-white p-5 shadow-sm">
                    <h2 className="text-xl font-black text-slate-950">Items</h2>
                    <div className="mt-5 divide-y">
                        {order.items?.map((item: any) => (
                            <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                                <div>
                                    <p className="font-black text-slate-950">{item.product_name}</p>
                                    <p className="text-sm font-semibold text-slate-400">SKU {item.product_sku} x {item.quantity}</p>
                                </div>
                                <strong>{money(item.total_price)}</strong>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg border bg-white p-5 shadow-sm">
                    <h2 className="text-xl font-black text-slate-950">Summary</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between"><span>Subtotal</span><strong>{money(order.subtotal)}</strong></div>
                        <div className="flex justify-between"><span>Discount</span><strong>{money(order.discount_amount)}</strong></div>
                        <div className="flex justify-between"><span>Shipping</span><strong>{money(order.shipping_amount)}</strong></div>
                        <div className="flex justify-between border-t pt-3 text-lg"><span className="font-black">Total</span><strong>{money(order.total_amount)}</strong></div>
                    </div>
                </div>
            </section>

            <section className="mt-6 rounded-lg border bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black text-slate-950">Timeline</h2>
                <div className="mt-5 grid gap-3">
                    {order.histories?.map((history: any) => (
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
                    ))}
                </div>
            </section>
        </CustomerLayout>
    );
}
