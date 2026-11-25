import { Link, router } from '@inertiajs/react';
import { AdminLayout, DataTable, Pagination, StatusBadge } from '@/Components/Commerce';

export default function Index({ items }: any) {
    const categories = items?.data ?? [];
    const activeCount = categories.filter((category: any) => category.status === 'active').length;
    const inactiveCount = categories.filter((category: any) => category.status === 'inactive').length;
    const childCount = categories.filter((category: any) => category.parent_id).length;

    const updateStatus = (category: any) => {
        const status = category.status === 'active' ? 'inactive' : 'active';
        router.patch(`/admin/categories/${category.id}/status`, { status }, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <div className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-xl">
                <div className="bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.32),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.24),transparent_36%)] p-6 sm:p-8">
                    <div className="flex flex-wrap items-end justify-between gap-5">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-200">Catalog structure</p>
                            <h1 className="mt-3 text-3xl font-black sm:text-5xl">Categories</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">Organize product groups, parent categories, sort order, and storefront visibility from one clean table.</p>
                        </div>
                        <Link className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-lg" href="/admin/categories/create">Create category</Link>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-black text-slate-500">Active categories</p><p className="mt-2 text-3xl font-black text-emerald-600">{activeCount}</p></div>
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-black text-slate-500">Inactive categories</p><p className="mt-2 text-3xl font-black text-rose-600">{inactiveCount}</p></div>
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-black text-slate-500">Sub categories</p><p className="mt-2 text-3xl font-black text-sky-600">{childCount}</p></div>
            </div>

            <div className="mt-6">
                <DataTable
                    rows={categories}
                    columns={[
                        {
                            key: 'name',
                            label: 'Category',
                            render: (row: any) => (
                                <div>
                                    <Link href={`/admin/categories/${row.id}/edit`} className="font-black text-slate-950 hover:text-fuchsia-600">{row.name}</Link>
                                    <p className="text-xs font-semibold text-slate-400">{row.slug}</p>
                                </div>
                            ),
                        },
                        { key: 'parent', label: 'Parent', render: (row: any) => row.parent?.name ?? 'Main category' },
                        { key: 'sort_order', label: 'Sort', render: (row: any) => row.sort_order ?? 0 },
                        { key: 'status', label: 'Status', render: (row: any) => <StatusBadge status={row.status} /> },
                        {
                            key: 'actions',
                            label: 'Actions',
                            render: (row: any) => (
                                <div className="flex min-w-[250px] flex-wrap gap-2">
                                    <Link href={`/admin/categories/${row.id}/edit`} className="rounded-full bg-slate-950 px-3 py-2 text-xs font-black text-white">Edit</Link>
                                    <button type="button" onClick={() => updateStatus(row)} className="rounded-full bg-amber-100 px-3 py-2 text-xs font-black text-amber-700">{row.status === 'active' ? 'Inactive' : 'Activate'}</button>
                                    <button type="button" onClick={() => window.confirm('Delete this category?') && router.delete(`/admin/categories/${row.id}`, { preserveScroll: true })} className="rounded-full bg-rose-100 px-3 py-2 text-xs font-black text-rose-700">Delete</button>
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
