import { useForm } from '@inertiajs/react';
import { AdminLayout, AnimatedButton } from '@/Components/Commerce';

const loginKeys = [
    'login_background_image',
    'login_eyebrow',
    'login_headline',
    'login_subtitle',
    'login_panel_note',
];

export default function Index({ items = [] }: any) {
    const initial = Object.fromEntries(items.map((item: any) => [item.key, item.value ?? '']));

    for (const key of loginKeys) {
        initial[key] ??= '';
    }

    const { data, setData, patch, processing } = useForm<any>({ settings: initial });

    const update = (key: string, value: string) => {
        setData('settings', { ...data.settings, [key]: value });
    };

    return (
        <AdminLayout>
            <h1 className="mb-6 text-3xl font-bold">Settings</h1>
            <form onSubmit={(event) => { event.preventDefault(); patch('/admin/settings'); }} className="grid gap-6 xl:grid-cols-[1fr_420px]">
                <section className="rounded-lg border bg-white p-6">
                    <h2 className="text-xl font-bold">Login Screen</h2>
                    <p className="mt-1 text-sm text-neutral-500">Control the customer/admin login background and copy.</p>

                    <div className="mt-6 grid gap-4">
                        <label className="grid gap-1 text-sm font-medium">
                            Background image URL
                            <input className="rounded border p-2" value={data.settings.login_background_image ?? ''} onChange={(event) => update('login_background_image', event.target.value)} placeholder="https://..." />
                        </label>
                        <label className="grid gap-1 text-sm font-medium">
                            Eyebrow text
                            <input className="rounded border p-2" value={data.settings.login_eyebrow ?? ''} onChange={(event) => update('login_eyebrow', event.target.value)} />
                        </label>
                        <label className="grid gap-1 text-sm font-medium">
                            Headline
                            <input className="rounded border p-2" value={data.settings.login_headline ?? ''} onChange={(event) => update('login_headline', event.target.value)} />
                        </label>
                        <label className="grid gap-1 text-sm font-medium">
                            Subtitle
                            <textarea className="min-h-24 rounded border p-2" value={data.settings.login_subtitle ?? ''} onChange={(event) => update('login_subtitle', event.target.value)} />
                        </label>
                        <label className="grid gap-1 text-sm font-medium">
                            Panel note
                            <input className="rounded border p-2" value={data.settings.login_panel_note ?? ''} onChange={(event) => update('login_panel_note', event.target.value)} />
                        </label>
                    </div>
                </section>

                <aside className="rounded-lg border bg-white p-4">
                    <p className="mb-3 text-sm font-bold uppercase tracking-widest text-neutral-500">Preview</p>
                    <div className="overflow-hidden rounded-lg bg-neutral-950 text-white">
                        <img src={data.settings.login_background_image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85'} className="h-44 w-full object-cover opacity-75" />
                        <div className="p-5">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/60">{data.settings.login_eyebrow || 'Staff and customer portal'}</p>
                            <h3 className="mt-3 text-2xl font-black">{data.settings.login_headline || 'Welcome back to VINDIXSHEE'}</h3>
                            <p className="mt-2 text-sm text-white/70">{data.settings.login_subtitle || 'Manage orders, discover products, and keep your store moving from one polished dashboard.'}</p>
                        </div>
                    </div>
                </aside>

                <section className="rounded-lg border bg-white p-6 xl:col-span-2">
                    <h2 className="text-xl font-bold">General Settings</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {items.filter((item: any) => !loginKeys.includes(item.key)).map((item: any) => (
                            <label key={item.key} className="grid gap-1 text-sm font-medium">
                                {item.key}
                                <input className="rounded border p-2" value={data.settings[item.key] ?? ''} onChange={(event) => update(item.key, event.target.value)} />
                            </label>
                        ))}
                    </div>
                </section>

                <div className="xl:col-span-2">
                    <AnimatedButton disabled={processing}>Save settings</AnimatedButton>
                </div>
            </form>
        </AdminLayout>
    );
}
