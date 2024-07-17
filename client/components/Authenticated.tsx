import { useAuth0 } from '@auth0/auth0-react'
import React from 'react'

const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth0()

  return isAuthenticated
}

interface Props {
  children: React.ReactNode
}

export function IfAuthenticated({ children }: Props) {
  return useIsAuthenticated() ? <>{children}</> : null
}

export function IfNotAuthenticated({ children }: Props) {
  return !useIsAuthenticated() ? <>{children}</> : null
}
