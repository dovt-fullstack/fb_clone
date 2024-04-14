import React, { createContext, useState } from 'react'
import { useAppSelector } from '../store'
import { RootState } from '@reduxjs/toolkit/query'
export const getProfileFromLS = () => {
  const result = localStorage.getItem('persist:root')
  return result ? JSON.parse(result) : null
}
export interface AppContextInterface {
  isAuthenticated?: boolean
  setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>
  profile: any | null
  setProfile: React.Dispatch<React.SetStateAction<any | null>>
}
export const initialAppContext: AppContextInterface = {
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
}
export const AppContext: React.Context<AppContextInterface> = createContext<AppContextInterface>(initialAppContext)


export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<any | null>(initialAppContext.profile)
  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
