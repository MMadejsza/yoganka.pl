import * as models from '../models/_index.js';
import {Sequelize, Op} from 'sequelize';

export const postLogin = (req, res, next) => {
	res.setHeader('Set-Cookie', 'loggedIn=true; Path=/; Max-Age=20');
	res.redirect('/admin-console/show-all-users');
};
