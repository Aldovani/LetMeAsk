import { useContext } from 'react'
import { ThemeModeContext } from '../context/ThemeModeContext'


export function useTheme() {
  const value =useContext(ThemeModeContext)

  return value;
}