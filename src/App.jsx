
import { useEffect, useState } from 'react'
import useDebounce from './hook/useDebounce'
import useFetch from './hook/useFetch'
import { useSearchParams } from 'react-router-dom'
export default function App() {
	const [searchParams , setSearchParams] = useSearchParams()
	const initalQuery = searchParams.get('q') || ''
	const [inputState, setInputState] = useState(initalQuery)
	const debounceValue = useDebounce(inputState)
	const [data, error, loading] = useFetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(debounceValue)}`,debounceValue,)
	
	useEffect(() => {
		if (!inputState.trim()) {
			setSearchParams({})
			return
		}
		setSearchParams({ q: inputState })
	}, [inputState, setSearchParams])
	return (
		<div
			style={{
				padding: '20px',
				maxWidth: '600px',
				margin: '0 auto',
				fontFamily: 'sans-serif',
			}}
		>
			<h2>🔍 Поиск товаров в реальном времени</h2>

			{/* Поле ввода */}
			<input
				type='text'
				value={inputState}
				onChange={e => setInputState(e.target.value)}
				placeholder='Начните вводить название (например, phone, watch)...'
				style={{
					width: '100%',
					padding: '12px',
					fontSize: '16px',
					boxSizing: 'border-box',
					borderRadius: '6px',
					border: '1px solid #ccc',
				}}
			/>

			{/* Состояние загрузки */}
			{loading && (
				<p style={{ color: '#0066cc', marginTop: '15px' }}>
					⏳ Загрузка данных...
				</p>
			)}

			{/* Состояние ошибки (тайм-аут или сбой сети) */}
			{error && (
				<p style={{ color: '#cc0000', marginTop: '15px' }}>❌ {error}</p>
			)}

			{/* Вывод списка товаров, когда данные получены */}
			{data && data.products && (
				<div style={{ marginTop: '20px' }}>
					<p style={{ color: '#666', fontSize: '14px' }}>
						Найдено товаров: {data.total}
					</p>

					<ul style={{ listStyle: 'none', padding: 0 }}>
						{data.products.length === 0 ? (
							<p>По вашему запросу ничего не найдено</p>
						) : (
							data.products.map(product => (
								<li
									key={product.id}
									style={{
										padding: '12px',
										marginBottom: '8px',
										border: '1px solid #e0e0e0',
										borderRadius: '6px',
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										backgroundColor: '#f9f9f9',
									}}
								>
									<span>{product.title}</span>
									<strong style={{ color: '#2e7d32' }}>${product.price}</strong>
								</li>
							))
						)}
					</ul>
				</div>
			)}
		</div>
	)
}
