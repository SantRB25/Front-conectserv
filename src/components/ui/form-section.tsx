import * as React from "react"

export default function Title({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={`text-xl font-semibold ${className}`}
      {...props}
    >
      {children}
    </h2>
  )
}
