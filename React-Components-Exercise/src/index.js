import React from 'react';
import ReactDOM from 'react-dom';
import TitleBar from './TitleBar';
import './titleBar.css'

// ReactDOM.render(
//   <App />,
//   document.getElementById('root')
// );

let links = [
    ['/', 'Home'],
    ['about', 'About'],
    ['results', 'Results'],
    ['faq', 'FAQ']];

ReactDOM.render(
    <TitleBar title="Title Bar Problem" links={links} />,
    document.getElementById('head')
);
