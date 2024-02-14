import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import App from '../App';
const queryClient = new QueryClient();

describe('test suite', () => {
	it('test', () => {
		render(
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		);
		const input = screen.getByRole('textbox', { name: 'Search' });
		expect(input).toBeInTheDocument();
	});
});
