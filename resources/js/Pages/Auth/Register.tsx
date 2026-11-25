import InputError from '@/Components/InputError';
import { PageProps } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

type RegisterSettings = {
    store_name?: string;
    login_background_image?: string;
};

const shopImages = [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=90',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=90',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=90',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=90',
];

export default function Register() {
    const { storeSettings = {} } = usePage<PageProps<{ storeSettings: RegisterSettings }>>().props;
    const backgroundImage = storeSettings.login_background_image || shopImages[0];

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Create account" />

            <main className="min-h-screen overflow-hidden bg-[#f6f2ec] text-[#17120c]">
                <div className="grid min-h-screen lg:grid-cols-[0.96fr_1.04fr]">
                    <section className="relative flex items-center px-5 py-10 sm:px-8 lg:px-14">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,189,97,0.42),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,154,194,0.28),transparent_32%)]" />
                        <div className="relative mx-auto w-full max-w-xl">
                            <div className="mb-8">
                                <Link href="/" className="inline-flex items-center gap-3 rounded-full bg-[#17120c] px-4 py-2 text-sm font-black text-white">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2bd61] text-xs text-[#17120c]">VX</span>
                                    {storeSettings.store_name || 'VINDIXSHEE'}
                                </Link>
                            </div>

                            <div className="rounded-[2rem] border border-[#eadfce] bg-white/95 p-6 shadow-[0_30px_80px_rgba(53,39,22,0.16)] backdrop-blur sm:p-8">
                                <div className="mb-7">
                                    <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b77918]">Join the store</p>
                                    <h1 className="mt-3 font-serif text-4xl font-black leading-tight text-[#17120c] sm:text-5xl">Create your shopping profile</h1>
                                    <p className="mt-3 text-sm font-semibold leading-6 text-[#8a7a66]">Save your details, track orders, collect seasonal offers, and shop faster next time.</p>
                                </div>

                                <form onSubmit={submit} className="space-y-5">
                                    <div>
                                        <label htmlFor="name" className="text-sm font-black text-[#5f4d39]">Full name</label>
                                        <input
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="mt-2 block w-full rounded-2xl border-[#eadfce] bg-[#fffaf3] px-4 py-3.5 text-[#17120c] shadow-sm focus:border-[#b77918] focus:ring-[#b77918]"
                                            autoComplete="name"
                                            autoFocus
                                            onChange={(event) => setData('name', event.target.value)}
                                            placeholder="Your name"
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="text-sm font-black text-[#5f4d39]">Email address</label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="mt-2 block w-full rounded-2xl border-[#eadfce] bg-[#fffaf3] px-4 py-3.5 text-[#17120c] shadow-sm focus:border-[#b77918] focus:ring-[#b77918]"
                                            autoComplete="username"
                                            onChange={(event) => setData('email', event.target.value)}
                                            placeholder="you@example.com"
                                            required
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="password" className="text-sm font-black text-[#5f4d39]">Password</label>
                                            <input
                                                id="password"
                                                type="password"
                                                name="password"
                                                value={data.password}
                                                className="mt-2 block w-full rounded-2xl border-[#eadfce] bg-[#fffaf3] px-4 py-3.5 text-[#17120c] shadow-sm focus:border-[#b77918] focus:ring-[#b77918]"
                                                autoComplete="new-password"
                                                onChange={(event) => setData('password', event.target.value)}
                                                placeholder="Minimum 8 characters"
                                                required
                                            />
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>

                                        <div>
                                            <label htmlFor="password_confirmation" className="text-sm font-black text-[#5f4d39]">Confirm</label>
                                            <input
                                                id="password_confirmation"
                                                type="password"
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="mt-2 block w-full rounded-2xl border-[#eadfce] bg-[#fffaf3] px-4 py-3.5 text-[#17120c] shadow-sm focus:border-[#b77918] focus:ring-[#b77918]"
                                                autoComplete="new-password"
                                                onChange={(event) => setData('password_confirmation', event.target.value)}
                                                placeholder="Repeat password"
                                                required
                                            />
                                            <InputError message={errors.password_confirmation} className="mt-2" />
                                        </div>
                                    </div>

                                    <button
                                        className="w-full rounded-2xl bg-[#17120c] px-5 py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#b77918] hover:shadow-xl disabled:opacity-60"
                                        disabled={processing}
                                    >
                                        Create account
                                    </button>

                                    <p className="rounded-2xl bg-[#fff4df] p-4 text-center text-sm font-semibold text-[#6f5d47]">
                                        Already registered?{' '}
                                        <Link href={route('login')} className="font-black text-[#b77918] underline-offset-4 hover:underline">
                                            Log in here
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </section>

                    <section className="relative hidden overflow-hidden bg-[#17120c] p-10 text-white lg:block">
                        <img src={backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-bl from-[#17120c] via-[#3a2505]/70 to-[#b77918]/35" />
                        <div className="absolute -right-16 top-16 h-80 w-80 rounded-full bg-[#f2bd61]/30 blur-3xl" />
                        <div className="absolute -left-24 bottom-10 h-96 w-96 rounded-full bg-[#ff9ac2]/25 blur-3xl" />

                        <div className="relative flex min-h-full flex-col justify-between">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-5 pt-12">
                                    <img src={shopImages[1]} alt="" className="aspect-[4/5] rounded-[2rem] object-cover shadow-2xl" />
                                    <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
                                        <p className="text-4xl font-black text-[#f2bd61]">25%</p>
                                        <p className="text-sm font-bold text-white/70">seasonal offer access</p>
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    <img src={shopImages[2]} alt="" className="aspect-[4/5] rounded-[2rem] object-cover shadow-2xl" />
                                    <img src={shopImages[3]} alt="" className="aspect-[4/5] rounded-[2rem] object-cover shadow-2xl" />
                                </div>
                            </div>

                            <div className="max-w-2xl pb-4">
                                <p className="text-sm font-black uppercase tracking-[0.35em] text-[#f8d99d]">Colorful shopping starts here</p>
                                <h2 className="mt-5 font-serif text-6xl font-black leading-[0.92]">Your next favorite outfit is waiting.</h2>
                                <div className="mt-7 grid grid-cols-3 gap-3">
                                    {['Order tracking', 'Fast checkout', 'Season offers'].map((item) => (
                                        <div key={item} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm font-black backdrop-blur">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
