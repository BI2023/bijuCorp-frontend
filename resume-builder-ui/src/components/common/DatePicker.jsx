"use client"

import { useState } from "react"

const DatePicker = ({
  label,
  value,
  onChange,
  placeholder,
  showCurrentOption = false,
  currentLabel = "Present",
  required = false,
}) => {
  const [isCurrent, setIsCurrent] = useState(value === currentLabel)

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked
    setIsCurrent(checked)
    if (checked) {
      onChange({ target: { value: currentLabel } })
    } else {
      onChange({ target: { value: "" } })
    }
  }

  const handleDateChange = (e) => {
    setIsCurrent(false)
    onChange(e)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <input
        type="month"
        value={isCurrent ? "" : value}
        onChange={handleDateChange}
        placeholder={placeholder}
        disabled={isCurrent}
        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {showCurrentOption && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            id={`current-${label}`}
            checked={isCurrent}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary"
          />
          <label htmlFor={`current-${label}`} className="text-sm text-foreground cursor-pointer">
            {currentLabel}
          </label>
        </div>
      )}
    </div>
  )
}

export default DatePicker
