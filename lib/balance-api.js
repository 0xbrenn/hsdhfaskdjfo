// lib/balance-api.js
// Service layer for interacting with the balance management API

const BALANCE_API_URL = process.env.NEXT_PUBLIC_BALANCE_API_URL || 'http://localhost:3001'

export class BalanceAPIError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'BalanceAPIError'
    this.status = status
  }
}

export const balanceAPI = {
  // Helper method for API calls
  async _request(endpoint, options = {}) {
    const response = await fetch(`${BALANCE_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new BalanceAPIError(
        error.error || `Request failed with status ${response.status}`,
        response.status
      )
    }

    return response.json()
  },

  // Get user balance
  async getBalance(userId) {
    try {
      const data = await this._request(`/api/balance/${userId}`)
      return data.balance || 0
    } catch (error) {
      console.error('Error fetching balance:', error)
      if (error.status === 404) {
        return 1000 // New user gets 1000 tokens
      }
      throw error
    }
  },

  // Add tokens to user balance
  async addBalance(userId, amount, reason = 'Manual addition', source = 'dashboard') {
    if (amount <= 0) {
      throw new BalanceAPIError('Amount must be positive', 400)
    }

    const data = await this._request('/api/balance/add', {
      method: 'POST',
      body: JSON.stringify({
        address: userId.toString(),
        amount,
        description: reason,
        source
      })
    })

    return {
      success: data.success,
      newBalance: data.balance,
      change: amount
    }
  },

  // Subtract tokens from user balance
  async subtractBalance(userId, amount, reason = 'Manual deduction', source = 'dashboard') {
    if (amount <= 0) {
      throw new BalanceAPIError('Amount must be positive', 400)
    }

    const data = await this._request('/api/balance/subtract', {
      method: 'POST',
      body: JSON.stringify({
        address: userId.toString(),
        amount,
        description: reason,
        source
      })
    })

    return {
      success: data.success,
      newBalance: data.balance,
      change: -amount
    }
  },

  // Transfer tokens between users
  async transferBalance(fromUserId, toUserId, amount, reason = 'Transfer') {
    if (amount <= 0) {
      throw new BalanceAPIError('Amount must be positive', 400)
    }

    try {
      // First subtract from sender
      await this.subtractBalance(fromUserId, amount, `${reason} to user ${toUserId}`, 'transfer')
      
      // Then add to receiver
      const result = await this.addBalance(toUserId, amount, `${reason} from user ${fromUserId}`, 'transfer')
      
      return {
        success: true,
        amount,
        fromUser: fromUserId,
        toUser: toUserId
      }
    } catch (error) {
      // If adding to receiver fails, try to refund sender
      if (error.message.includes('Insufficient')) {
        // Subtraction failed, no need to refund
        throw error
      } else {
        // Addition failed, refund sender
        try {
          await this.addBalance(fromUserId, amount, 'Transfer refund', 'system')
        } catch (refundError) {
          console.error('Failed to refund transfer:', refundError)
        }
        throw new BalanceAPIError('Transfer failed and was rolled back', 500)
      }
    }
  },

  // Batch operations
  async batchAddBalance(operations) {
    const results = []
    const errors = []

    for (const op of operations) {
      try {
        const result = await this.addBalance(op.userId, op.amount, op.reason, op.source)
        results.push({ userId: op.userId, ...result })
      } catch (error) {
        errors.push({ userId: op.userId, error: error.message })
      }
    }

    return { results, errors }
  },

  // Helper to convert Discord ID or wallet address to string identifier
  parseUserId(userIdentifier) {
    // If it's a wallet address or Discord ID, just return as string
    if (typeof userIdentifier === 'string') {
      return userIdentifier
    }
    
    // If it's a number, convert to string
    if (typeof userIdentifier === 'number') {
      return userIdentifier.toString()
    }
    
    // Default: return as string
    return String(userIdentifier)
  }
}