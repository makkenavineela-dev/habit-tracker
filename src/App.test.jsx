import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
    it('renders without crashing', () => {
        // A basic smoke test. Ensures the app initializes with proper router context.
        const { container } = render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        expect(container).toBeInTheDocument();
    });
});
