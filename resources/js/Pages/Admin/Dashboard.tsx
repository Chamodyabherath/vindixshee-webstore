import { Link } from '@inertiajs/react';
import { AdminLayout, StatusBadge } from '@/Components/Commerce';

const money = (value: any) => `$${Number(value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Dashboard({ stats = {}, recentOrders = [], lowStock = [] }: any) {
    const statCards = [
        ['Revenue', money(stats.totalSales), 'from paid orders', 'from-[#17120c] to-[#b77918]'],
        ['Orders', stats.totalOrders ?? 0, `${stats.pendingOrders ?? 0} pending`, 'from-[#b77918] to-[#f2bd61]'],
        ['Packing', stats.packingOrders ?? 0, `${stats.inCourierOrders ?? 0} in courier`, 'from-[#6f4b1e] to-[#c99655]'],
        ['Delivered', stats.deliveredOrders ?? 0, `${stats.returnedOrders ?? 0} returned`, 'from-[#74634c] to-[#d8c2a2]'],
        ['Products', stats.totalProducts ?? 0, `${stats.lowStockProducts ?? 0} low stock`, 'from-[#f2bd61] to-[#f7dfad]'],
        ['Customers', stats.totalCustomers ?? 0, 'registered shoppers', 'from-[#8d5b22] to-[#d99b3d]'],
    ];

    return (
        <AdminLayout>
            <section className="overflow-hidden rounded-lg bg-[#17120c] text-white shadow-xl">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(242,189,97,0.30),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(183,121,24,0.28),transparent_36%)] p-6 sm:p-8">
                    <div className="flex flex-wrap items-end justify-between gap-5">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f8d99d]">Store overview</p>
                            <h2 className="mt-3 text-3xl font-black sm:text-5xl">Admin command center</h2>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">Manage products, seasonal offers, stock, orders, banners, and customer activity from one modern dashboard.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/admin/products/create" className="rounded-full bg-[#f2bd61] px-5 py-3 text-sm font-black text-[#17120c] shadow-lg">New product</Link>
                            <Link href="/admin/banners/create" className="rounded-full border border-[#f2bd61]/30 px-5 py-3 text-sm font-black text-white hover:bg-white/10">New banner</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                {statCards.map(([label, value, caption, gradient]: any) => (
                    <div key={label} className="overflow-hidden rounded-lg border border-[#eadfce] bg-white shadow-sm">
                        <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
                        <div className="p-5">
                            <p className="text-sm font-black text-[#8a7a66]">{label}</p>
                            <p className="mt-3 text-3xl font-black text-[#17120c]">{value}</p>
                            <p className="mt-1 text-xs font-semibold text-[#9a8e7e]">{caption}</p>
                        </div>
                    </div>
                ))}
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                <div className="rounded-lg border border-[#eadfce] bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-xl font-black text-[#17120c]">Recent orders</h3>
                            <p className="text-sm font-semibold text-[#9a8e7e]">Newest customer purchases and fulfillment status.</p>
                        </div>
                        <Link href="/admin/orders" className="rounded-full bg-[#17120c] px-4 py-2 text-sm font-black text-white">View all</Link>
                    </div>
                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-xs uppercase tracking-wide text-[#9a8e7e]">
                                <tr><th className="py-3">Order</th><th>Customer</th><th>Status</th><th className="text-right">Total</th></tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0e6d8]">
                                {recentOrders.length ? recentOrders.map((order: any) => (
                                    <tr key={order.id}>
                                        <td className="py-4 font-black text-[#17120c]"><Link href={`/admin/orders/${order.id}`}>{order.order_number}</Link></td>
                                        <td className="font-semibold text-[#8a7a66]">{order.customer_name}</td>
                                        <td><StatusBadge status={order.order_status} /></td>
                                        <td className="text-right font-black text-[#17120c]">{money(order.total_amount)}</td>
                                    </tr>
                                )) : (
                                    <tr><td className="py-8 text-center font-semibold text-slate-400" colSpan={4}>No orders yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid gap-6">
                    <div className="rounded-lg border border-[#eadfce] bg-white p-5 shadow-sm">
                        <h3 className="text-xl font-black text-[#17120c]">Low stock</h3>
                        <p className="text-sm font-semibold text-[#9a8e7e]">Products that need a restock soon.</p>
                        <div className="mt-5 grid gap-3">
                            {lowStock.length ? lowStock.map((product: any) => (
                                <Link href={`/admin/products/${product.id}/edit`} key={product.id} className="flex items-center justify-between rounded-lg border border-[#eadfce] p-3 hover:border-[#f2bd61] hover:bg-[#fffaf3]">
                                    <span>
                                        <span className="block font-black text-[#17120c]">{product.name}</span>
                                        <span className="text-xs font-semibold text-[#9a8e7e]">{product.sku}</span>
                                    </span>
                                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700">{product.stock_quantity} left</span>
                                </Link>
                            )) : <p className="rounded-lg bg-emerald-50 p-4 text-sm font-bold text-emerald-700">Stock levels look healthy.</p>}
                        </div>
                    </div>

                    <div className="rounded-lg bg-gradient-to-br from-[#17120c] to-[#b77918] p-5 text-white shadow-lg">
                        <p className="text-xs font-black uppercase tracking-wide text-white/65">Quick workflow</p>
                        <h3 className="mt-2 text-2xl font-black">Launch a season offer</h3>
                        <p className="mt-2 text-sm leading-6 text-white/70">Open Products, choose Add offer on a product, and set the compare price higher than the sale price.</p>
                        <Link href="/admin/products" className="mt-5 inline-flex rounded-full bg-[#f2bd61] px-5 py-2.5 text-sm font-black text-[#17120c]">Manage offers</Link>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
