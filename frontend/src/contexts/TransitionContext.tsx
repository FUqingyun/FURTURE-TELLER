'use client'

import React, { createContext, useContext, useState } from 'react'

interface TransitionContextType {
  clickPosition: { x: number; y: number } | null
  setClickPosition: (pos: { x: number; y: number }) => void
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined)

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null)

  return (
    <TransitionContext.Provider value={{ clickPosition, setClickPosition }}>
      {children}
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  const context = useContext(TransitionContext)
  if (context === undefined) {
    throw new Error('useTransition must be used within a TransitionProvider')
  }
  return context
}

