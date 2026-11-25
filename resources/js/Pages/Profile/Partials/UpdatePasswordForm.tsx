import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (event) => {
        event.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section>
            <header>
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Security</p>
                <h2 className="mt-1 text-2xl font-black text-neutral-950">Update password</h2>
                <p className="mt-2 text-sm text-neutral-500">Use a strong password to keep orders, addresses, and account access protected.</p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 grid gap-5">
                <label className="grid gap-2 text-sm font-bold text-neutral-700">
                    Current password
                    <input
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(event) => setData('current_password', event.target.value)}
                        type="password"
                        className="rounded-md border-neutral-200 bg-neutral-50 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} />
                </label>

                <label className="grid gap-2 text-sm font-bold text-neutral-700">
                    New password
                    <input
                        ref={passwordInput}
                        value={data.password}
                        onChange={(event) => setData('password', event.target.value)}
                        type="password"
                        className="rounded-md border-neutral-200 bg-neutral-50 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} />
                </label>

                <label className="grid gap-2 text-sm font-bold text-neutral-700">
                    Confirm password
                    <input
                        value={data.password_confirmation}
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                        type="password"
                        className="rounded-md border-neutral-200 bg-neutral-50 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} />
                </label>

                <div className="flex items-center gap-4">
                    <button className="rounded-md bg-gradient-to-r from-indigo-600 to-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60" disabled={processing}>
                        Save password
                    </button>

                    <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                        <p className="text-sm font-semibold text-emerald-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
