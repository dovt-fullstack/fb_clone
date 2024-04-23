import React,{ InputHTMLAttributes, useEffect, useState } from 'react'

import { AiOutlineSend } from 'react-icons/ai'
import fileIcons from "../../../../assets/attach-file.png"
interface DebouncedInputProps {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
}

export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])
  return (
    <>

    <div className='relative w-full cursor-pointer'>

      <div className='absolute inset-y-0 left-3 flex items-center pl-3 pointer-events-none'>
        <AiOutlineSend className='w-4 h-4' />
      </div>
      <input
        type='text'
        className='w-full block p-1.5 pl-16 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-[#D3B673] focus:border-[#D3B673]'
        id='message-box'
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      </div>
      </>
  )
}
