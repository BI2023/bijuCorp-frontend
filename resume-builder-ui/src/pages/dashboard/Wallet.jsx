"use client"

import { useState } from "react"
import { useWallet } from "../../context/WalletContext"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"
import Button from "../../components/common/Button"
import Input from "../../components/common/Input"
import Modal from "../../components/common/Modal"
import { formatCurrency } from "../../utils/helpers"

const Wallet = () => {
  const { balance, createPaymentOrder, verifyPaymentSignature } = useWallet()
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false)
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const presetAmounts = [10, 25, 50, 100]

  const handleAddMoney = async () => {
    const amountNum = Number.parseFloat(amount)
    if (!amountNum || amountNum <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (!window.Razorpay) {
      setError("Payment gateway SDK failed to load. Please check your internet connection.")
      return
    }

    setLoading(true)
    setError("")

    // 1. Create Order
    const orderResult = await createPaymentOrder(amountNum)

    if (!orderResult.success) {
      setError(orderResult.error)
      setLoading(false)
      return
    }

    const { order_id, key, amount: amountPaise } = orderResult.data

    const options = {
      key: key,
      amount: amountPaise,
      currency: "INR",
      name: "Resume Builder",
      description: "Wallet Top-up",
      order_id: order_id,
      handler: async function (response) {
        // 2. Verify Payment
        const verificationResult = await verifyPaymentSignature({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        })

        setLoading(false)
        if (verificationResult.success) {
          setShowAddMoneyModal(false)
          setAmount("")
          // Optional: Show success toast
          alert(`Success! New Balance: ${formatCurrency(verificationResult.data.new_balance)}`)
        } else {
          setError(verificationResult.error)
        }
      },
      prefill: {
        // We could populate this from user profile if available
        // name: user.name,
        // email: user.email,
        // contact: user.phone
      },
      theme: {
        color: "#2563EB",
      },
      modal: {
        ondismiss: function () {
          setLoading(false)
        },
      },
    }

    const rzp1 = new window.Razorpay(options)
    rzp1.on("payment.failed", function (response) {
      setLoading(false)
      setError(response.error.description)
    })

    rzp1.open()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Wallet</h1>
              <p className="text-muted-foreground">Manage your wallet balance and transactions</p>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white mb-8 shadow-lg">
              <p className="text-sm opacity-90 mb-2">Current Balance</p>
              <p className="text-5xl font-bold mb-6">{formatCurrency(balance)}</p>
              <Button variant="secondary" onClick={() => setShowAddMoneyModal(true)}>
                Add Money
              </Button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">PDF Generation Cost</h3>
                    <p className="text-sm text-muted-foreground">Per resume</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(5)}</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">PDFs You Can Generate</h3>
                    <p className="text-sm text-muted-foreground">With current balance</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">{Math.floor(balance / 5)}</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Money Modal */}
      <Modal isOpen={showAddMoneyModal} onClose={() => setShowAddMoneyModal(false)} title="Add Money to Wallet">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Quick Select</label>
            <div className="grid grid-cols-4 gap-3">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset.toString())}
                  className={`p-3 border-2 rounded-lg font-semibold transition-all ${amount === preset.toString()
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50"
                    }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Or Enter Custom Amount"
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              setError("")
            }}
            placeholder="0.00"
            error={error}
            min="0"
            step="0.01"
          />

          <div className="bg-accent p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current Balance:</span>
              <span className="font-semibold text-foreground">{formatCurrency(balance)}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Adding:</span>
              <span className="font-semibold text-primary">+{formatCurrency(Number.parseFloat(amount) || 0)}</span>
            </div>
            <div className="h-px bg-border my-2"></div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">New Balance:</span>
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(balance + (Number.parseFloat(amount) || 0))}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowAddMoneyModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAddMoney}
              loading={loading}
              disabled={!amount || Number.parseFloat(amount) <= 0}
            >
              Add {formatCurrency(Number.parseFloat(amount) || 0)}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Wallet
