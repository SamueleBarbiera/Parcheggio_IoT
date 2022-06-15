/* eslint-disable no-control-regex */
/* eslint-disable no-unused-vars */
import { signIn, useSession } from 'next-auth/react'

export default function LoginForm({ providers }: any) {

    return (
        <>
            <div className="flex h-screen flex-col justify-center bg-indigo-900 px-6 py-4">
                <div className=" sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="rounded-2xl bg-indigo-100 py-8 px-[1.9rem] shadow-lg  sm:py-10">
                        <div className="mt-0">
                            <div className="mt-0 grid grid-cols-2 gap-2">
                                {providers ? (
                                    <button
                                        className="text-medium inline-flex w-full justify-center  rounded-lg bg-indigo-900 py-2 px-4 font-medium text-indigo-50 shadow-lg transition duration-200 ease-in-out hover:bg-indigo-900"
                                        onClick={() => {
                                            signIn((providers as any).id,  {redirect: false})
                                        }}
                                    >
                                        <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
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
        </>
    )
}
