import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import Head from 'next/head'
import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { BellIcon, CogIcon, CreditCardIcon, KeyIcon, MenuIcon, UserCircleIcon, ViewGridAddIcon, XIcon } from '@heroicons/react/outline'
import { getSession, useSession } from 'next-auth/client'
import { RefreshIcon } from '@heroicons/react/solid'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

function PannelloPersonale() {
    const [session, loading] = useSession()
    console.log('🚀 - file: PannelloPersonale.tsx - line 42 - PannelloPersonale - session', session)
    const [availableToHire, setAvailableToHire] = useState(true)
    const [privateAccount, setPrivateAccount] = useState(false)
    const [allowCommenting, setAllowCommenting] = useState(true)
    const [allowMentions, setAllowMentions] = useState(true)
    return (
        <>
            <Head>
                <title>Parcheggi</title>
                <link rel="icon" href="/question-solid.svg" />
                <meta charSet="utf-8" className="next-head" />
            </Head>

            <Header />
            {session ? (
                <div className="h-full w-screen items-center justify-center overflow-hidden rounded-lg bg-white shadow">
                    <div className="divide-y divide-gray-200 overflow-hidden lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                        <form className="divide-y divide-gray-200 lg:col-span-12" action="#" method="POST">
                            {/* Profile section */}
                            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                                <div>
                                    <h2 className="text-lg font-medium leading-6 text-gray-900">Profilo</h2>
                                    <p className="mt-1 text-sm text-gray-500">Qui poi visualizzare e modificare le impostazioni del tuo account</p>
                                </div>

                                <div className="mt-6 flex flex-col lg:flex-row">
                                    <div className="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-shrink-0 lg:flex-grow-0">
                                        <div className="mt-1 lg:hidden">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full" aria-hidden="true">
                                                    <img src={session!.user!.image! as any} alt="User Img" className="mx-auto h-24 w-24 rounded-full shadow-lg" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative hidden overflow-hidden rounded-full lg:block">
                                            <img src={session!.user!.image! as any} alt="User Img" className="mx-auto h-24 w-24 rounded-full shadow-lg" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-12 gap-6">
                                    <div className="col-span-12 sm:col-span-6">
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            name="first-name"
                                            id="first-name"
                                            autoComplete="given-name"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="col-span-12 sm:col-span-6">
                                        <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                            Last name
                                        </label>
                                        <input
                                            type="text"
                                            name="last-name"
                                            id="last-name"
                                            autoComplete="family-name"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="col-span-12">
                                        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                                            URL
                                        </label>
                                        <input
                                            type="text"
                                            name="url"
                                            id="url"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                        />
                                    </div>

                                    <div className="col-span-12 sm:col-span-6">
                                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            id="company"
                                            autoComplete="organization"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Privacy section */}
                            <div className="divide-y divide-gray-200 pt-6">
                                <div className="px-4 sm:px-6">
                                    <div>
                                        <h2 className="text-lg font-medium leading-6 text-gray-900">Privacy</h2>
                                        <p className="mt-1 text-sm text-gray-500">Ornare eu a volutpat eget vulputate. Fringilla commodo amet.</p>
                                    </div>
                                    <ul role="list" className="mt-2 divide-y divide-gray-200">
                                        <Switch.Group as="li" className="flex items-center justify-between py-4">
                                            <div className="flex flex-col">
                                                <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                                                    Available to hire
                                                </Switch.Label>
                                                <Switch.Description className="text-sm text-gray-500">Nulla amet tempus sit accumsan. Aliquet turpis sed sit lacinia.</Switch.Description>
                                            </div>
                                            <Switch
                                                checked={availableToHire}
                                                onChange={setAvailableToHire}
                                                className={classNames(
                                                    availableToHire ? 'bg-indigo-500' : 'bg-gray-200',
                                                    'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
                                                )}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={classNames(
                                                        availableToHire ? 'translate-x-5' : 'translate-x-0',
                                                        'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                                    )}
                                                />
                                            </Switch>
                                        </Switch.Group>
                                        <Switch.Group as="li" className="flex items-center justify-between py-4">
                                            <div className="flex flex-col">
                                                <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                                                    Make account private
                                                </Switch.Label>
                                                <Switch.Description className="text-sm text-gray-500">Pharetra morbi dui mi mattis tellus sollicitudin cursus pharetra.</Switch.Description>
                                            </div>
                                            <Switch
                                                checked={privateAccount}
                                                onChange={setPrivateAccount}
                                                className={classNames(
                                                    privateAccount ? 'bg-indigo-500' : 'bg-gray-200',
                                                    'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
                                                )}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={classNames(
                                                        privateAccount ? 'translate-x-5' : 'translate-x-0',
                                                        'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                                    )}
                                                />
                                            </Switch>
                                        </Switch.Group>
                                        <Switch.Group as="li" className="flex items-center justify-between py-4">
                                            <div className="flex flex-col">
                                                <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                                                    Allow commenting
                                                </Switch.Label>
                                                <Switch.Description className="text-sm text-gray-500">Integer amet, nunc hendrerit adipiscing nam. Elementum ame</Switch.Description>
                                            </div>
                                            <Switch
                                                checked={allowCommenting}
                                                onChange={setAllowCommenting}
                                                className={classNames(
                                                    allowCommenting ? 'bg-indigo-500' : 'bg-gray-200',
                                                    'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
                                                )}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={classNames(
                                                        allowCommenting ? 'translate-x-5' : 'translate-x-0',
                                                        'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                                    )}
                                                />
                                            </Switch>
                                        </Switch.Group>
                                        <Switch.Group as="li" className="flex items-center justify-between py-4">
                                            <div className="flex flex-col">
                                                <Switch.Label as="p" className="text-sm font-medium text-gray-900" passive>
                                                    Allow mentions
                                                </Switch.Label>
                                                <Switch.Description className="text-sm text-gray-500">Adipiscing est venenatis enim molestie commodo eu gravid</Switch.Description>
                                            </div>
                                            <Switch
                                                checked={allowMentions}
                                                onChange={setAllowMentions}
                                                className={classNames(
                                                    allowMentions ? 'bg-indigo-500' : 'bg-gray-200',
                                                    'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
                                                )}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={classNames(
                                                        allowMentions ? 'translate-x-5' : 'translate-x-0',
                                                        'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                                    )}
                                                />
                                            </Switch>
                                        </Switch.Group>
                                    </ul>
                                </div>
                                <div className="mt-4 flex justify-end py-4 px-4 sm:px-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="ml-5 inline-flex justify-center rounded-md border border-transparent bg-sky-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            ) : loading ? (
                <div className="mx-auto h-full w-full rounded-lg bg-beige-200  py-4  px-4 shadow-xl">
                    <div className="flex flex-col items-center space-x-1 text-4xl font-semibold">
                        <RefreshIcon className="m-2 h-12 w-12 flex-shrink-0 animate-spin rounded-full bg-beige-100 py-2 text-beige-800 " />
                        <p className="mt-3 animate-pulse text-lg">Caricamento . . .</p>
                    </div>
                </div>
            ) : (
                <></>
            )}
            <Footer />
        </>
    )
}

export default PannelloPersonale

export async function getServerSideProps(ctx: any) {
    const session = await getSession(ctx)

    if (!session!.user && session!.user == {} && (session as any).user.email === '') {
        return {
            redirect: { destination: '/AccessDenied' },
        }
    }

    return {
        props: { products: null },
    }
}
