"use client"

import type React from "react"

import { useState } from "react"
import NextLink, { type LinkProps as NextLinkProps } from "next/link"
import { useRouter } from "next/navigation"
import { LoadingOverlay } from "@/components/ui/loading-overlay"

interface LinkProps extends NextLinkProps {
  children: React.ReactNode
  className?: string
  showLoadingOverlay?: boolean
}

export function Link({ children, showLoadingOverlay = true, ...props }: LinkProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (showLoadingOverlay) {
      e.preventDefault()
      setIsLoading(true)
      router.push(props.href.toString())
    }
  }

  return (
    <>
      <NextLink {...props} onClick={handleClick}>
        {children}
      </NextLink>
      {isLoading && showLoadingOverlay && <LoadingOverlay />}
    </>
  )
}

