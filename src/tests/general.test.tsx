import React from "react";
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Repl, {REPL_History_accessible_name,REPL_History_Box_accessible_name,REPL_Input_Form_accessible_name,REPL_Input_Box_accessible_name} from '../Repl';
import { weatherFunc, getFunc, statsFunc, pokeFunc } from '../REPLFunctions';
import CommandProcessor from "../CommandProcessor";
import userEvent from '@testing-library/user-event';
// scrollIntoView not recognized by jest, so we define it as a dummy here to avoid errors
window.HTMLElement.prototype.scrollIntoView = function() {};


const TEST_CSV_FILEPATH: string = 
    "/Users/justin/Desktop/CS32/sprint-3-jcheng59-skim453/test_data/abc.csv";

let commandProcessor: CommandProcessor;
let inputBox: HTMLElement;

// creates the command processor needed for each Repl rendering.
beforeEach(() => {
    commandProcessor = new CommandProcessor(new Map([
        ["get", getFunc],
        ["stats", statsFunc],
        ["weather", weatherFunc]]));

    render(<Repl commandProcessor={commandProcessor} />);

    inputBox = screen.getByRole("textbox", { name: REPL_Input_Box_accessible_name });
})

// checks that the input box and repl history elements are present in doc
// upon initial rendering.
test('basic elements present upon initial render', () => {
    // expect input box to be in document
    expect(inputBox).toBeInTheDocument();
    // expect repl history to be in document
    expect(screen.getByRole("generic", {name: REPL_History_accessible_name})).toBeInTheDocument();
});

// checks for case where an invalid (i.e. non-registered) command is inputted.
// also checking that history boxes are correctly rendered.
test('basic invalid command', async () => {
    userEvent.type(inputBox, "bla");
    userEvent.keyboard("{enter}");

    const outputBox = await screen.findByRole("generic", {name: REPL_History_Box_accessible_name});
    expect(outputBox.className).toBe("history-box error-box");

    expect(outputBox.hasChildNodes()).toBe(true);
    expect((outputBox.firstElementChild as HTMLElement).className).toBe("history-text command");
    expect((outputBox.lastElementChild as HTMLElement).className).toBe("history-text output");

    const commandText = screen.getByRole("generic", {name: "Command: bla"});
    const outputText = screen.getByRole("generic", {name: "Error: Not a valid command."});

    expect(commandText).toBeInTheDocument();
    expect(outputText).toBeInTheDocument();
});
