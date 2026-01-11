"use client"

const Loader = ({ size = "md", text }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`${sizes[size]} border-4 border-primary border-t-transparent rounded-full animate-spin`}></div>
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

export default Loader
