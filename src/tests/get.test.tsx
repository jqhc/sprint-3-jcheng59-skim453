import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Repl, { REPL_History_accessible_name, REPL_History_Box_accessible_name, REPL_Input_Form_accessible_name, REPL_Input_Box_accessible_name } from '../Repl';
import { weatherFunc, getFunc, statsFunc, pokeFunc } from '../REPLFunctions';
import CommandProcessor from "../CommandProcessor";
import userEvent from '@testing-library/user-event';
import { act } from "react-dom/test-utils";
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

    render(<Repl commandProcessor={commandProcessor} />);

    inputBox = screen.getByRole("textbox", { name: REPL_Input_Box_accessible_name });
})

// tests for error message when get has no arguments.
test('entering in a get command followed by no other arg', async () => {
    userEvent.type(inputBox, "get");
    userEvent.keyboard("{enter}");

    const outputBox = await screen.findByRole("generic", { name: REPL_History_Box_accessible_name });
    expect(outputBox.className).toBe("history-box error-box");

    const output = await screen.findByRole("generic", 
        { name: "Error: 'get' requires one input: the filepath of your CSV." });

    expect(output).toBeInTheDocument();
});

// tests for error message when get has an invalid filepath.
test('get invalid filepath,', async () => {
    userEvent.type(inputBox, "get nonexistentFile");
    userEvent.keyboard("{enter}");

    const outputBox = await screen.findByRole("generic", { name: REPL_History_Box_accessible_name });
    expect(outputBox.className).toBe("history-box error-box");

    const output = screen.findByRole("generic", { name: "Output: File 'nonexistentFile' not found." });
    expect(output).toBeInTheDocument;
});

// get on an empty csv
test('get empty csv', async () => {
    userEvent.type(inputBox, "get " + Empty_CSV_Filepath);
    userEvent.keyboard("{enter}");

    const outputBox = await screen.findByRole("generic", { name: REPL_History_Box_accessible_name });
    expect(outputBox.className).toBe("history-box response-box");

    const outputCSV = await screen.findByRole("generic", {name: "Output: . END CSV."});
    expect(outputCSV).toBeInTheDocument();
})

// tests for get displaying valid csv
test('get valid csv display parsed csv', async () => {
    userEvent.type(inputBox, "get " + Abc_CSV_Filepath);
    userEvent.keyboard("{enter}");

    const outputBox = await screen.findByRole("generic", { name: REPL_History_Box_accessible_name });
    expect(outputBox.className).toBe("history-box response-box");

    // testing aria label
    const outputCSV = await screen.findByRole("generic",
        { name: "Output: abc,abc,abc,abc. END ROW. abc,abc,abc,abc. END ROW. abc,abc,abc,abc. END CSV." })
    expect(outputCSV).toBeInTheDocument();

    // testing table
    expect(outputBox.hasChildNodes()).toBe(true);
    const outputCommand = outputBox.lastElementChild as HTMLElement;
    expect(outputCommand.hasChildNodes()).toBe(true);
    const outputTable = outputCommand.lastElementChild as HTMLElement;
    
    expect(outputTable.className).toBe("getcsv-table-div");

    const innerHTML = 
        `<table class=\"getcsv-table\">
            <tbody>
                <tr class=\"getcsv-table-row\">
                    <td class=\"getcsv-table-entry\">abc</td>
                    <td class=\"getcsv-table-entry\">abc</td>
                    <td class=\"getcsv-table-entry\">abc</td>
                    <td class=\"getcsv-table-entry\">abc</td>
                </tr>
                <tr class=\"getcsv-table-row\">
                    <td class=\"getcsv-table-entry\">abc</td>
                    <td class=\"getcsv-table-entry\">abc</td>
                    <td class=\"getcsv-table-entry\">abc</td>
                    <td class=\"getcsv-table-entry\">abc</td>
                </tr>
                <tr class=\"getcsv-table-row\">
                    <td class=\"getcsv-table-entry\">abc</td>
                    <td class=\"getcsv-table-entry\">abc</td>
                    <td class=\"getcsv-table-entry\">abc</td>
                    <td class=\"getcsv-table-entry\">abc</td>
                </tr>
            </tbody>
        </table>`

    expect(outputTable.innerHTML.replace(/\s/g,"")).toBe(innerHTML.replace(/\s/g,""));

})
