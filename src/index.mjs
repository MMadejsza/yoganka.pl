/* Import dependencies */
import express from 'express';
import session from 'express-session';
import {} from 'module';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';

/* Create express instance */
const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* Add form data middleware */
app.use(express.urlencoded({extended: true}));

// Integrate Pug with Express
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));
/* Add form data middleware */
app.use(express.urlencoded({extended: true}));

app.use(
	session({
		secret: 'verysecretkey',
		resave: false,
		saveUninitialized: true,
		cookie: {secure: false},
	}),
);

// Serve assets from 'static' folder
app.use(express.static('static'));

// Serve JS files from the 'services' directory
app.get('/services/:filename', (req, res) => {
	const options = {
		root: path.join(__dirname, 'services'),
		headers: {
			'Content-Type': 'application/javascript',
		},
	};
	res.sendFile(req.params.filename, options, (err) => {
		if (err) {
			res.status(404).send('File not found!');
		}
	});
});

// Landing route
app.get('/', (req, res) => {
	res.render('index');
});
// About route
app.get('/about', (req, res) => {
	res.render('about');
});
// stocks route
app.get('/stocks', (req, res) => {
	res.render('stocks');
});
// watchList route
app.get('/watchList', (req, res) => {
	res.render('watchList');
});
// portfolio route
app.get('/portfolio', (req, res) => {
	res.render('portfolio');
});

// Login route
app.get('/login', (req, res) => {
	res.render('login');
});

// Run server!
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
