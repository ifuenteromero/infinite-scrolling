import { render, screen } from '@testing-library/react';
import App from '../App';

describe('test suite', () => {
	it('test', () => {
		render(<App />);
		const input = screen.getByRole('textbox', { name: 'Search' });
		expect(input).toBeInTheDocument();
	});
});
