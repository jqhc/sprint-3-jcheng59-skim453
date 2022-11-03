import './styles/pokemon-type-colours.css';
import './styles/getcsv-table.css';

// global constant for URL of the API server.
const API_URL = "http://localhost:3232/"

/**
 * An interface for representing a function that takes an array of 
 * string parameters (the command), and returns a promise containing a tuple of a boolean,
 * JSX Element, and string. The boolean is true if the command was valid, the JSX Element
 * contains the output of the command, and the string is the aria label for the output.
 */
export interface REPLFunction {
  (args: Array<string>): Promise<[boolean, JSX.Element, string]>
}

/**
 * Handles weather commands by calling weather API.
 * @param args should be an array of length 2. First value is the
 *             latitude and the second is the longitude.
 * @returns A promise containing either false and an error message,
 *          or true and a message containing the temperature at those coordinates.
 */
export const weatherFunc: REPLFunction = async (args: Array<string>) => {
  if (args.length !== 2) {
    const message: string = "'weather' requires two inputs: the latitude and the longitude.";
    return [false, <span>{message}</span>, message]
  }

  // retrieves response from API and gets the json synchronously.
  let weatherResponse: Response;
  try { weatherResponse = await fetch(API_URL + "weather?lat=" + args[0] + "&lon=" + args[1]); } 
  // if the fetch throws an error, that means the API server is not running or the endpoint
  // has been removed. So we return an appropriate error message.
  catch(err) { 
    const message: string = "The API server is down! Please try again later.";
    return [false, <span>{message}</span>, message]; 
  }

  const json = await weatherResponse.json();
  return [json.result === "success", <span>{json.message}</span>, json.message];
};

/**
 * Handles get commands by calling the get endpoint of the API on CSVs.
 * @param args should be an array with one element: the filepath of the CSV
 * @returns A promise containing either false and an error message,
 *          or true and the contents of the CSV.
 */
export const getFunc: REPLFunction = async (args: Array<string>) => {
  if (args.length !== 1) {
    const message: string = "'get' requires one input: the filepath of your CSV.";
    return [false, <span>{message}</span>, message];
  }

  /* LOADING */
  // loads the CSV to the API and returns errors if there are any.
  let loadResponse: Response;
  try { loadResponse = await fetch(API_URL + "loadcsv?filepath=" + args[0]); }
  catch(err) { 
    const message: string = "The API server is down! Please try again later.";
    return [false, <span>{message}</span>, message]; 
  }

  const loadJson = await loadResponse.json();
  if (loadJson.result !== "success") {
    return [false, <span>{loadJson.message}</span>, loadJson.message];
  } 

  /* GETTING */
  // assuming no errors were thrown, then calls getcsv endpoint to get the contents of 
  // the loaded CSV. also returns error messages if API server goes down.
  let getResponse: Response;
  try { getResponse = await fetch(API_URL + "getcsv"); } 
  catch(err) { 
    const message: string = "The API server is down! Please try again later.";
    return [false, <span>{message}</span>, message]; 
  }

  const getJson = await getResponse.json();

  const table: JSX.Element = 
    <div className="getcsv-table-div">
      <table className="getcsv-table">
        <tbody>
          {getJson.data.map(
            (row: string[], rowNum: number) => {
              return <tr className="getcsv-table-row" key={rowNum}>
                {row.map((val: string, valNum: number) => 
                  <td className="getcsv-table-entry" key={valNum}>{val}</td>)}
              </tr>
            })}
        </tbody>
      </table>
    </div>

  let ariaLabel: string = getJson.data.join(". END ROW. ");
  ariaLabel += ". END CSV.";
  
  return [true, table, ariaLabel];
}

/**
 * Handles stats commands by calling the stats endpoint of the API.
 * @param args should be an empty array.
 * @returns A promise containing either false and an error message,
 *          or true and a message containing the row and column counts
 *          of the CSV.
 */
export const statsFunc: REPLFunction = async (args: Array<string>) => {
  if (args.length !== 0) {
    const message: string = "'stats' should have no arguments.";
    return [false, <span>{message}</span>, message];
  }
  // tries to get stats if API server is working, otherwise returns error message
  let statsResponse: Response;
  try { statsResponse = await fetch(API_URL + "statscsv"); } 
  catch(err) { 
    const message: string = "The API server is down! Please try again later.";
    return [false, <span>{message}</span>, message]; 
  }
  // returns API response
  const statsJson = await statsResponse.json();
  return [statsJson.result === "success", <span>{statsJson.message}</span>, statsJson.message];
}

/**
 * Handles pokemon commands by calling PokeAPI to retrieve types and stats.
 * @param args should be an array with 1 element: the pokemon's name.
 * @returns A promise containing either false and an error message,
 *          or true and a message containing the type(s) and base stats of
 *          the pokemon.
 */
export const pokeFunc: REPLFunction = async (args: Array<string>) => {
  if (args.length !== 1) {
    const message: string = "'pokemon' should have 1 argument: the name of the pokemon";
    return [false, <span>{message}</span>, message];
  }

  // tries to get given pokemon from PokeAPI
  let pokeResponse: Response;
  try { pokeResponse = await fetch("https://pokeapi.co/api/v2/pokemon/" + args[0].toLowerCase()) }
  catch(err) { 
    const message: string = "The PokeAPI server is down! Please try again later.";
    return [false, <span>{message}</span>, message]; 
  }
  // if 404, pokemon doesn't exist.
  if (pokeResponse.status === 404) { 
    const message: string = "PokeAPI couldn't find this Pokemon. Check your spelling!";
    return [false, <span>{message}</span>, message]; 
  }

  // gets JSON
  const pokeJson = await pokeResponse.json();

  // find types
  let types: JSX.Element[] = [];
  let typeNames: string[] = [];
  for (const type of pokeJson.types) {
    const typeName: string = type.type.name;
    typeNames.push(typeName);
    types.push(<span className={"poketype-" + typeName}>{typeName}</span>);
    types.push(<span>, </span>)
  }
  types.pop();

  // find base stats
  let stats: Map<string, number> = new Map([]);
  let statNames: string[] = ["HP", "Atk", "Def", "SpAtk", "SpDef", "Spd"];
  for (let i = 0; i < 6; i++) {
    stats.set(statNames[i], pokeJson.stats[i].base_stat);
  }

  let statsStrings: string[] = [];
  stats.forEach((stat, statName) => statsStrings.push(statName + " - " + stat));

  const ariaLabel: string = "Types: " + typeNames + ". Base stats: " + statsStrings.join(", ");

  return [true, <span>Types: {types}. Base stats: {statsStrings.join(", ")}.</span>, ariaLabel];
}