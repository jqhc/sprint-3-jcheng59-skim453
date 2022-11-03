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

    render(<Repl commandProcessor={commandProcessor} />);

    inputBox = screen.getByRole("textbox", { name: REPL_Input_Box_accessible_name });
})

//weather test for when the weather command is entered followed by no arguments

test('entering in a weather command followed by no args', async () => {
    userEvent.type(inputBox, "weather");
    userEvent.keyboard("{enter}");

    const outputBox = await screen.findByRole("generic", { name: REPL_History_Box_accessible_name });
    expect(outputBox.className).toBe("history-box error-box");

    const output = await screen.findByRole("generic", 
        { name: "Error: 'weather' requires two inputs: the latitude and the longitude." });

    expect(output).toBeInTheDocument();
});

//weather test for when the weather command is entered followed by two invlaid inputs

test('entering weather command with two invalid inputs', async () => {
    userEvent.type(inputBox, "weather bla bla");
    userEvent.keyboard("{enter}");

    const outputBox = await screen.findByRole("generic", { name: REPL_History_Box_accessible_name });
    expect(outputBox.className).toBe("history-box error-box");

    const output = await screen.findByRole("generic", 
        { name: "Error: Latitude and longitude values should be numbers." });

    expect(output).toBeInTheDocument();
});

//weather test for when the weather command is entered followed by two invlaid coordinates

test('entering in a weather command followed by two invalid coordinates', async () => {
    userEvent.type(inputBox, "weather 1000 1000");
    userEvent.keyboard("{enter}");

    const outputBox = await screen.findByRole("generic", { name: REPL_History_Box_accessible_name });
    expect(outputBox.className).toBe("history-box error-box");

    const output = await screen.findByRole("generic", 
        { name: "Error: Invalid latitude and longitude coordinates. Latitude ranges from -90 to 90 and longitude ranges from -180 to 180." });

    expect(output).toBeInTheDocument();
});

//weather test for when the weather command is entered followed by two invlaid coordinates outside the U.S.

test('entering in a weather command followed by two invalid coordinates outside the U.S.', async () => {
    userEvent.type(inputBox, "weather 50 50");
    userEvent.keyboard("{enter}");

    const outputBox = await screen.findByRole("generic", { name: REPL_History_Box_accessible_name });
    expect(outputBox.className).toBe("history-box error-box");

    const output = await screen.findByRole("generic", 
        { name: "Error: The National Weather Service could not provide weather information for these coordinates. Try a location in the United States." });

    expect(output).toBeInTheDocument();
});

//weather test for when the weather command is entered followed two valid coordinates

test('entering in a weather command followed by two valid coordinates', async () => {
    userEvent.type(inputBox, "weather 40 -80");
    userEvent.keyboard("{enter}");

    const outputBox = await screen.findByRole("generic", { name: REPL_History_Box_accessible_name });
    expect(outputBox.className).toBe("history-box response-box");

    const output = await screen.findByRole("generic", 
        { name: /Output: The temperature at 40.0, -80.0 is/});

    expect(output).toBeInTheDocument();
});