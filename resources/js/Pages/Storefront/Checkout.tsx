import { useForm } from '@inertiajs/react';
import { AnimatedButton, PublicLayout } from '@/Components/Commerce';

export default function Checkout({ shippingMethods = [] }: any) {
    const { data, setData, post, processing, errors } = useForm<any>({ customer_name: '', customer_email: '', customer_phone: '', billing_address: { address_line_1: '', city: '', country: 'Sri Lanka' }, shipping_address: { address_line_1: '', city: '', country: 'Sri Lanka' }, payment_method: 'cod', shipping_method_id: shippingMethods[0]?.id });

    return (
        <PublicLayout>
            <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
            <form onSubmit={(event) => { event.preventDefault(); post('/checkout'); }} className="grid max-w-xl gap-4">
                <input className="rounded border p-2" placeholder="Name" value={data.customer_name} onChange={(event) => setData('customer_name', event.target.value)} />
                <input className="rounded border p-2" placeholder="Phone" value={data.customer_phone} onChange={(event) => setData('customer_phone', event.target.value)} />
                <input className="rounded border p-2" placeholder="Email" value={data.customer_email} onChange={(event) => setData('customer_email', event.target.value)} />
                <select className="rounded border p-2" value={data.payment_method} onChange={(event) => setData('payment_method', event.target.value)}><option value="cod">Cash on delivery</option><option value="card">Card</option><option value="bank_transfer">Bank transfer</option></select>
                {Object.values(errors).map((error: any, index) => <p key={index} className="text-sm text-red-600">{error}</p>)}
                <AnimatedButton disabled={processing}>Place order</AnimatedButton>
            </form>
        </PublicLayout>
    );
}
