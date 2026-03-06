import React from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;
    const [emailError, setEmailError] = React.useState('');
    const [emailTouched, setEmailTouched] = React.useState(false);
    const [nameError, setNameError] = React.useState('');
    const [nameTouched, setNameTouched] = React.useState(false);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    // Name validation - only alphabets and spaces allowed
    const validateName = (name) => {
        const nameRegex = /^[a-zA-Z\s]*$/;
        return nameRegex.test(name);
    };

    // Email format validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailRegex.test(email);
    };

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setData('name', newName);
        setNameTouched(true);
        
        // Show error if name contains digits or special characters
        if (newName && !validateName(newName)) {
            setNameError('Name should only contain alphabets and spaces!');
        } else {
            setNameError('');
        }
    };

    const handleNameBlur = () => {
        setNameTouched(true);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setData('email', newEmail);
        setEmailTouched(true);
        
        // Show error if email is different from existing email or if format is invalid
        if (newEmail !== user.email && !validateEmail(newEmail)) {
            setEmailError('Please enter correct email!');
        } else if (newEmail !== user.email) {
            // Show error if trying to change to a different email
            setEmailError('Please enter correct email!');
        } else {
            setEmailError('');
        }
    };

    const handleEmailBlur = () => {
        setEmailTouched(true);
    };

    const submit = (e) => {
        e.preventDefault();

        // Validate name
        if (!validateName(data.name)) {
            setNameError('Name should only contain alphabets and spaces!');
            return;
        }

        // Final validation before submit
        if (data.email !== user.email) {
            setEmailError('Please enter correct email!');
            return;
        }

        if (!validateEmail(data.email)) {
            setEmailError('Please enter correct email!');
            return;
        }

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-brand-primary">Profile Information</h2>

                <p className="mt-1 text-sm text-brand-secondary">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={handleNameChange}
                        onBlur={handleNameBlur}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={nameTouched ? nameError : ''} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={emailTouched ? emailError : ''} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-brand-primary">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline text-sm text-brand-primary hover:text-brand-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-brand-success">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-brand-success">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
