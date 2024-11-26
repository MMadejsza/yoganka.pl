import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import '/src/styles/main.scss';

const entryPoint = document.getElementById('root');
ReactDOM.createRoot(entryPoint).render(<App />);
