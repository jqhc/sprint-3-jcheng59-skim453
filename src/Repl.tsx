import React, { useState, useRef, useEffect } from 'react';
import CommandProcessor from "./CommandProcessor";
import './styles/repl.css';

export const REPL_History_accessible_name: string = "Repl history";
export const REPL_History_Box_accessible_name: string = "Repl history box";
export const REPL_Input_Form_accessible_name: string = "Repl input form";
export const REPL_Input_Box_accessible_name: string = "Repl text input box";

interface HistoryBoxProps {
  isValid: boolean;
  commandMessage: string;
  outputMessage: JSX.Element;
  ariaLabel: string;
}

/**
 * Individual box in repl history.
 * @param commandMessage: the user-inputted command string, ex. "weather 41.8268 -71.4029"
 */
function HistoryBox({ isValid, commandMessage, outputMessage, ariaLabel }: HistoryBoxProps) {
  const className: string = isValid ? "response-box" : "error-box";
  return (
    <div className={"history-box " + className} aria-label={REPL_History_Box_accessible_name}>
      <div className="history-text command" aria-label={"Command: " + commandMessage}>
        <span><strong>Command: </strong>{commandMessage}</span>
      </div>
      <div className="history-text output" aria-label={((isValid) ? "Output: " : "Error: ") + ariaLabel}>
        <span><strong>Output: </strong></span>{outputMessage}
      </div>
    </div>
  );
}

/**
 * Input text box.
 * @param addHistoryBox when the form is submitted, uses this function to add
 *                      a new history box.
 */
function InputBox({ addHistoryBox }: { addHistoryBox: (command: string) => void }) {
  // allows React to track the value of the input box
  const [formValue, setFormValue] = useState("");

  /**
   * Triggers when form is submitted. Logs input to console and adds a new
   * history box with the given command.
   * @param event: form submit event.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // cancels default form submission, which would just add a parameter to the URL
    // and reset the page - we don't want this
    event.preventDefault();
    // adds a new history box
    addHistoryBox(formValue);
    // clears the input box
    setFormValue("");
  }

  /**
   * Triggers when form is put into focus. Changes style by switching 
   * class attribute, and selects text in the box.
   * @param event: focus event (i.e. when user clicks on input box).
   */
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.setAttribute("class", "repl-input-box-focused");
    event.target.select();
  }

  /**
   * Triggers when form is put out of focus. Changes style by switching 
   * class attribute.
   * @param event: blur event (i.e. when user clicks away from the box).
   */
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.setAttribute("class", "repl-input-box-blurred");
  }

  // returns a form with a single text input element.
  return (
    <form name="repl-form" id="repl-form" aria-label={REPL_Input_Form_accessible_name} 
      onSubmit={handleSubmit}>
      <input
        type="text"
        name="repl-input-box"
        id="repl-input-box"
        aria-label={REPL_Input_Box_accessible_name} // for accessibility
        // stylistic additions
        placeholder="Type something here!"
        className="repl-input-box-blurred" // sets the form to be blurred by default when page is opened
        onFocus={handleFocus} // when form is in focus, changes its style
        onBlur={handleBlur} // when form is out of focus, changes its style back
        autoComplete="off"
        // allows React to track and set form value
        value={formValue}
        onChange={event => setFormValue(event.target.value)}
      />
    </form>
  )
}

/**
 * Repl component.
 * @param commandProcessor: an object which takes commands as inputs, checks them
 *                          against provided REPLFunctions, and produces and output,
 *                          which the REPL then provides to the user.
 * @returns 
 */
export default function Repl({ commandProcessor }: {commandProcessor: CommandProcessor}) {
  // for managing the repl history
  const [history, setHistory] = useState<[boolean, string, JSX.Element, string][]>([]);

  // scrolls to the bottom of the history every time a new box is added.
  const historyEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (historyEndRef.current != null) {
      historyEndRef.current.scrollIntoView({ behavior: "smooth", block: 'nearest' });
    } else { console.log("Dummy end div has been deleted!") }
  },
    [history])

  // for InputBox - function to take input and update history so a new
  // history box can be created.
  const addHistoryBox = (input: string) => {
    const newHistory = history.slice();
    commandProcessor.getOutput(input)
      .then((output: [boolean, JSX.Element, string]) => newHistory.push([output[0], input, output[1], output[2]]))
      .then(_ => setHistory(newHistory));
  }

  return (
    // Wrapper for entire repl.
    <div id="repl">
      <div id="repl-history" aria-label={REPL_History_accessible_name}>
        {/* Maps all commands to history boxes. */}
        {history.map((command, boxNumber) =>
          <HistoryBox
            isValid={command[0]}
            commandMessage={command[1]}
            outputMessage={command[2]}
            ariaLabel={command[3]}
            key={boxNumber} />)}
        {/* Dummy div that we can scroll to (see useEffect above). */}
        <div id="repl-history-end" ref={historyEndRef} />
      </div>
      <hr id="history-separator" />

      <InputBox
        addHistoryBox={addHistoryBox}
      />
    </div>
  )
}