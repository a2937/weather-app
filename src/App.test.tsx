import React from 'react';
import { render, screen,queryByAttribute, waitFor  } from '@testing-library/react';
import App from './App';

const getById = queryByAttribute.bind(null, 'id');

test('has a loading element', async () => {
  const dom = render(<App />);
  const loadingElement = getById(dom.container, "loading"); 
  expect(loadingElement).toBeInTheDocument();
});
