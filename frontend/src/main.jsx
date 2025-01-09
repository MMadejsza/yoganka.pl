import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'material-symbols';
import '/src/styles/main.scss';

function loadFontAwesome() {
	const script = document.createElement('script');
	script.src = 'https://kit.fontawesome.com/4622d99ad4.js';
	script.crossOrigin = 'anonymous';
	script.async = true;
	document.body.appendChild(script);
}
loadFontAwesome();

const entryPoint = document.getElementById('root');
ReactDOM.createRoot(entryPoint).render(<App />);
