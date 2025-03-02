import * as models from '../models/_index.js';

export const getStatus = (req, res, next) => {
	if (req.session.isLoggedIn) {
		return res.json({isLoggedIn: true});
	}
	res.json({isLoggedIn: false});
};
export const postSignup = (req, res, next) => {
	console.log(`➡️➡️➡️ called postSignup`);
	req.session.isLoggedIn = true;
	const {email, password, confirmedPassword, date} = req.body;

	models.User.findOne({where: {email}})
		.then((user) => {
			if (user) {
				return res
					.status(200)
					.json({type: 'signup', code: 303, message: 'Użytkownik już istnieje.'});
			}
			const newUser = models.User.create({
				RegistrationDate: date,
				PasswordHash: password,
				LastLoginDate: date,
				Email: email,
				Role: 'user',
				ProfilePictureSrcSetJSON: null,
			});

			return res.status(200).json({
				type: 'signup',
				code: 200,
				message: 'Zarejestrowano pomyślnie',
				user: newUser,
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({error: err.message});
		});
};
export const postLogin = (req, res, next) => {
	console.log(`➡️➡️➡️ called postLogin`);
	const {email, password, date} = req.body;

	models.User.findOne({where: {email}})
		.then((user) => {
			if (user) {
				return res
					.status(200)
					.json({type: 'login', code: 404, message: 'Użytkownik nie istnieje.'});
			}

			return res.status(200).json({
				type: 'login',
				code: 200,
				message: 'Zalogowano pomyślnie',
				user: user,
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({error: err.message});
		});
};
export const postLogout = (req, res, next) => {
	console.log('postLogout 1');

	req.session.destroy((err) => {
		console.log('postLogout');
		if (err) {
			return next(err);
		}
		res.clearCookie('session_CID');
		res.json({success: true});
	});
};
