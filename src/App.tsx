import { useCallback, useRef, useState } from 'react';
import './App.css';
import useBooks from './hooks/useBooks';

const App = () => {
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const { books, isLoading, error, hasMore } = useBooks(query, page);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
		setPage(1);
	};

	const observer = useRef<IntersectionObserver>();

	const lastBookElementRef = useCallback(
		(node: HTMLLIElement) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(([entry]) => {
				if (entry.isIntersecting && hasMore) {
					setPage((prevPage) => prevPage + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, hasMore]
	);

	return (
		<>
			<input
				// placeholder='type at least 3 letters'
				className='searchInput'
				value={query}
				type='text'
				onChange={handleSearch}
			/>
			<div className='book-list'>
				<ul>
					{books.map((book, index) => {
						const offset = 10;
						const isInfiniteScrollMarker =
							books.length - offset === index + 1;
						const ref = isInfiniteScrollMarker
							? lastBookElementRef
							: undefined;

						return (
							<li ref={ref} key={book.key}>
								{book.title}
							</li>
						);
					})}
				</ul>
				{isLoading && <p>Loading ...</p>}
				{error && <p>error</p>}
			</div>
		</>
	);
};

export default App;
