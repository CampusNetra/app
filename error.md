Uncaught DOMException: The operation is insecure.
    push router.js:388
    useNavigateUnstable index.js:245
    StudentWelcome StudentWelcome.jsx:17
    React 8
    workLoop scheduler.development.js:266
    flushWork scheduler.development.js:239
    performWorkUntilDeadline scheduler.development.js:533
    require_scheduler_development scheduler.development.js:571
    require_scheduler_development react-dom-DoAJ_auL.js:394
    __commonJSMin chunk-BoAXSpZd.js:8
    require_scheduler index.js:6
    __commonJSMin chunk-BoAXSpZd.js:8
    require_react_dom_development React
    require_react_dom_development react-dom-DoAJ_auL.js:17253
    __commonJSMin chunk-BoAXSpZd.js:8
    require_react_dom React
    __commonJSMin chunk-BoAXSpZd.js:8
    require_client React
    __commonJSMin chunk-BoAXSpZd.js:8
    <anonymous> react-dom_client.js:25
router.js:388:7

The above error occurred in the <StudentWelcome> component:

StudentWelcome@http://localhost:5173/src/modules/student/StudentWelcome.jsx?t=1775464592478:24:19
RenderedRoute@http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=a30e33d0:3332:42
Routes@http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=a30e33d0:3775:31
Router@http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=a30e33d0:3723:158
BrowserRouter@http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=a30e33d0:4402:47
App

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries. 2 <anonymous code>:1:147461
