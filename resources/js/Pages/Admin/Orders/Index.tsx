import { Link, router } from '@inertiajs/react';
import { AdminLayout, DataTable, Pagination, StatusBadge } from '@/Components/Commerce';

const money = (value: any) => `$${Number(value ?? 0).toFixed(2)}`;
const statuses = ['pending', 'confirmed', 'packing', 'in_courier', 'delivered', 'returned', 'cancelled'];

export default function Index({ items, filters = {} }: any) {
    const orders = items?.data ?? [];

    const filterStatus = (status?: string) => {
        router.get('/admin/orders', { ...filters, status }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout>
            <section className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-xl">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.32),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.26),transparent_36%)] p-6 sm:p-8">
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-200">Advanced order management</p>
                    <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
                        <div>
                            <h1 className="text-3xl font-black sm:text-5xl">Orders pipeline</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">Track orders from pending confirmation to packing, courier dispatch, delivery, returns, and cancellation.</p>
                        </div>
                        <Link href="/admin/reports" className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg">View reports</Link>
                    </div>
                </div>
            </section>

            <section className="mt-6 grid gap-3 md:grid-cols-4 xl:grid-cols-8">
                <button type="button" onClick={() => filterStatus(undefined)} className={`rounded-lg border p-4 text-left shadow-sm ${!filters.status ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700'}`}>
                    <p className="text-xs font-black uppercase">All</p>
                    <p className="mt-1 text-2xl font-black">{items?.total ?? orders.length}</p>
                </button>
                {statuses.map((status) => (
                    <button key={status} type="button" onClick={() => filterStatus(status)} className={`rounded-lg border p-4 text-left shadow-sm ${filters.status === status ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-700'}`}>
                        <p className="text-xs font-black uppercase">{status.replace('_', ' ')}</p>
                        <p className="mt-1 text-sm font-semibold opacity-70">Filter</p>
                    </button>
                ))}
            </section>

            <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <form onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget as HTMLFormElement; const search = new FormData(form).get('search'); router.get('/admin/orders', { status: filters.status, search }, { preserveState: true, replace: true }); }} className="flex flex-col gap-3 sm:flex-row">
                    <input name="search" defaultValue={filters.search ?? ''} className="min-w-0 flex-1 rounded-md border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-fuchsia-500 focus:ring-fuchsia-500" placeholder="Search order number, customer, or phone" />
                    <button className="rounded-md bg-slate-950 px-5 py-3 text-sm font-black text-white">Search orders</button>
                </form>
            </section>

            <div className="mt-6">
                <DataTable
                    rows={orders}
                    columns={[
                        { key: 'order_number', label: 'Order', render: (row: any) => <Link href={`/admin/orders/${row.id}`} className="font-black text-slate-950 hover:text-fuchsia-600">{row.order_number}</Link> },
                        { key: 'customer_name', label: 'Customer', render: (row: any) => <div><p className="font-bold">{row.customer_name}</p><p className="text-xs text-slate-400">{row.customer_phone}</p></div> },
                        { key: 'order_status', label: 'Status', render: (row: any) => <StatusBadge status={row.order_status} /> },
                        { key: 'payment_status', label: 'Payment', render: (row: any) => <StatusBadge status={row.payment_status} /> },
                        { key: 'total_amount', label: 'Total', render: (row: any) => <span className="font-black text-slate-950">{money(row.total_amount)}</span> },
                        { key: 'created_at', label: 'Placed', render: (row: any) => new Date(row.created_at).toLocaleDateString() },
                        { key: 'actions', label: 'Actions', render: (row: any) => <Link href={`/admin/orders/${row.id}`} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">Manage</Link> },
                    ]}
                />
                <Pagination links={items?.links ?? []} />
            </div>
        </AdminLayout>
    );
}
