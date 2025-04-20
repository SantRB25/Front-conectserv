import * as React from "react"

function Flex({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={`md:flex items-center gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
function FlexBetween({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Flex
      className={`justify-between ${className}`}
      {...props}
    >
      {children}
    </Flex>
  )
}
function FlexEnd({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <Flex
      className={`justify-end ${className}`}
      {...props}
    >
      {children}
    </Flex>
  )
}
export { Flex,FlexBetween,FlexEnd }
