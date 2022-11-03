import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import Repl from './Repl';
import { weatherFunc, getFunc, statsFunc, pokeFunc } from './REPLFunctions';
import CommandProcessor from "./CommandProcessor";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// sets up command processor, which processes input commands into output.
// new commands can be registered here.
const commandProcessor: CommandProcessor = new CommandProcessor(new Map([
  ["weather", weatherFunc],
  ["get", getFunc],
  ["stats", statsFunc],
  ["pokemon", pokeFunc]]));

root.render(
  <React.StrictMode>
    <div id="header" aria-label="Website header">
      <p id="header-text"><strong>Justin and Sam's REPL</strong></p>
      <hr id="header-separator"/>
    </div>
    <Repl commandProcessor={commandProcessor}/>
  </React.StrictMode>
);