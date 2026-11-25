import { Link } from '@inertiajs/react';
import { PublicLayout } from '@/Components/Commerce';

export default function ThankYou({ order }: any) {
    return <PublicLayout><div className="rounded-lg border bg-white p-8"><h1 className="text-3xl font-bold">Thank you</h1><p className="mt-3">Order number: <strong>{order.order_number}</strong></p><p>Total: ${order.total_amount}</p><Link href="/products" className="mt-6 inline-block rounded bg-neutral-950 px-4 py-2 text-white">Continue shopping</Link></div></PublicLayout>;
}
