// Sepolia Chain configuration (ACTIVE)
export const sepoliaChain = {
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
}

// Network format for wallets - Sepolia (ACTIVE)
export const sepoliaNetwork = {
  id: 11155111,
  name: 'Sepolia',
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
  contracts: {},
  testnet: true,
}

// ============ COMMENTED OUT OPN CONFIGURATION (KEPT FOR REFERENCE) ============

// OPN Chain configuration
// export const opnChain = {
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
//       http: ['https://val1.iopn.pectra.zeeve.net/'],
//     },
//     public: {
//       http: ['https://val1.iopn.pectra.zeeve.net/'],
//     },
//   },
//   blockExplorers: {
//     default: { 
//       name: 'OPN Testnet Explorer', 
//       url: 'https://testnet.iopn.tech'
//     },
//   },
//   testnet: true,
// }

// Network format for wallets - OPN
// export const opnNetwork = {
//   id: 984,
//   name: 'OPN Testnet',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'OPN',
//     symbol: 'OPN',
//   },
//   rpcUrls: {
//     default: {
//       http: ['https://val1.iopn.pectra.zeeve.net/'],
//     },
//     public: {
//       http: ['https://val1.iopn.pectra.zeeve.net/'],
//     },
//   },
//   blockExplorers: {
//     default: { 
//       name: 'OPN Testnet Explorer', 
//       url: 'https://testnet.iopn.tech'
//     },
//   },
//   contracts: {},
//   testnet: true,
//   // Add chain icon for display in wallet modal
//   imageUrl: 'https://i.ibb.co/dN1sMhw/logo.jpg',
//   imageId: 'opn-logo',
// }

// Export the active chain configuration
export const activeChain = sepoliaChain
export const activeNetwork = sepoliaNetwork