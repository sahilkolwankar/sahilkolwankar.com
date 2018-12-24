'use strict';

// List of frameworks, compilers, and tools this project uses:
// 1. React
// 2. Yarn
// 3. Live Server package
// 4. Babel (To compile JSX into JavaScript).

console.log('App.js is running!');

var template = React.createElement(
    'h1',
    null,
    'My Premium Blog'
);

var templateTwo = React.createElement(
    'div',
    null,
    React.createElement(
        'h1',
        null,
        'Sahil Kolwankar'
    ),
    React.createElement(
        'p',
        null,
        'Age: 24'
    ),
    React.createElement(
        'p',
        null,
        'Location: New York'
    )
);

var appRoot = document.getElementById('app');

// ReactDOM.render() takes 2 arguments.
// 1. The React element you wish to render.
// 2. The HTML element where you want your React element to render.
ReactDOM.render(templateTwo, appRoot);
