import {NextPage} from "next"
import {Navigation} from "../components/Navigation"
import {Headers} from "../components/Headers"
import {useState} from "react"
import Footer from "../components/Footer"
import React from "react"
import {supabase} from "../utils/supabaseClient"
import Link from "next/link";

const SignUpFlow: NextPage = () => {
    // const [pageNumber, setPageNumber] = useState("1")
    return <>
        <Headers title="Kestrel Substructure: Sign-Up"/>
        <Navigation></Navigation>
        <div className="max-w-4xl mx-auto wf-section">
            {/*<ProgressBar selectedNumber={pageNumber}/>*/}
            {/*{(pageNumber == "1") && DetailsForm()}*/}
            {/*<DetailsForm/>*/}
            <SignupForm/>
        </div>
        <Footer/>
    </>
}

function CheckEmail() {
    return <div className="grid h-screen px-4 bg-white place-content-center">
        <div className="text-center">
            <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Invitation Sent
            </p>

            <p className="mt-4 text-gray-500">Check your email for your sign-in link.</p>

            <a
                href="/"
                className="inline-block px-5 py-3 mt-6 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring"
            >
                Go Back Home
            </a>
        </div>
    </div>
}


function SignupForm() {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [receivedPromos, setReceivePromos] = useState(false)
    const [alert, setAlert] = useState("")
    const [emailSent, setEmailSent] = useState(false)
    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log(`Creating user ${email}`)
        const { error, data: { user, session } } = await supabase.auth.signUp(
            {
                email,
                password,
                options: {
                    data: {
                        name,
                        status: 'new',
                    }
                }
            },
        )
        console.log(`Error: ${error}, user: ${user}, session: ${session}`)
        if (error !== null) {
            setAlert(error.message)
        } else {
            setEmailSent(true)
        }
    }
    return emailSent ? CheckEmail() : <div className="bg-white">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12 border-x-2 border-black">
            <section
                className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6"
            >
                <img
                    alt="Profile photo of a kestrel"
                    src="/images/kestrelprofile.jpg"
                    className="absolute inset-0 h-full w-full object-cover opacity-80 object-[0%_35%]"
                />

                <div className="hidden lg:relative lg:block lg:p-12">
                    <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                        Welcome to Kestrel
                    </h2>

                    <p className="mt-4 leading-relaxed text-white/90">
                        {/*Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi nam*/}
                        {/*dolorum aliquam, quibusdam aperiam voluptatum.*/}
                    </p>
                </div>
            </section>

            <main
                aria-label="Main"
                className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16 xl:col-span-6"
            >
                <div className="max-w-xl lg:max-w-3xl">
                    <div className="relative block lg:hidden">
                        <h1
                            className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl"
                        >
                            Welcome to Kestrel
                        </h1>

                        <p className="mt-4 leading-relaxed text-gray-500">
                            {/*Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi*/}
                            {/*nam dolorum aliquam, quibusdam aperiam voluptatum.*/}
                        </p>
                    </div>

                    <form className="mt-8 grid grid-cols-6 gap-6" onSubmit={onSubmitHandler}>
                        {alert == "" ? <></> :
                            <div role="alert" className="rounded border-l-4 border-red-500 bg-red-50 p-4 col-span-6">
                                <strong className="block font-medium text-red-800"> Something went wrong </strong>

                                <p className="mt-2 text-sm text-red-700">
                                    {alert}
                                </p>
                            </div>
                        }

                        <div className="col-span-6 sm:col-span-6">
                            <label
                                htmlFor="Name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Name
                            </label>

                            <input
                                type="text"
                                id="Name"
                                name="first_name"
                                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                                value={name}
                                onChange={e=>setName(e.target.value)}
                            />
                        </div>

                        <div className="col-span-6">
                            <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>

                            <input
                                type="email"
                                id="Email"
                                name="email"
                                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                                value={email}
                                onChange={e=>setEmail(e.target.value)}
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-6">
                            <label
                                htmlFor="Password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                id="Password"
                                name="password"
                                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                                value={password}
                                onChange={e=>setPassword(e.target.value)}
                            />
                        </div>

                        <div className="col-span-6">
                            <label htmlFor="MarketingAccept" className="flex gap-4">
                                <input
                                    type="checkbox"
                                    id="MarketingAccept"
                                    name="marketing_accept"
                                    className="h-5 w-5 rounded-md border-gray-200 bg-white shadow-sm"
                                    checked={receivedPromos}
                                    onChange={e=>setReceivePromos(e.target.checked)}
                                />

                                <span className="text-sm text-gray-700">
                                    I want to receive emails about product updates and
                                    announcements.
                                  </span>
                            </label>
                        </div>

                        <div className="col-span-6">
                            <p className="text-sm text-gray-500">
                                By creating an account, you agree to our
                                <Link href="termsofuse" className="text-gray-700 underline">terms and conditions</Link>
                                and <Link href="privacypolicy" className="text-gray-700 underline">privacy policy</Link>.
                            </p>
                        </div>

                        <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                            <button
                                className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                            >
                                Create an account
                            </button>

                            <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                                Already have an account? <a href="profile" className="text-gray-700 underline">Log in</a>.
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    </div>
}

interface ProgressBarTypes {
    selectedNumber: string
}

export default SignUpFlow