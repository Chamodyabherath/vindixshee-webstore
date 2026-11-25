import { Link, router } from '@inertiajs/react';
import { EmptyState, PublicLayout } from '@/Components/Commerce';

export default function Cart({ cart }: any) {
    const items = cart?.items ?? [];
    const subtotal = items.reduce((sum: number, item: any) => sum + Number(item.unit_price) * item.quantity, 0);

    return (
        <PublicLayout>
            <h1 className="mb-6 text-3xl font-bold">Cart</h1>
            {items.length ? <div className="grid gap-6 md:grid-cols-[1fr_320px]"><div className="space-y-3">{items.map((item: any) => <div className="flex items-center justify-between rounded-lg border bg-white p-4" key={item.id}><div><strong>{item.product?.name}</strong><p className="text-sm text-neutral-500">${item.unit_price} x {item.quantity}</p></div><button className="text-sm text-red-600" onClick={() => router.delete(`/cart/items/${item.id}`)}>Remove</button></div>)}</div><aside className="rounded-lg border bg-white p-5"><div className="flex justify-between"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><Link href="/checkout" className="mt-4 block rounded bg-neutral-950 px-4 py-2 text-center text-white">Checkout</Link></aside></div> : <EmptyState title="Your cart is empty" />}
        </PublicLayout>
    );
}
