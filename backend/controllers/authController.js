import * as models from '../models/_index.js';
import bcrypt from 'bcryptjs';
import {errorCode, log, catchErr} from './_controllers.js';
let errCode = errorCode;

export const getStatus = (req, res, next) => {
	const controllerName = 'getStatus';
	log(controllerName);
	console.log(`\n✅✅✅ getStatus`, {
		isLoggedIn: res.locals.isLoggedIn || false,
		role: res.locals.role,
		token: res.locals.csrfToken,
	});
	return res.status(200).json({
		isLoggedIn: res.locals.isLoggedIn || false,
		role: res.locals.role,
		token: res.locals.csrfToken,
	});
};
export const postSignup = (req, res, next) => {
	const controllerName = 'postSignup';
	log(controllerName);

	const {email, password, confirmedPassword, date} = req.body;

	models.User.findOne({where: {email}})
		.then((user) => {
			if (user) {
				errCode = 409;
				throw new Error('Użytkownik już istnieje.');
			}

			// it returns the promise
			return bcrypt
				.hash(password, 12)
				.then((passwordHashed) => {
					return models.User.create({
						RegistrationDate: date,
						PasswordHash: passwordHashed,
						LastLoginDate: date,
						Email: email,
						Role: 'user',
						ProfilePictureSrcSetJSON: null,
					});
				})
				.then((newUser) => {
					return res.status(200).json({
						type: 'signup',
						code: 200,
						confirmation: 1,
						message: '✅ Zarejestrowano pomyślnie',
					});
				});
		})
		.catch((err) => catchErr(err, controllerName, {type: 'signup', code: 409}));
};
export const postLogin = (req, res, next) => {
	const controllerName = 'postLogin';
	log(controllerName);

	const {email, password, date} = req.body;

	models.User.findOne({where: {email}})
		.then((user) => {
			if (!user) {
				errCode = 404;
				console.log("\n❌❌❌ User doesn't exist");
				throw new Error('Użytkownik nie istnieje.');
			}
			user.update({LastLoginDate: date});
			return user;
		})
		.then((fetchedUser) => {
			if (!fetchedUser) {
				return;
			}
			// regardless match or mismatch catch takes only if something is wrong with bcrypt itself. otherwise it goes to the next block with promise as boolean
			bcrypt.compare(password, fetchedUser.PasswordHash).then((doMatch) => {
				if (doMatch) {
					console.log('match');
					req.session.isLoggedIn = true;
					req.session.user = fetchedUser;
					req.session.role = fetchedUser.Role.toUpperCase();
					return res.status(200).json({
						type: 'login',
						code: 200,
						confirmation: 1,
						message: 'Zalogowano pomyślnie',
					});
				} else {
					errCode = 400;
					console.log('\n❌❌❌ Password incorrect');
					throw new Error('Hasło nieprawidłowe.');
				}
			});
		})
		.catch((err) => catchErr(err, controllerName, {type: 'signup', code: 404}));
};
export const postLogout = (req, res, next) => {
	const controllerName = 'postLogout';
	log(controllerName);

	req.session.destroy((err) => {
		console.log('postLogout');
		if (err) {
			return next(err);
		}
		res.clearCookie('session_CID');
		res.json({success: true});
	});
};
