import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Repl, { REPL_History_accessible_name, REPL_History_Box_accessible_name, REPL_Input_Form_accessible_name, REPL_Input_Box_accessible_name } from '../Repl';
import { weatherFunc, getFunc, statsFunc, pokeFunc } from '../REPLFunctions';
import CommandProcessor from "../CommandProcessor";
import userEvent from '@testing-library/user-event';

/**
 * IMPORTANT: for the stats test, the API server from the backend must be reset inorder for these
 * tests to run properly and accurately. We are aware that if these tests are running in conjunction with
 * a live server then there may be conflicts with previous commands which were typed in which results in 
 * tests running some of the times and failing at other times. 
 */

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

// // test stats before loading csv - should give error message
// test('stats command before loading csv', async () => {
//     userEvent.type(inputBox, "stats");
//     userEvent.keyboard("{enter}");

//     const outputBox = await screen.findByRole("generic", {name: REPL_History_Box_accessible_name});

//     expect(outputBox.className).toBe("history-box error-box");
// })

// test stats on empty csv
test('stats command on empty csv', async () => {
    userEvent.type(inputBox, "get " + Empty_CSV_Filepath);
    userEvent.keyboard("{enter}");

    const outputBox = await screen.findByRole("generic", { name: REPL_History_Box_accessible_name });
    expect(outputBox.className).toBe("history-box response-box");

    userEvent.type(inputBox, "stats");
    userEvent.keyboard("{enter}");

    const statsOutputText = await screen.findByRole("generic", {name: "Output: 0 rows, 0 columns."});
    expect(statsOutputText).toBeInTheDocument();
})

// test stats on regular csv
test('stats command after loading csv', async () => {
    userEvent.type(inputBox, "get " + Abc_CSV_Filepath);
    userEvent.keyboard("{enter}");

    const outputBox = await screen.findByRole("generic", { name: REPL_History_Box_accessible_name });
    expect(outputBox.className).toBe("history-box response-box");

    userEvent.type(inputBox, "stats");
    userEvent.keyboard("{enter}");

    const statsOutputText = await screen.findByRole("generic", {name: "Output: 3 rows, 4 columns."});
    expect(statsOutputText).toBeInTheDocument();
})

// test stats on regular csv
test('stats command after loading csv', async () => {
    userEvent.type(inputBox, "get " + Abc_CSV_Filepath);
    userEvent.keyboard("{enter}");
    let outputBox = await screen.findByRole("generic", { name: REPL_History_Box_accessible_name });
    expect(outputBox.className).toBe("history-box response-box");

    userEvent.type(inputBox, "get" + Empty_CSV_Filepath );
    userEvent.keyboard("{enter}");

    outputBox = await screen.findByRole("generic", { name: REPL_History_Box_accessible_name });
    expect(outputBox.className).toBe("history-box response-box");

    userEvent.type(inputBox, "stats");
    userEvent.keyboard("{enter}");

    const statsOutputText = await screen.findByRole("generic", {name: "Output: 0 rows, 0 columns."});
    expect(statsOutputText).toBeInTheDocument();
})

