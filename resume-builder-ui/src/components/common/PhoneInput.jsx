"use client"

import { useState } from "react"

const COUNTRY_CODES = [
  { code: "+1", country: "US/CA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+82", country: "S.Korea", flag: "🇰🇷" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+27", country: "S.Africa", flag: "🇿🇦" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
]

const PhoneInput = ({ label, value, onChange, placeholder, required = false }) => {
  // Parse existing value to extract country code and number
  const parsePhone = (phoneStr) => {
    if (!phoneStr) return { code: "+1", number: "" }
    const match = phoneStr.match(/^(\+\d+)\s*(.*)$/)
    if (match) {
      return { code: match[1], number: match[2] }
    }
    return { code: "+1", number: phoneStr }
  }

  const { code: initialCode, number: initialNumber } = parsePhone(value)
  const [countryCode, setCountryCode] = useState(initialCode)
  const [phoneNumber, setPhoneNumber] = useState(initialNumber)

  const handleCodeChange = (e) => {
    const newCode = e.target.value
    setCountryCode(newCode)
    onChange({ target: { value: `${newCode} ${phoneNumber}`.trim() } })
  }

  const handleNumberChange = (e) => {
    const newNumber = e.target.value
    setPhoneNumber(newNumber)
    onChange({ target: { value: `${countryCode} ${newNumber}`.trim() } })
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        <select
          value={countryCode}
          onChange={handleCodeChange}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {COUNTRY_CODES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={phoneNumber}
          onChange={handleNumberChange}
          placeholder={placeholder || "123-456-7890"}
          required={required}
          className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    </div>
  )
}

export default PhoneInput
