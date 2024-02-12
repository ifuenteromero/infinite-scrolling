import { useEffect, useState } from 'react';
import apiClient, { AxiosError, CanceledError } from '../services/apiClient';
import endpoints from '../services/endpoints';

interface Book {
	key: string;
	title: string;
}

interface FetchItemsResponse<U> {
	docs: U[];
	numFound: number;
}

const useBooks = (query: string, page: number, pageLimit = 100) => {
	const [books, setBooks] = useState<Book[]>([]);
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setLoading(true);
		setError('');
		const controller = new AbortController();
		apiClient
			.get<FetchItemsResponse<Book>>(endpoints.books, {
				params: {
					q: query,
					page,
					limit: pageLimit,
					fields: 'key,title,author_name',
				},
				signal: controller.signal,
			})
			.then(({ data }) => {
				setBooks((previousData) =>
					page === 1 ? data.docs : [...previousData, ...data.docs]
				);
				const currentResultsCount =
					(page - 1) * pageLimit + data.docs.length;
				setHasMore(currentResultsCount < data.numFound);
				setLoading(false);
			})
			.catch((error: AxiosError) => {
				if (error instanceof CanceledError) return;
				setLoading(false);
				setError(error.message);
			});
		return () => controller.abort();
	}, [query, page, pageLimit]);
	return { books, isLoading, error, hasMore };
};

export default useBooks;
