import { useEffect, useState, useRef } from 'react'

export default function useFetch(url, debounceValue=null) {
	const casheRef = useRef(new Map())
	const [data, setData] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	useEffect(() => {
		if (!url) return
		if (casheRef.current.has(debounceValue)) {
			setLoading(false)
			setError(null)
			setData(casheRef.current.get(debounceValue))
			return
		}
		const controller = new AbortController()
		const { signal } = controller
		let isCatched = false
		const timer = setTimeout(() => {
			controller.abort()
		}, 10000)
		async function fetching() {
			try {
				setLoading(true)
				setError(null)

				const response = await fetch(url, { signal })

				clearTimeout(timer)

				if (!response.ok) {
					throw new Error(`Ошибка HTTP: ${response.status}`)
				}

				const fetchData = await response.json()
				if (isCatched) return
				setData(fetchData)
				console.log(fetchData)
				if (debounceValue.trim() && fetchData.products.length > 0) casheRef.current.set(debounceValue, fetchData)
			} catch (err) {
				setData(null)
				if (err.name === 'AbortError') {
					console.log('Запрос штатно отменен (тайм-аут или новый ввод)')
					return
				} else {
					setError(err.message)
				}
			} finally {
				setLoading(false)
			}
		}

		fetching()

		return () => {
			controller.abort()
			clearTimeout(timer)
			isCatched = true
		}
	}, [url, debounceValue])

	return [data, error, loading]
}

