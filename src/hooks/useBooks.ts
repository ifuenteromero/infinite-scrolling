import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import endpoints from '../services/endpoints';
import { inputTriggerLength } from '../utils/constants';

interface Book {
	key: string;
	title: string;
}

interface FetchItemsResponse<U> {
	docs: U[];
	numFound: number;
}

const useBooks = (query: string, pageLimit = 100) => {
	const shouldFetch = query.length >= inputTriggerLength;
	return useInfiniteQuery<FetchItemsResponse<Book>, Error>({
		queryKey: ['books', query],
		queryFn: shouldFetch
			? ({ pageParam, signal }) =>
					apiClient
						.get<FetchItemsResponse<Book>>(endpoints.books, {
							params: {
								q: query,
								page: pageParam,
								limit: pageLimit,
								fields: 'key,title,author_name',
							},
							signal,
						})
						.then((res) => res.data)
			: undefined,
		getNextPageParam: (lastPage, allPages) => {
			const currentPage = allPages.length;
			const currentResultsCount =
				(currentPage - 1) * pageLimit + lastPage.docs.length;
			const hasMore = currentResultsCount < lastPage.numFound;
			return hasMore ? currentPage + 1 : undefined;
		},
		initialPageParam: 1,
		retry: 3,
		staleTime: 24 * 60 * 60 * 1000, // 1 day
	});
};

export default useBooks;
