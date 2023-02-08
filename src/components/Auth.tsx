import { Dispatch, FunctionComponent, SetStateAction, useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { Session } from '@supabase/gotrue-js'
import React from "react"

type AuthProperties = {
    setSession: Dispatch<SetStateAction<Session|null>>
}

const Auth: FunctionComponent<AuthProperties> = ({setSession}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const {session, error} = await supabase.auth.signIn(
            {email, password},
            {redirectTo: "#"}
        )
        if (error) {
            throw error
        }
        setSession(session)
    }
    return (
        <div className="w-container">
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
