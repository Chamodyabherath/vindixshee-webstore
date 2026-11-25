import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    const deleteUser: FormEventHandler = (event) => {
        event.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    return (
        <section className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
                <p className="text-sm font-bold uppercase tracking-widest text-red-600">Danger zone</p>
                <h2 className="mt-1 text-2xl font-black text-neutral-950">Delete account</h2>
                <p className="mt-2 max-w-2xl text-sm text-neutral-600">
                    This will remove your account access and soft-delete your customer profile. Orders remain preserved for store records.
                </p>
            </div>

            <button
                type="button"
                onClick={() => setConfirmingUserDeletion(true)}
                className="rounded-md bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-red-700"
            >
                Delete account
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-2xl font-black text-neutral-950">Confirm account deletion</h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        Enter your password to confirm. This action signs you out and deactivates your customer account.
                    </p>

                    <div className="mt-6">
                        <input
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                            className="block w-full rounded-md border-neutral-200 bg-neutral-50 px-4 py-3 shadow-sm focus:border-red-500 focus:ring-red-500"
                            placeholder="Password"
                            autoFocus
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="rounded-md border px-4 py-2 text-sm font-bold text-neutral-700">
                            Cancel
                        </button>
                        <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-60" disabled={processing}>
                            Delete account
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
