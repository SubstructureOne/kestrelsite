import { FunctionComponent, useCallback, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { TextEncoder } from 'util'
import { sign } from 'tweetnacl';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui'
import { clusterApiUrl } from '@solana/web3.js'
import SignMessage from '../components/signMessage'
// const getProvider = () => {
//     if ('phantom' in window) {
//         const provider = window.phantom?.solana;
//
//         if (provider?.isPhantom) {
//             return provider;
//         }
//     }
//
//     window.open('https://phantom.app/', '_blank');
// };

const Validate: FunctionComponent = () => {
    const network = WalletAdapterNetwork.Mainnet
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(() => [new PhantomWalletAdapter()], [network])
    return <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
            <WalletModalProvider>
                <WalletMultiButton />
                <WalletDisconnectButton />
                <SignMessage/>
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
}

export default Validate
