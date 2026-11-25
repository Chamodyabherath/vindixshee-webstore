import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { PageProps } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type LoginSettings = {
    store_name?: string;
    login_background_image?: string;
    login_eyebrow?: string;
    login_headline?: string;
    login_subtitle?: string;
    login_panel_note?: string;
};

const shopImages = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=90',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=90',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=90',
];

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { storeSettings = {} } = usePage<PageProps<{ storeSettings: LoginSettings }>>().props;
    const backgroundImage = storeSettings.login_background_image || shopImages[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <main className="min-h-screen overflow-hidden bg-[#f6f2ec] text-[#17120c]">
                <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
                    <section className="relative hidden overflow-hidden bg-[#17120c] p-10 text-white lg:block">
                        <img src={backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75" />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#17120c] via-[#17120c]/70 to-[#b77918]/25" />
                        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#f2bd61]/30 blur-3xl" />
                        <div className="absolute -right-20 bottom-16 h-80 w-80 rounded-full bg-[#ff9ac2]/25 blur-3xl" />

                        <div className="relative flex min-h-full flex-col justify-between">
                            <Link href="/" className="inline-flex w-fit items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black backdrop-blur">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2bd61] text-xs text-[#17120c]">VX</span>
                                {storeSettings.store_name || 'VINDIXSHEE'}
                            </Link>

                            <div className="max-w-2xl">
                                <p className="text-sm font-black uppercase tracking-[0.35em] text-[#f8d99d]">
                                    {storeSettings.login_eyebrow || 'Shopping portal'}
                                </p>
                                <h1 className="mt-5 font-serif text-6xl font-black leading-[0.92] xl:text-7xl">
                                    {storeSettings.login_headline || 'Welcome back, style hunter.'}
                                </h1>
                                <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-white/75">
                                    {storeSettings.login_subtitle || 'Track orders, manage your account, discover colorful offers, and continue shopping from your dashboard.'}
                                </p>
                            </div>

                            <div className="grid max-w-3xl grid-cols-3 gap-4">
                                {shopImages.map((image, index) => (
                                    <div key={image} className={`overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur ${index === 1 ? '-translate-y-8' : ''}`}>
                                        <img src={image} alt="" className="aspect-[4/5] w-full rounded-xl object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="relative flex min-h-screen items-center px-5 py-10 sm:px-8 lg:px-14">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(242,189,97,0.45),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,154,194,0.28),transparent_30%)]" />
                        <div className="relative mx-auto w-full max-w-lg">
                            <div className="mb-8 lg:hidden">
                                <Link href="/" className="inline-flex items-center gap-3 rounded-full bg-[#17120c] px-4 py-2 text-sm font-black text-white">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2bd61] text-xs text-[#17120c]">VX</span>
                                    {storeSettings.store_name || 'VINDIXSHEE'}
                                </Link>
                            </div>

                            <div className="rounded-[2rem] border border-[#eadfce] bg-white/95 p-6 shadow-[0_30px_80px_rgba(53,39,22,0.16)] backdrop-blur sm:p-8">
                                <div className="mb-7">
                                    <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b77918]">Sign in</p>
                                    <h2 className="mt-3 font-serif text-4xl font-black text-[#17120c]">Open your closet</h2>
                                    <p className="mt-2 text-sm font-semibold leading-6 text-[#8a7a66]">{storeSettings.login_panel_note || 'Demo admin: admin@example.com / password'}</p>
                                </div>

                                {status && <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{status}</div>}

                                <form onSubmit={submit} className="space-y-5">
                                    <div>
                                        <label htmlFor="email" className="text-sm font-black text-[#5f4d39]">Email address</label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-2 block w-full rounded-2xl border-[#eadfce] bg-[#fffaf3] px-4 py-3.5 text-[#17120c] shadow-sm focus:border-[#b77918] focus:ring-[#b77918]"
                                            autoComplete="username"
                                            autoFocus
                                            onChange={(event) => setData('email', event.target.value)}
                                            placeholder="admin@example.com"
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="text-sm font-black text-[#5f4d39]">Password</label>
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="mt-2 block w-full rounded-2xl border-[#eadfce] bg-[#fffaf3] px-4 py-3.5 text-[#17120c] shadow-sm focus:border-[#b77918] focus:ring-[#b77918]"
                                            autoComplete="current-password"
                                            onChange={(event) => setData('password', event.target.value)}
                                            placeholder="password"
                                        />
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <label className="flex items-center">
                                            <Checkbox
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(event) => setData('remember', event.target.checked)}
                                            />
                                            <span className="ms-2 text-sm font-semibold text-[#6f5d47]">Remember me</span>
                                        </label>

                                        {canResetPassword && (
                                            <Link href={route('password.request')} className="text-sm font-black text-[#b77918] underline-offset-4 hover:underline">
                                                Forgot?
                                            </Link>
                                        )}
                                    </div>

                                    <button
                                        className="w-full rounded-2xl bg-[#17120c] px-5 py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#b77918] hover:shadow-xl disabled:opacity-60"
                                        disabled={processing}
                                    >
                                        Log in and shop
                                    </button>

                                    <p className="rounded-2xl bg-[#fff4df] p-4 text-center text-sm font-semibold text-[#6f5d47]">
                                        New here?{' '}
                                        <Link href={route('register')} className="font-black text-[#b77918] underline-offset-4 hover:underline">
                                            Create your account
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
