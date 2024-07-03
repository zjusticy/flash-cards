import React from 'react';
// import renderer from "react-test-renderer";
// import configureStore from 'redux-mock-store'
// import { shallow } from 'enzyme';
// import toJson from 'enzyme-to-json';
import { afterEach, describe, it, expect } from 'vitest';

import { render, cleanup } from '@testing-library/react';

import Modal from '../modal';

afterEach(cleanup);

describe('Button', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <Modal show modalClosed={() => {}}>
        Facebook
      </Modal>
    );
    // expect(getByRole("button").classList.contains("Big")).toBe(true);
    // expect(getByRole("button").textContent).toEqual("Facebook");

    expect(asFragment()).toMatchSnapshot();
  });
});
