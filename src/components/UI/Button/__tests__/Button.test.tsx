import React from "react";
// import renderer from "react-test-renderer";
// import configureStore from 'redux-mock-store'
// import { shallow } from 'enzyme';
// import toJson from 'enzyme-to-json';

import { render, cleanup } from "@testing-library/react";

import Button from "../Button";

afterEach(cleanup);

describe("Button", () => {
  it("renders correctly", () => {
    const { asFragment } = render(
      <Button btnType="Success" size="Big" elementType="submit">
        Facebook
      </Button>
    );
    // expect(getByRole("button").classList.contains("Big")).toBe(true);
    // expect(getByRole("button").textContent).toEqual("Facebook");

    expect(asFragment()).toMatchSnapshot();
  });

  // it("Button changes the class when type changed 2", () => {
  //   const { getByRole } = render(
  //     <Button btnType="Success" size="Medium" elementType="submit">
  //       Facebook
  //     </Button>
  //   );
  //   expect(getByRole("button").classList.contains("Medium")).toBe(true);
  // });

  // it("Button changes the class when type changed 3", () => {
  //   const { getByRole } = render(
  //     <Button btnType="Success" size="Small" elementType="submit">
  //       Facebook
  //     </Button>
  //   );
  //   expect(getByRole("button").classList.contains("Small")).toBe(true);
  // });

  // it("Button changes the class when type changed", () => {
  // 	render(
  // 		<Button btnType="Success" size="Medium" elementType="submit">
  // 			Facebook
  // 		</Button>
  // 	);
  // 	expect(getByRole('button').classList.contains('Medium')).toBe(true);
  // });

  // // manually trigger the callback
  // tree.props.onMouseLeave();
  // // re-rendering
  // tree = component.toJSON();
  // expect(tree).toMatchSnapshot();
});
