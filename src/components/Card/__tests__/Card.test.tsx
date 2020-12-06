import React from "react";
// import renderer from "react-test-renderer";
// import configureStore from 'redux-mock-store'
// import { shallow } from 'enzyme';
// import toJson from 'enzyme-to-json';

import { render, cleanup } from "@testing-library/react";

import Card from "../Card";

afterEach(cleanup);

describe("Card", () => {
  it("renders correctly", () => {
    const { asFragment } = render(
      <Card active index={0} title="Title" front="hello" clicked={() => {}} />
    );
    // expect(getByRole("button").classList.contains("Big")).toBe(true);
    // expect(getByRole("button").textContent).toEqual("Facebook");

    expect(asFragment()).toMatchSnapshot();
  });
});
