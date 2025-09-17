"use client"

import { PrivyProvider } from '@privy-io/react-auth'
import { sepolia } from 'viem/chains'

export function PrivyProviderWrapper({ children }) {
  return (
    <PrivyProvider
      appId="cmf4wrqn4005vk00b1bjrry0n"
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#00FFFF',
          logo: 'https://i.ibb.co/dN1sMhw/logo.jpg',
        },
        loginMethods: ['wallet'],
        embeddedWallets: {
          createOnLogin: 'off'
        },
        // Add Sepolia chain support
        defaultChain: sepolia,
        supportedChains: [sepolia]
      }}
    >
      {children}
    </PrivyProvider>
  )
}