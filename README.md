Given design for desktop:
https://miro.com/welcomeonboard/T3ZpUGNpamhxemJJMklKdUt6OHpOeXl1UGc4YUpRaVQ1d0xSeWtnaGU3d0FxVlpEakFvZmNLMTVGVm0zcXVRQnwzNDU4NzY0NTk5MDcxMjMzODE3fDI=?share_link_id=883729976940

Future files structure:
/your-project
├── /frontend                  // Frontend with Vite
│   ├── /public                // Public files visible for browser
│   │   ├── /imgs              // + icons etc.
│   │   ├── favicon.ico        // Favicon
│   │   └── index.html         // Main html for vite
│   ├── /src                   // Frontend source kod
│   │   ├── /components        // React Components
│   │   ├── /hooks             // React hooks (extra)
│   │   ├── /pages             // Pages for React Router
│   │   ├── /services          // For APIs like fetch from backend
│   │   ├── /utils             // + modules
│   │   ├── /styles            // CSS/SCSS
│   │   ├── App.jsx            // Main React Component
│   │   ├── index.jsx          // Main JS to render React
│   │   └── main.css           // Main CSS (until SCSS used)
│   └── vite.config.js         // Vite config
│
├── /backend                   // (Node.js/Express)
│   ├── /controllers           // Logic for HTTP (controllers)
│   ├── /routes                // Routes (Express)
│   ├── /models                // Models for communication with DB
│   ├── /middleware            // Middleware for Express (authorization)
│   ├── /services              // Business logic + DB connection 
│   ├── /utils                 
│   ├── /public                // For public assets to send (if will be sending photos)
│   ├── app.js                 // Main js for Express
│   ├── server.js              // Main js running server   
│
├── /assets                    // for back and fronted
│   ├── /imgs                  
│   ├── /fonts                 
│   └── /uploads               // Uploaded files (users)
│
├── package.json               
├── .gitignore                 
└── README.md                  
