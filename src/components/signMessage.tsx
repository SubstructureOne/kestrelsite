import { FunctionComponent, useCallback, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { sign } from 'tweetnacl'

const SignMessage: FunctionComponent = () => {
    const { publicKey, signMessage } = useWallet()
    console.log(`Public key: ${publicKey?.toString()}`)
    const [signedMessage, setSignedMessage] = useState("")
    const onClick = useCallback(async () => {
        if (!signMessage) {
            throw new Error("Wallet does not support message signing")
        }
        if (!publicKey) {
            throw new Error("Wallet not connected")
        }
        const message = new TextEncoder().encode("This is a test message")
        const signature = await signMessage(message);
        if (!sign.detached.verify(message, signature, publicKey.toBytes())) {
            throw new Error('Invalid signature');
        }
        setSignedMessage(message.toString())
    }, [publicKey, signMessage])
    return <div>
        <input type="button" onClick={onClick} disabled={!publicKey} value="Sign Message"/>
        <br/>
        <input type="text" value={signedMessage}/><br/>
        <input type="text" value={publicKey?.toString()}/>
    </div>
}

export default SignMessage
