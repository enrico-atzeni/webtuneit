import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header', () => {
  render(<App />);
  const headerElement = screen.getByText(/web tune it - .+/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders audio device input', () => {
  render(<App />);
  const audioDeviceLabel = screen.getByText(/audio device/i);
  expect(audioDeviceLabel).toBeInTheDocument();
});
