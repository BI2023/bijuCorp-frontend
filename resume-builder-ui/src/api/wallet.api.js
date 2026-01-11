import axiosInstance from "./axiosInstance"

export const walletAPI = {
  // Get wallet balance
  getBalance: async () => {
    const response = await axiosInstance.get("/wallet/balance/")
    return response.data
  },

  // Create Razorpay Order
  createOrder: async (amount) => {
    const response = await axiosInstance.post("/payments/create-order/", { amount })
    return response.data
  },

  // Verify Razorpay Payment
  verifyPayment: async (paymentData) => {
    const response = await axiosInstance.post("/payments/verify-payment/", paymentData)
    return response.data
  },

  // Deduct money from wallet
  deductMoney: async (amount) => {
    const response = await axiosInstance.post("/wallet/deduct/", { amount })
    return response.data
  },

  // Get transaction history
  getTransactions: async (params = {}) => {
    const response = await axiosInstance.get("/wallet/transactions/", { params })
    return response.data
  },

  // Get transaction details
  getTransactionDetails: async (transactionId) => {
    const response = await axiosInstance.get(`/wallet/transactions/${transactionId}/`)
    return response.data
  },
}
