import { useState, useEffect, FunctionComponent } from 'react'
import { supabase } from '../utils/supabaseClient'
import { Session } from "@supabase/gotrue-js";

interface AccountProps {
    session: Session,
}

const Account: FunctionComponent<AccountProps> = ({ session }) => {
    const [loading, setLoading] = useState<boolean>(true)
    const [username, setUsername] = useState<string>("")
    const [website, setWebsite] = useState<string>("")
    const [avatar_url, setAvatarUrl] = useState<string>("")

    useEffect(() => {
        void getProfile()
    }, [session])

    async function getProfile() {
        try {
            setLoading(true)
            const {
                data: { session },
            } = await supabase.auth.getSession()
            const user = session?.user

            if (session?.access_token) {
                setUsername(session?.access_token)
            }
            if (user?.updated_at) {
                setWebsite(user?.updated_at)
            }
            if (user?.last_sign_in_at) {
                setAvatarUrl(user?.last_sign_in_at)
            }
        } catch (error) {
            alert(JSON.stringify(error))
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile(username: string, website: string, avatar_url: string) {
        try {
            setLoading(true)
            const {
                data: { session },
            } = await supabase.auth.getSession()
            const user = session?.user

            const updates = {
                id: user?.id,
                username,
                website,
                avatar_url,
                updated_at: new Date(),
            }

            await supabase.from('profiles').upsert(updates)

        } catch (error) {
            alert(JSON.stringify(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="form-widget">
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={session.user?.email} disabled />
            </div>
            <div>
                <label htmlFor="username">Name</label>
                <input
                    id="username"
                    type="text"
                    value={username || ''}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="website">Website</label>
                <input
                    id="website"
                    type="website"
                    value={website || ''}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>

            <div>
                <button
                    className="button block primary"
                    onClick={() => updateProfile(username, website, avatar_url)}
                    disabled={loading}
                >
                    {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>

            <div>
                <button className="button block" onClick={() => supabase.auth.signOut()}>
                    Sign Out
                </button>
            </div>
        </div>
    )
}

export default Account;
