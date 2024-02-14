import {
	Fragment,
	MouseEventHandler,
	useCallback,
	useRef,
	useState,
} from 'react';
import './App.css';
import Icon from './components/Icon';
import useBooks from './hooks/useBooks';
import { inputTriggerLength } from './utils/constants';

const App = () => {
	const [query, setQuery] = useState('');
	const { data, fetchNextPage, hasNextPage, isFetching } = useBooks(query);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
	};

	const isLoading = isFetching && query.length >= inputTriggerLength;

	const observer = useRef<IntersectionObserver>();

	const lastBookElementRef = useCallback(
		(node: HTMLLIElement) => {
			if (isLoading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(([entry]) => {
				if (entry.isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			});
			if (node) observer.current.observe(node);
		},
		[isLoading, hasNextPage, fetchNextPage]
	);

	const clearText: MouseEventHandler<HTMLButtonElement> = () => setQuery('');

	return (
		<>
			<div className='search-input__container'>
				<label htmlFor='search-input'>Search books</label>
				<div className='search-input'>
					<button
						data-is-loading={isLoading}
						onClick={clearText}
						type='button'
						disabled={isLoading || query.length === 0}
						className='search-input__clear-button'
						title='Clear text'
					>
						<Icon iconName='IoClose' />
					</button>
					<input
						id='search-input'
						aria-label='Search'
						placeholder={`Type at least ${inputTriggerLength} letters`}
						className='search-input__input'
						value={query}
						type='text'
						onChange={handleSearch}
					/>
				</div>
			</div>
			<div className='book-list'>
				<ul>
					{data?.pages.map((page, index) => (
						<Fragment key={index}>
							{page.docs.map((book, bookIndex) => {
								const offset = 0;
								const isInfiniteScrollMarker =
									page.docs.length - offset === bookIndex + 1;
								const ref = isInfiniteScrollMarker
									? lastBookElementRef
									: undefined;
								return (
									<li ref={ref} key={book.key}>
										{book.title}
									</li>
								);
							})}
						</Fragment>
					))}
				</ul>
				{isLoading && <p>Loading ...</p>}
			</div>
		</>
	);
};

export default App;
