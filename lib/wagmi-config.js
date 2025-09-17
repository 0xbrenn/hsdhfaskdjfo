import { defineChain } from 'viem'

// Define Sepolia for Wagmi/Viem (ACTIVE)
export const sepolia = defineChain({
  id: 11155111,
  name: 'Sepolia',
  network: 'sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'SepoliaETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia.org'],
    },
    public: {
      http: ['https://rpc.sepolia.org'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Sepolia Etherscan', 
      url: 'https://sepolia.etherscan.io'
    },
  },
  testnet: true,
  contracts: {},
})

// ============ COMMENTED OUT OPN CONFIGURATION (KEPT FOR REFERENCE) ============

// Define OPN Testnet as a custom chain for Wagmi/Viem
// export const opnTestnet = defineChain({
//   id: 984,
//   name: 'OPN Testnet',
//   network: 'opn-testnet',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'OPN',
//     symbol: 'OPN',
//   },
//   rpcUrls: {
//     default: {
//       http: ['https://testnet-rpc.iopn.tech'],
//     },
//     public: {
//       http: ['https://testnet-rpc.iopn.tech'],
//     },
//   },
//   blockExplorers: {
//     default: { 
//       name: 'OPN Testnet Explorer', 
//       url: 'https://testnet.iopn.tech'
//     },
//   },
//   testnet: true,
//   contracts: {},
//   // Add icon URL for chain
//   iconUrl: 'https://i.ibb.co/dN1sMhw/logo.jpg',
// })

// Export the active chain (for easy switching between networks)
export const activeChain = sepolia
// To switch back to OPN: uncomment opnTestnet above and change this to:
// export const activeChain = opnTestnet