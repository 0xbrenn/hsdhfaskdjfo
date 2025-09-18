// hooks/use-nft.js
"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useContracts } from "./use-contracts"
import { useWallet } from "./use-wallet"

const NFTContext = createContext(undefined)

export function NFTProvider({ children }) {
  const { walletAddress } = useWallet()
  const { contracts } = useContracts()
  const [userNFT, setUserNFT] = useState(null)
  const [hasNFT, setHasNFT] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Cache for performance
  const [lastCheck, setLastCheck] = useState(0)
  const CACHE_DURATION = 30000 // 30 seconds

  // Check NFT directly from blockchain
  const checkNFTOwnership = useCallback(async (forceRefresh = false) => {
    // Skip if recently checked and not forcing refresh
    const now = Date.now()
    if (!forceRefresh && lastCheck && (now - lastCheck) < CACHE_DURATION) {
      return
    }

    if (!contracts.originNFT || !walletAddress) {
      setHasNFT(false)
      setUserNFT(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      // Direct contract call with better error handling
      let tokenId = 0
      try {
        tokenId = await contracts.originNFT.addressToTokenId(walletAddress)
      } catch (contractError) {
        // Contract call failed - likely not deployed or wrong network
        console.log('Contract call failed, assuming no NFT. Error:', contractError.message)
        setHasNFT(false)
        setUserNFT(null)
        setIsLoading(false)
        return
      }

      const hasNFT = tokenId && tokenId.toNumber() > 0
      
      setHasNFT(hasNFT)
      setLastCheck(now)
      
      if (hasNFT) {
        try {
          // Try to get NFT metadata
          const tokenURI = await contracts.originNFT.tokenURI(tokenId)
          if (tokenURI) {
            const metadataUrl = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
            const response = await fetch(metadataUrl)
            if (response.ok) {
              const metadata = await response.json()
              setUserNFT({
                id: tokenId.toNumber(),
                name: metadata.name || `Origin NFT #${tokenId}`,
                description: metadata.description,
                image: metadata.image?.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
                traits: metadata.attributes || [],
                mintedAt: new Date().toLocaleDateString(),
                owner: walletAddress,
              })
            }
          }
        } catch (metadataError) {
          // If metadata fails, still show basic NFT data
          console.log('Metadata fetch failed, using basic data')
          setUserNFT({
            id: tokenId.toNumber(),
            name: `Origin NFT #${tokenId}`,
            description: "IOPn Origin NFT",
            image: "/placeholder.svg",
            owner: walletAddress,
          })
        }
      } else {
        setUserNFT(null)
      }
    } catch (error) {
      // Catch any other unexpected errors
      console.log('Unexpected error checking NFT:', error.message)
      setHasNFT(false)
      setUserNFT(null)
    } finally {
      setIsLoading(false)
    }
  }, [contracts.originNFT, walletAddress, lastCheck])

  // Check on mount and when dependencies change
  useEffect(() => {
    checkNFTOwnership()
  }, [contracts.originNFT, walletAddress])

  const mintNFT = async (nftData) => {
    setIsMinting(true)
    
    try {
      // The actual minting is done in nft-mint page with contracts
      // This just manages the state
      
      // After successful mint, force refresh
      await checkNFTOwnership(true)
      
    } catch (error) {
      console.error("Failed to mint NFT:", error)
      throw error
    } finally {
      setIsMinting(false)
    }
  }

  const updateNFT = async (updates) => {
    // Since we're not using localStorage, just refresh from blockchain
    await checkNFTOwnership(true)
  }

  const value = {
    userNFT,
    hasNFT,
    isMinting,
    isLoading,
    mintNFT,
    updateNFT,
    checkNFTOwnership,
  }

  return (
    <NFTContext.Provider value={value}>
      {children}
    </NFTContext.Provider>
  )
}

export function useNFT() {
  const context = useContext(NFTContext)
  if (context === undefined) {
    throw new Error("useNFT must be used within an NFTProvider")
  }
  return context
}