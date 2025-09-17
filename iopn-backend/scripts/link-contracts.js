import { ethers } from 'ethers'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get correct directory paths
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from iopn-backend directory (parent of scripts)
dotenv.config({ path: path.join(__dirname, '..', '.env') })

// Debug: Check if env vars loaded
console.log('Checking env vars...')
console.log('Private key exists?', !!process.env.BACKEND_WALLET_PRIVATE_KEY)

if (!process.env.BACKEND_WALLET_PRIVATE_KEY) {
  console.error('ERROR: BACKEND_WALLET_PRIVATE_KEY not found in environment')
  console.error('Make sure .env file exists in iopn-backend directory')
  process.exit(1)
}

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
// Add 0x prefix if missing
const privateKey = process.env.BACKEND_WALLET_PRIVATE_KEY.startsWith('0x') 
  ? process.env.BACKEND_WALLET_PRIVATE_KEY 
  : `0x${process.env.BACKEND_WALLET_PRIVATE_KEY}`

console.log('Creating wallet...')
const wallet = new ethers.Wallet(privateKey, provider)

async function linkContracts() {
  console.log('Linking contracts with wallet:', wallet.address)
  
  const originNFT = new ethers.Contract(
  process.env.ORIGIN_NFT_ADDRESS,
  ['function setContracts(address, address, address) external'],
  wallet
)

const tx = await originNFT.setContracts(
  process.env.REP_MANAGER_ADDRESS,
  process.env.BADGE_MANAGER_ADDRESS,
  process.env.MARKETPLACE_ADDRESS
)
  
  console.log('Transaction:', tx.hash)
  await tx.wait()
  console.log('✅ Contracts linked!')
}

linkContracts().catch(console.error)