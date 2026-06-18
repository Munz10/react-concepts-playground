import { forwardRef, useImperativeHandle, useRef } from 'react'

// forwardRef: lets the parent pass a ref into this component.
// useImperativeHandle: controls exactly what the parent can do with that ref —
// instead of getting the raw DOM node, the parent gets a clean { focus, clear } API.
export const SearchInput = forwardRef(function SearchInput(
  { value, onChange, placeholder },
  ref,
) {
  const inputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus()
    },
    clear() {
      onChange('')
      inputRef.current?.focus()
    },
  }))

  return (
    <input
      ref={inputRef}
      className="search-input"
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
})
