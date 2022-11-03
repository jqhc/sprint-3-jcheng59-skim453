import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Repl, { REPL_History_accessible_name, REPL_History_Box_accessible_name, REPL_Input_Form_accessible_name, REPL_Input_Box_accessible_name } from '../Repl';
import { weatherFunc, getFunc, statsFunc, pokeFunc } from '../REPLFunctions';
import CommandProcessor from "../CommandProcessor";
import userEvent from '@testing-library/user-event';
// scrollIntoView not recognized by jest, so we define it as a dummy here to avoid errors
window.HTMLElement.prototype.scrollIntoView = function () { };

const Abc_CSV_Filepath: string =
    "/Users/justin/Desktop/CS32/sprint-3-jcheng59-skim453/test_data/abc.csv";

const Empty_CSV_Filepath: string = 
    "/Users/justin/Desktop/CS32/sprint-3-jcheng59-skim453/test_data/empty.csv";

let commandProcessor: CommandProcessor;
let inputBox: HTMLElement;

// creates the command processor needed for each Repl rendering.
beforeEach(() => {
    commandProcessor = new CommandProcessor(new Map([
        ["get", getFunc],
        ["stats", statsFunc],
        ["weather", weatherFunc]]));

    // test for User Story 4 - adding new command
    commandProcessor.addNewCommand("pokemon", pokeFunc);

    render(<Repl commandProcessor={commandProcessor} />);

    inputBox = screen.getByRole("textbox", { name: REPL_Input_Box_accessible_name });
})

// tests error message for nonexistent pokemon
test('pokemon for invalid pokemon', async () => {
    userEvent.type(inputBox, "pokemon nonexistentPokemon");
    userEvent.keyboard("{enter}");

    const outputText = await screen.findByRole("generic", 
        {name: "Error: PokeAPI couldn't find this Pokemon. Check your spelling!"});

    expect(outputText).toBeInTheDocument();
})

// tests response for valid pokemon (charizard)
test('pokemon for valid pokemon', async () => {
    userEvent.type(inputBox, "pokemon charizard");
    userEvent.keyboard("{enter}");

    const outputText = await screen.findByRole("generic",
        {name: "Output: Types: fire,flying. Base stats: HP - 78, Atk - 84, Def - 78, SpAtk - 109, SpDef - 85, Spd - 100"});
    
    expect(outputText).toBeInTheDocument();
})