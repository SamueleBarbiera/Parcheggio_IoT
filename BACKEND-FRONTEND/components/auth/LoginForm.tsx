/* eslint-disable no-control-regex */
/* eslint-disable no-unused-vars */
import { signIn } from 'next-auth/client'
import { AiTwotoneCar } from 'react-icons/ai'

export default function LoginForm({ providers }: any) {
    return (
        <>
            <div className="flex h-screen flex-col justify-center bg-indigo-900 px-6 py-4">
                <div className=" sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="rounded-2xl bg-indigo-100  shadow-lg  sm:py-10">
                        <div className="flex items-center justify-center sm:p-12 md:w-full">
                            <div className="w-full">
                                <div className="flex justify-center">
                                    <AiTwotoneCar
                                        className="h-24 w-24 flex-shrink-0 rounded-md bg-gray-50 p-2 text-indigo-900"
                                        aria-hidden="true"
                                    />
                                </div>
                                <h1 className="mb-12 mt-4 text-center text-2xl font-bold text-gray-700">
                                    Accedi con il tuo account
                                </h1>

                                <div className="mt-0 grid grid-cols-1 ">
                                    {providers ? (
                                        <button
                                            className="text-medium inline-flex w-auto justify-center  rounded-lg bg-indigo-900 py-2 px-4 font-medium text-indigo-50 shadow-lg transition duration-200 ease-in-out hover:bg-indigo-900"
                                            onClick={() => {
                                                signIn('google')
                                            }}
                                        >
                                            <svg
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                                                </svg>
                                            </svg>
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
