import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section>
            <header className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-fuchsia-600">Identity</p>
                    <h2 className="mt-1 text-2xl font-black text-neutral-950">Profile information</h2>
                    <p className="mt-2 text-sm text-neutral-500">Update your name and email address used across orders and reviews.</p>
                </div>
                <div className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-bold text-fuchsia-700">Customer</div>
            </header>

            <form onSubmit={submit} className="mt-6 grid gap-5">
                <label className="grid gap-2 text-sm font-bold text-neutral-700">
                    Full name
                    <input
                        className="rounded-md border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-950 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError message={errors.name} />
                </label>

                <label className="grid gap-2 text-sm font-bold text-neutral-700">
                    Email address
                    <input
                        type="email"
                        className="rounded-md border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-950 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError message={errors.email} />
                </label>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
                        Your email address is unverified.
                        <Link href={route('verification.send')} method="post" as="button" className="ms-1 font-bold underline">
                            Resend verification email.
                        </Link>
                        {status === 'verification-link-sent' && (
                            <p className="mt-2 font-bold text-emerald-700">A new verification link has been sent.</p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button className="rounded-md bg-gradient-to-r from-fuchsia-600 to-rose-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60" disabled={processing}>
                        Save profile
                    </button>

                    <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                        <p className="text-sm font-semibold text-emerald-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
