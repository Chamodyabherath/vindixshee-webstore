import { Head, Link } from '@inertiajs/react';
import { Pagination, ProductFilters, ProductGrid, PublicLayout } from '@/Components/Commerce';

export default function Show({ category, products, filters }: any) {
    return (
        <PublicLayout>
            <Head title={category.name} />
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="mb-6 text-neutral-500">{category.description}</p>
            <div className="mb-6 flex flex-wrap gap-2">{category.children?.map((child: any) => <Link key={child.id} href={`/categories/${child.slug}`} className="rounded-full border px-3 py-1 text-sm">{child.name}</Link>)}</div>
            <div className="grid gap-6 md:grid-cols-[260px_1fr]"><ProductFilters filters={filters} /><div><ProductGrid products={products} /><Pagination links={products?.links} /></div></div>
        </PublicLayout>
    );
}
