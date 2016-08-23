import babelPolyfil from 'babel-polyfill'
import {polyfill} from 'es6-promise'
polyfill();
import chai from 'chai'
import spies from 'chai-spies'
import middleware from '../lib'
import jwt from 'jsonwebtoken'

chai.use(spies);
chai.should();

const securityString = 'some security string';

describe('JSONWebtoken test', () => {
	let ctx = {},
		nextCalled = false;

	const next = async () => {
		nextCalled = true;
		return true;
	};

	beforeEach(() => {
		ctx = {
			state: {},
			throw: chai.spy((code) => {
				
			}),
			headers: {}
		};
		nextCalled = false;
	});

	it('Should throw 403', async () => {
		const jwtauth = middleware(securityString, true);
		await jwtauth(ctx, next);
		ctx.throw.should.have.been.called.with(403);
		nextCalled.should.to.be.eql(false);
	});

	it('Should call next and not set user to state', async () => {
		const jwtauth = middleware(securityString, false);
		await jwtauth(ctx, next);
		nextCalled.should.to.be.eql(true);
		ctx.throw.should.not.have.been.called();
		ctx.should.not.have.deep.property('user');
	});

	it('Should call next and set user to state', async () => {
		const jwtauth = middleware(securityString, false),
			token = jwt.sign(
	            {
	                login: 'test'
	            },
	            securityString
	        );
		ctx.headers = {
			authorization: `Bearer ${token}`
		};
		await jwtauth(ctx, next);
		nextCalled.should.to.be.eql(true);
		ctx.throw.should.not.to.have.been.called();
		ctx.should.have.deep.property('state.user.login').to.be.eql('test');
	});
})