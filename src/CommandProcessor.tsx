import { REPLFunction } from "./REPLFunctions"

/**
 * A class for representing a REPL command processor.
 * Takes command inputs and produces outputs according to provided REPLFunctions.
 */
export default class CommandProcessor {
  /**
  * commandMap: a map which holds the valid commands which a user may input into the screen
  * along with the associated REPLFunction which is ran upon the command being called. 
  */
  commandMap: Map<string, REPLFunction>;

  /**
   * Constructor for a CommandProcessor object.
   * @param commandMap takes a commandMap which is, by default, empty.
   */
  constructor(commandMap: Map<string, REPLFunction> = new Map([])) {
    this.commandMap = commandMap;
  }

  /**
   * Used to add new commands to the command processor.
   * @param command: the unique command string, ex. "weather" or "get".
   * @param commandFunc: the function that processes the command parameters 
   *                     and produces an output.
   */
  addNewCommand(command: string, commandFunc: REPLFunction): void {
    if (this.commandMap.has(command)) {
      console.log("Warning: you are overwriting a function.");
    }
    this.commandMap.set(command, commandFunc);
  }

  /**
   * Used to remove a command from the command processor.
   * @param command: the unique command string, ex. "weather" or "get".
   */
  removeCommand(command: string): void {
    if (this.commandMap.has(command)) {
      this.commandMap.delete(command);
    } else {
      console.log("This command does not exist.");
    }
  }

  /**
  * Given a user-inputted command string, gets the output for that command.
  * @param input the unformatted string, taken directly from the user input box.
  * @returns a tuple containing a boolean, a JSX Element, and a string.
  *          the boolean will be true if the command was valid, and false if it was invalid.
  *          the JSX element will be the element outputted into the HTML.
  *          the string will be the aria label for the output.
  */
  async getOutput(input: string): Promise<[boolean, JSX.Element, string]> {
    // splits input into words
    const inputSplit: string[] = input.split(" ");
    // gets the command (first word)
    const command: string = inputSplit[0];
    // gets the parameters (everything after the first word)
    const params: string[] = inputSplit.slice(1);

    // if the command is found in the map, call the corresponding REPLFunction
    // on the input parameters and return the output.
    if (this.commandMap.has(command)) {
      // need to cast because typescript complains. however, it's ok since 
      // we already checked commandMap.has, so we know for certain that the key is present.
      return await (this.commandMap.get(command) as REPLFunction)(params);
      // if the command isn't found in the map, return false and an error message.
    } else {
      const message: string = "Not a valid command.";
      return [false, <span>{message}</span>, message];
    }
  }
}





