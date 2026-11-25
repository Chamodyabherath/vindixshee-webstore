import { CustomerLayout } from '@/Components/Commerce';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const user = usePage().props.auth.user;

    return (
        <CustomerLayout>
            <Head title="Profile" />

            <section className="overflow-hidden rounded-lg bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-500 p-6 text-white shadow-xl md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">Profile center</p>
                        <h1 className="mt-3 text-4xl font-black">Personalize your account</h1>
                        <p className="mt-3 max-w-2xl text-white/75">
                            Keep your identity, password, and account preferences up to date from one polished customer space.
                        </p>
                    </div>
                    <div className="rounded-lg border border-white/20 bg-white/15 p-5 backdrop-blur">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl font-black text-fuchsia-700">
                                {user.name.slice(0, 1)}
                            </div>
                            <div>
                                <p className="font-black">{user.name}</p>
                                <p className="text-sm text-white/75">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <UpdatePasswordForm />
                </div>

                <div className="rounded-lg border border-red-100 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm xl:col-span-2">
                    <DeleteUserForm />
                </div>
            </div>
        </CustomerLayout>
    );
}
