// import { inverseTheme } from 'Utils';
import reset from "styled-reset";
import styledNormalize from "styled-normalize";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  ${styledNormalize}

* {
    box-sizing: border-box;
    /* color: white; */
  }

body {
    background: black;
  }

q {
    quotes: "“" "”" "‘" "’";
  }

  q:before {
    content: open-quote;
  }
  q:after {
    content: close-quote;
  }

  html {
    scroll-behavior: smooth;
  }

  body, select, button, input, textarea {
    font-family: monospace;
  }

hr {
    background-color: black;
    width: 100%;
    height: .1em;
    border-radius: 50%;
  }

  input {
    padding: 0.2em 0.9em;
    border: 2px solid white;
    border-radius: 0.2em;
    background: black;
    color: white;
  }

  input:hover {
    background-color: white;
    color: black;
  }

textarea {
    padding: 0.2em 0.9em;
    resize: none;
    border: none;
    border-radius: 0.2em;
    background-color: white;
    color: black;
  }

  ol {
    list-style-type: decimal;
  }
  ul {
    list-style-type: upper-latin;
  }

  ::-webkit-scrollbar {
    width: 0.8em;
    background: white;
    border-top-right-radius: 0.2em;
    border-bottom-right-radius: 0.2em;
  }

  ::-webkit-scrollbar-track {
    background: white;
    border: 0px solid black;
    border-radius: 1em;
    margin-right: 1em;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 1em;
    border-top-right-radius: 0.2em;
    border-bottom-right-radius: 0.2em;
    background: black;
  }
`;
