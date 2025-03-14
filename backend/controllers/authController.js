import * as models from '../models/_index.js';
import bcrypt from 'bcryptjs';

export const getStatus = (req, res, next) => {
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
	console.log(`\n➡️➡️➡️ called postSignup`);
	const {email, password, confirmedPassword, date} = req.body;

	models.User.findOne({where: {email}})
		.then((user) => {
			if (user) {
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
		.catch((err) => {
			console.log('❌❌❌ Użytkownik już istnieje.');
			return res.status(409).json({
				confirmation: 0,
				type: 'signup',
				code: 409,
				message: err.message,
			});
		});
};
export const postLogin = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called postLogin`);
	const {email, password, date} = req.body;

	models.User.findOne({where: {email}})
		.then((user) => {
			if (!user) {
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
					console.log('\n❌❌❌ Password incorrect');
					throw new Error('Hasło nieprawidłowe.');
				}
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(404).json({
				type: 'login',
				code: 404,
				confirmation: 0,
				message: err.message,
			});
		});
};
export const postLogout = (req, res, next) => {
	console.log(`\n➡️➡️➡️ called postLogout`);

	req.session.destroy((err) => {
		console.log('postLogout');
		if (err) {
			return next(err);
		}
		res.clearCookie('session_CID');
		res.json({success: true});
	});
};
