## Business Tasks Shortcuts
- [feature](https://github.com/MMadejsza/yoganka.pl/issues/new?template=task_template.yml&labels=feature,yoganka&assignees=MMadejsza)
- [bug](https://github.com/MMadejsza/yoganka.pl/issues/new?template=bug_template.yml&labels=bug,yoganka&assignees=MMadejsza)

## Supervisor Tasks Shortcuts
- [task](https://github.com/MMadejsza/yoganka.pl/issues/new?template=dev_issue_template.yml&labels=Supervisor&assignees=MMadejsza)
- [documentation](https://github.com/MMadejsza/yoganka.pl/issues/new?template=dev_issue_template.yml&labels=Supervisor,documentation&assignees=MMadejsza)
  
## Dev Tasks Shortcuts
- [enhancement](https://github.com/MMadejsza/yoganka.pl/issues/new?template=task_template.yml&labels=enhancement&assignees=MMadejsza)

## Design Space:
[Design in Figma](https://www.figma.com/design/J03ewhnJpAB0Ohae4bJclh/Untitled?node-id=1-14&p=f&t=8kjRmwI8KuUSQ46t-0)
[Design on Miro](https://miro.com/welcomeonboard/T3ZpUGNpamhxemJJMklKdUt6OHpOeXl1UGc4YUpRaVQ1d0xSeWtnaGU3d0FxVlpEakFvZmNLMTVGVm0zcXVRQnwzNDU4NzY0NTk5MDcxMjMzODE3fDI=?share_link_id=883729976940)

## Future Files Structure:
/yoganka.pl  
├── /frontend                  // Frontend with Vite  
│   ├── /public                // Public files visible for browser  
│   │   ├── /imgs              // + icons etc.  
│   │   ├── favicon.ico        // Favicon  
│   │   └── index.html         // Main html for Vite  
│   ├── /src                   // Frontend source code  
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
│   ├── /utils                 // Helper functions  
│   ├── /public                // For public assets to send (if sending photos)  
│   ├── app.js                 // Main JS for Express  
│   ├── server.js              // Main JS running server  
│  
├── /assets                    // Shared assets for frontend and backend  
│   ├── /imgs                  // Images  
│   ├── /fonts                 // Fonts  
│   └── /uploads               // Uploaded files (users)  
│  
├── package.json               // Node.js dependencies and scripts  
├── .gitignore                 // Ignored files for Git  
└── README.md                  // Project documentation  
