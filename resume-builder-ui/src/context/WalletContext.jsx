"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { walletAPI } from "../api/wallet.api"
import { useAuth } from "./AuthContext"

const WalletContext = createContext(null)

export const WalletProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchBalance()
      fetchTransactions()
    }
  }, [isAuthenticated])

  const fetchBalance = async () => {
    try {
      const data = await walletAPI.getBalance()
      setBalance(data.balance || 0)
    } catch (error) {
      console.error("Failed to fetch balance:", error)
    }
  }

  const fetchTransactions = async (params) => {
    setLoading(true)
    try {
      const data = await walletAPI.getTransactions(params)
      setTransactions(data.results || data)
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const createPaymentOrder = async (amount) => {
    try {
      const data = await walletAPI.createOrder(amount)
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to create order",
      }
    }
  }

  const verifyPaymentSignature = async (paymentData) => {
    try {
      const data = await walletAPI.verifyPayment(paymentData)
      if (data.status === "success" || data.new_balance) {
        await fetchBalance()
        await fetchTransactions()
        return { success: true, data }
      }
      return { success: false, error: "Payment verification failed" }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Payment verification failed",
      }
    }
  }

  const deductMoney = async (amount) => {
    try {
      await walletAPI.deductMoney(amount)
      await fetchBalance()
      return true
    } catch (error) {
      console.error("Failed to deduct money:", error)
      return false
    }
  }

  const value = {
    balance,
    transactions,
    loading,
    fetchBalance,
    fetchTransactions,
    createPaymentOrder,
    verifyPaymentSignature,
    deductMoney,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
