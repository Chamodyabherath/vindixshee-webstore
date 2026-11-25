import { Link, router } from '@inertiajs/react';
import { AdminLayout, DataTable, Pagination, StatusBadge } from '@/Components/Commerce';

const money = (value: any) => `$${Number(value ?? 0).toFixed(2)}`;

export default function Index({ items }: any) {
    const products = items?.data ?? [];
    const activeCount = products.filter((product: any) => product.status === 'active').length;
    const lowStockCount = products.filter((product: any) => Number(product.stock_quantity) <= Number(product.low_stock_alert_qty ?? 5)).length;
    const offerCount = products.filter((product: any) => Number(product.compare_price ?? 0) > Number(product.price ?? 0)).length;

    const updateStatus = (product: any) => {
        const status = product.status === 'active' ? 'inactive' : 'active';
        router.patch(`/admin/products/${product.id}/status`, { status }, { preserveScroll: true });
    };

    const updateStock = (product: any) => {
        const stock = window.prompt(`New stock quantity for ${product.name}`, product.stock_quantity ?? 0);
        if (stock === null) return;
        router.patch(`/admin/products/${product.id}/stock`, { stock_quantity: stock }, { preserveScroll: true });
    };

    const updateOffer = (product: any) => {
        const comparePrice = window.prompt(`Compare price for ${product.name}. Keep it higher than sale price ${money(product.price)}. Use empty value to remove offer.`, product.compare_price ?? '');
        if (comparePrice === null) return;
        router.patch(`/admin/products/${product.id}/offer`, { compare_price: comparePrice === '' ? null : comparePrice }, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <div className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-xl">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.32),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.24),transparent_36%)] p-6 sm:p-8">
                    <div className="flex flex-wrap items-end justify-between gap-5">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-200">Catalog manager</p>
                            <h1 className="mt-3 text-3xl font-black sm:text-5xl">Products</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">Edit product details, control visibility, update stock, and launch seasonal offers directly from the listing.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg" href="/admin/products/create">Create product</Link>
                            <Link className="rounded-full border border-white/20 px-5 py-3 text-sm font-black text-white hover:bg-white/10" href="/admin/inventory">Inventory log</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-black text-slate-500">Active products</p><p className="mt-2 text-3xl font-black text-emerald-600">{activeCount}</p></div>
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-black text-slate-500">Low stock shown</p><p className="mt-2 text-3xl font-black text-rose-600">{lowStockCount}</p></div>
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-black text-slate-500">Offers shown</p><p className="mt-2 text-3xl font-black text-fuchsia-600">{offerCount}</p></div>
            </div>

            <div className="mt-6">
                <DataTable
                    rows={products}
                    columns={[
                        {
                            key: 'product',
                            label: 'Product',
                            render: (row: any) => (
                                <div>
                                    <Link href={`/admin/products/${row.id}/edit`} className="font-black text-slate-950 hover:text-fuchsia-600">{row.name}</Link>
                                    <p className="text-xs font-semibold text-slate-400">{row.sku}</p>
                                </div>
                            ),
                        },
                        { key: 'category', label: 'Category', render: (row: any) => row.category?.name ?? '-' },
                        { key: 'brand', label: 'Brand', render: (row: any) => row.brand?.name ?? '-' },
                        {
                            key: 'price',
                            label: 'Price',
                            render: (row: any) => (
                                <div>
                                    <p className="font-black text-slate-950">{money(row.price)}</p>
                                    {Number(row.compare_price ?? 0) > Number(row.price ?? 0) && <p className="text-xs font-bold text-rose-500 line-through">{money(row.compare_price)}</p>}
                                </div>
                            ),
                        },
                        {
                            key: 'stock',
                            label: 'Stock',
                            render: (row: any) => (
                                <button type="button" onClick={() => updateStock(row)} className={`rounded-full px-3 py-1 text-xs font-black ${Number(row.stock_quantity) <= Number(row.low_stock_alert_qty ?? 5) ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {row.stock_quantity} in stock
                                </button>
                            ),
                        },
                        { key: 'status', label: 'Status', render: (row: any) => <StatusBadge status={row.status} /> },
                        {
                            key: 'actions',
                            label: 'Actions',
                            render: (row: any) => (
                                <div className="flex min-w-[360px] flex-wrap gap-2">
                                    <Link href={`/admin/products/${row.id}/edit`} className="rounded-full bg-slate-950 px-3 py-2 text-xs font-black text-white">Edit</Link>
                                    <button type="button" onClick={() => updateStatus(row)} className="rounded-full bg-amber-100 px-3 py-2 text-xs font-black text-amber-700">{row.status === 'active' ? 'Inactive' : 'Activate'}</button>
                                    <button type="button" onClick={() => updateStock(row)} className="rounded-full bg-sky-100 px-3 py-2 text-xs font-black text-sky-700">Stock update</button>
                                    <button type="button" onClick={() => updateOffer(row)} className="rounded-full bg-fuchsia-100 px-3 py-2 text-xs font-black text-fuchsia-700">Add offer</button>
                                    <button type="button" onClick={() => window.confirm('Delete this product?') && router.delete(`/admin/products/${row.id}`, { preserveScroll: true })} className="rounded-full bg-rose-100 px-3 py-2 text-xs font-black text-rose-700">Delete</button>
                                </div>
                            ),
                        },
                    ]}
                />
                <Pagination links={items?.links ?? []} />
            </div>
        </AdminLayout>
    );
}
