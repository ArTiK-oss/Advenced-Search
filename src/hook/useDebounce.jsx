import { useEffect, useState } from 'react'

export default function useDebounce(value) {
	const [state, setState] = useState(value)
	useEffect(() => {
		const timer = setTimeout(() => {
			setState(value)
		}, 500)
		return () => {
			clearTimeout(timer)
		}
	}, [value])

	return state
}
