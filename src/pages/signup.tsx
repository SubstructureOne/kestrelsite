import {NextPage} from "next"
import {Navigation} from "../components/Navigation"
import {Headers} from "../components/Headers"
import {useState} from "react"
import Footer from "../components/Footer"
import Image from "next/image"

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


function SignupForm() {
    return <div className="bg-white">
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
                    <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
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

                    <form action="#" className="mt-8 grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="FirstName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                First Name
                            </label>

                            <input
                                type="text"
                                id="FirstName"
                                name="first_name"
                                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="LastName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Last Name
                            </label>

                            <input
                                type="text"
                                id="LastName"
                                name="last_name"
                                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
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
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
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
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="PasswordConfirmation"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password Confirmation
                            </label>

                            <input
                                type="password"
                                id="PasswordConfirmation"
                                name="password_confirmation"
                                className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                            />
                        </div>

                        <div className="col-span-6">
                            <label htmlFor="MarketingAccept" className="flex gap-4">
                                <input
                                    type="checkbox"
                                    id="MarketingAccept"
                                    name="marketing_accept"
                                    className="h-5 w-5 rounded-md border-gray-200 bg-white shadow-sm"
                                />

                                <span className="text-sm text-gray-700">
                                    I want to receive emails about events, product updates and
                                    company announcements.
                                  </span>
                            </label>
                        </div>

                        <div className="col-span-6">
                            <p className="text-sm text-gray-500">
                                By creating an account, you agree to our <a href="#" className="text-gray-700 underline">
                                terms and conditions</a> and <a href="#" className="text-gray-700 underline">privacy
                                policy</a>.
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

function DetailsForm() {
    return <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">Create an account</h1>

            {/*<p className="mt-4 text-gray-500">*/}
            {/*    Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero nulla*/}
            {/*    eaque error neque ipsa culpa autem, at itaque nostrum!*/}
            {/*</p>*/}
        </div>

        <form action="" className="mx-auto mt-8 mb-0 max-w-md space-y-4">
            <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <div className="relative">
                    <input
                        type="email"
                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                        placeholder="Enter email"
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
                    {/*No account?*/}
                    {/*<a className="underline" href="">Sign up</a>*/}
                </p>

                <button
                    type="submit"
                    className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                >
                    Next
                </button>
            </div>
        </form>
    </div>
}

function ProgressBar({selectedNumber}: ProgressBarTypes) {
    const standardClasses = "h-6 w-6 rounded-full text-center text-[10px] font-bold leading-6 "
    const selectedClasses = "bg-blue-600 text-white"
    const otherClasses = "bg-gray-100"
    return <div>
        <h2 className="sr-only">Steps</h2>
        <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100">
            <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-500">
                <li className="flex items-center gap-2 bg-white p-2">
                    <span className={standardClasses + ((selectedNumber == "1") ? selectedClasses : otherClasses)}>
                      1
                    </span>
                    <span className="hidden sm:block"> Details </span>
                </li>
                <li className="flex items-center gap-2 bg-white p-2">
                    <span className={standardClasses + ((selectedNumber == "2") ? selectedClasses : otherClasses)}>
                      2
                    </span>
                    <span className="hidden sm:block"> Payment </span>
                </li>
                <li className="flex items-center gap-2 bg-white p-2">
                    <span className={standardClasses + ((selectedNumber == "3") ? selectedClasses : otherClasses)}>
                      3
                    </span>
                    <span className="hidden sm:block"> Confirmation </span>
                </li>
            </ol>
        </div>
    </div>
}
export default SignUpFlow