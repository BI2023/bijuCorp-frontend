"use client"

import { useEffect } from "react"
import { useWallet } from "../../context/WalletContext"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"
import { formatCurrency, formatDateTime } from "../../utils/helpers"

const Transactions = () => {
  const { transactions, loading, fetchTransactions } = useWallet()

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Transaction History</h1>
              <p className="text-muted-foreground">View all your wallet transactions</p>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-left p-4 font-semibold text-sm text-foreground">Date</th>
                        <th className="text-left p-4 font-semibold text-sm text-foreground">Type</th>
                        <th className="text-left p-4 font-semibold text-sm text-foreground">Description</th>
                        <th className="text-right p-4 font-semibold text-sm text-foreground">Amount</th>
                        <th className="text-right p-4 font-semibold text-sm text-foreground">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <tr key={index} className="border-t border-border hover:bg-accent/50">
                          <td className="p-4 text-sm text-foreground">
                            {formatDateTime(transaction.created_at || new Date().toISOString())}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                transaction.type === "credit"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {transaction.type === "credit" ? "Credit" : "Debit"}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-foreground">{transaction.description || "N/A"}</td>
                          <td
                            className={`p-4 text-sm text-right font-semibold ${
                              transaction.type === "credit" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                            {formatCurrency(transaction.amount || 0)}
                          </td>
                          <td className="p-4 text-sm text-right font-medium text-foreground">
                            {formatCurrency(transaction.balance_after || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20">
                  <svg
                    className="w-20 h-20 text-muted-foreground mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-foreground mb-2">No transactions yet</h3>
                  <p className="text-muted-foreground">Your transaction history will appear here</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Transactions
