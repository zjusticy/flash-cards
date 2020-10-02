import React from "react";
import renderer from "react-test-renderer";
// import configureStore from 'redux-mock-store'
// import { shallow } from 'enzyme';
// import toJson from 'enzyme-to-json';

import { render, cleanup, screen } from '@testing-library/react';

import Button from "../components/UI/Button/Button";

afterEach(cleanup);

// describe("Button", ()=> {

	it("Button changes the class when size changed 1", () => {
		const {getByRole} = render(
			<Button btnType="Success" size="Big" elementType="submit">
				Facebook
			</Button>
		);
		expect(getByRole('button').classList.contains('Big')).toBe(true);
	});

	it("Button changes the class when type changed 2", () => {
		const {getByRole} = render(
			<Button btnType="Success" size="Medium" elementType="submit">
				Facebook
			</Button>
		);
		expect(getByRole('button').classList.contains('Medium')).toBe(true);
	});

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
// });
