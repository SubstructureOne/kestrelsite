import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { Session } from '@supabase/gotrue-js'
import React from "react"

type AuthProperties = {
    setSession: Dispatch<SetStateAction<Session|null>>
}

export const SigninForm: FunctionComponent<AuthProperties> = ({setSession}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const {session, error} = await supabase.auth.signInWithPassword(
            {email, password},
            {redirectTo: "#"}
        )
        if (error) {
            throw error
        }
        setSession(session)
    }

    return <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">Sign in to your Kestrel account</h1>

            <p className="mt-4 text-gray-500">
                By signing in you are agreeing to our <a href="termsofuse">Terms & Conditions</a>.
            </p>
        </div>

        <form
            className="mx-auto mt-8 mb-0 max-w-md space-y-4"
            onSubmit={onSubmitHandler}
        >
            <div>
                <label htmlFor="email" className="sr-only">Email</label>

                <div className="relative">
                    <input
                        type="email"
                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                        placeholder="Enter email"
                        value={email}
                        onChange={e=>setEmail(e.target.value)}
                    />

                    <span className="absolute inset-y-0 right-0 grid place-content-center px-4">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
            />
          </svg>
        </span>
                </div>
            </div>

            <div>
                <label htmlFor="password" className="sr-only">Password</label>

                <div className="relative">
                    <input
                        type="password"
                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                        placeholder="Enter password"
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                    />

                    <span className="absolute inset-y-0 right-0 grid place-content-center px-4">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
          >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    No account? <a className="underline" href="signup">Sign up</a>
                </p>

                <button
                    type="submit"
                    className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                >
                    Sign in
                </button>
            </div>
        </form>
    </div>

}

const Auth: FunctionComponent<AuthProperties> = ({setSession}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const {session, error} = await supabase.auth.signInWithPassword(
            {email, password},
            {redirectTo: "#"}
        )
        if (error) {
            throw error
        }
        setSession(session)
    }
    return (
        <div className="w-container" style={{marginLeft: "auto", marginRight: "auto", clear: "both"}}>
            <div className="w-col w-col-3">
                <form
                    id="login-form"
                    name="login-form"
                    onSubmit={onSubmitHandler}
                >
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        className="w-input"
                        maxLength={256}
                        name="email"
                        id="email"
                        value={email}
                        onChange={e=>setEmail(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="w-input"
                        maxLength={256}
                        name="password"
                        id="password"
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                    />
                    <input type="submit" value="Submit" className="w-button" />
                </form>
            </div>
        </div>
    )
}

export default Auth

// export default function Auth() {
//     const [loading, setLoading] = useState(false)
//     const [email, setEmail] = useState('')
//     const [password, setPassword] = useState('')
//
//     const handleLogin = async (email: string, password: string) => {
//         try {
//             setLoading(true)
//             const { error } = await supabase.auth.signIn({
//                 email: email,
//                 password: password
//             })
//             if (error) throw error
//             // alert('Check your email for the login link!')
//         } catch (error) {
//             alert(JSON.stringify(error))
//         } finally {
//             setLoading(false)
//         }
//     }
//
//     return (
//         <div className="row flex flex-center">
//             <div className="col-6 form-widget">
//                 <h1 className="header">Supabase + Next.js</h1>
//                 <p className="description">Sign in via magic link with your email below</p>
//                 <div>
//                     <input
//                         className="inputField"
//                         type="email"
//                         placeholder="Your email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                     <input
//                         className="inputField"
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                 </div>
//                 <div>
//                     <button
//                         onClick={(e) => {
//                             e.preventDefault()
//                             handleLogin(email, password).then()
//                         }}
//                         className="button block"
//                         disabled={loading}
//                     >
//                         <span>{loading ? 'Loading' : 'Send magic link'}</span>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }
