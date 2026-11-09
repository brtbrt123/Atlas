import { render, screen } from '@testing-library/react-native';

import Index from '../../app/index';

// Smoke test proving Jest + jest-expo + RNTL 14 run (FND-07). Replaced by real tests in later tasks.
describe('foundation placeholder route', () => {
  it('renders the ATLAS wordmark', async () => {
    await render(<Index />);
    expect(screen.getByText('ATLAS')).toBeTruthy();
  });
});
