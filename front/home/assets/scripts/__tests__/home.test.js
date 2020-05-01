'use strict'

import Home from '../home'

const getInstance = () => {
	const home = new Home()
	return home
}
let home

beforeEach(() => {
	home = getInstance()
})

describe('Home init', () => {
	it('should call the init function', () => {
		home.init = jest.fn()

		home.init()

		expect(home.init).toHaveBeenCalled()
	})
})
