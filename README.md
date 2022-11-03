# Sprint 3 - Command Terminal Webapp

### Project Description and Use Details:
- Our project is an integration of front and back end components where the front end invokes the API server to the previous sprints we’ve completed in CSCI0320 to handle and output parsing CSVs, retrieving CSV data, returning the weather given certain coordinates, and allow developers to add their own custom functions which they can call. 
- In order to use the App in regards to get the contents of a CSV, the user is able to get the contents stored inside a particular CSV by calling the get command and providing the filepath of the CSV in the command bar found at the bottom of the App. The file contents are returned to the user in a gray history box followed with the command which the user inputted. 
- In order to use the App to get the statistics of a CSV, the user is able to stats inside a particular CSV by calling the stats command after having loaded a CSV in the App. The stats are returned to the user in a gray history box followed with the command which the user inputted. 
- In order to receive temperature and weather data for a particular location, the user must type in the command weather followed by the target’s latitude and longitude coordinates. The weather of the valid input coordinates are returned to the user in a gray history box followed with the command which the user inputted.
- If the user inputs an invalid input then a red error box will appear with the invlaid command along with an error message. 

#### Team Members and Contributions:
#### Main Team Members: 
jcheng59, skim453
#### Contributors: None

#### Resources:
https://charles-bryant.gitbook.io/hello-react-and-typescript/helloworld/acceptuserinput

#### Total Estimated Time:
~16 hours

## Design Choices:

#### Packaging and Relationship Between Classes/Interfaces:
- To begin we translated all of the previous sprint 1 & 2 code to .tsx format or the format in which we could connect to our sprints API. 
- We created a total of 4 primary classes

- CommandProcessor:
  - A class representing a REPL command processor that takes command inputs and produces outputs according to the provided REPLFunctions.
  - This class contains a hashmap of <string, REPLFunction> which maps out the valid commands along with their functions. 
  - Additionally, this is the class which satisfies user story 4 as it contains an addNewCommand function which is used to add new functions and their command name to the hashmap
- The class REPLFunction is an interface for representing the functions that takes an array of string parameters and returns the promise containing a tuple boolean, a JSX element and string. The boolean is true if the command is valid, the JSX element contains the output of the command, and the string is the aria label for the output. 
  - It contains each of the functions for the weather command, the get command, and the stats command along with a custom pokeResponse which was created to simulate what a developer would do when creating their own custom functions and command calls. 
- Repl.tsx is a class which is used to handle the aria labels along with other fundamental components for the front end such as the history boxes, the history terminal, input box, etc.
- Index.tsx is a class which sets up the command processor which processes input command into output. It is also where new commands can be registered. 

### Intentional/Notable Design Choices:
- #### Changes to interface REPLFunction: 
  We changed the signature of REPLFunction so instead of a promise<String> it is a promise<[boolean, JSX.element, string]> as we need to have all three values in our REPL function to know whether our history boxes will be gray for valid or red for an error that was inputted by the user. Additionally, the JSX.element allows us to structure out the output for the get command followed by a valid CSV and display a table with rows and columns. 
- #### Aria Labels vs Aria Descriptions: 
  We use aria labels instead of aria descriptions since it allows both developers and users to utilize screen readers as aria descriptions are a new addition so not all screen readers can properly read them. Our choice here is by design. 

### User Story 4 (Extensibility):
We set up the command calls and the ability to check whether or not a command is valid by creating a hashmap where the key would be the command name with the value being the actual function call for that particular command. If a developer wants to add a new command, they simply need to add the command to the hashmap along with their custom function which will run upon the command being called. Within the REPLFunction class we created a custom function called pokeFunc which connects to the pokeapi. This function, when the command is called with a valid pokemon, returns the stats of that pokemon. We did this in order to simulate what a developer would need to do to add their own functions to the program. 


### Data Structure(s):
- We decided to represent the command which the user will enter in such as get, weather, stats in a hashmap. The reason as to why was because hashmaps would allow quick and easy access as to whether or not the command along with its associated function exist. If they do we can move accordingly. Else, return an error. 
- As mentioned previously, we changed the signature of REPLFunction to a promise<[boolean, JSX.element, string]> as we need to have all three values in our REPL function to know whether our history boxes will be gray for valid or red for an error that was inputted by the user. This provided us with a means to have all the necessary information to not only properly output results from functions when properly called but also format and provide critical information necessary in the other classes. 

### Runtime/Space Optimization:
None

### Errors/Bugs:
No known errors or bugs. 

## Testing:
We divided our testing into the following separate files:
- general.test.tsx
- get.test.tsx
- pokemon.test.tsx
- stats.test.tsx
- weather.test.tsx

#### Overview of Testing:
- General.test.tsx:
  - Created a test to check that the input box and repl history elements are present in doc upon initial rendering
  - Created a test which checks for cases where an invalid command is inputted and also checks that the history boxes are correctly rendered. 
- Get.test.tsx:
  - tests for error messages when get has no arguments.
  - tests for error messages when get has an invalid file path.
  - Test get on an empty csv
  - Test get on a valid csv and making sure that the output of the test is correct
- Pokemon.test.tsx:
  - This class was created to test the pokemon function which was created to simulate what a developer should expect when they create their own custom function and command call and add it to the functions hashmap as a valid command. 
  - Test to make sure an error message is returned for when a nonexistent pokemon is inputted
  - Test for a valid response when a valid pokemon is entered
- Stats.test.tsx
  - In the stats.test.tsx file, the API server from the backend must be reset inorder for these tests to run properly. 
  - Test stats after an empty csv has been loaded in through the get function
  - Test stats after a valid csv has been loaded in through the get function
- Weather.test.tsx
  - Test for when the weather command is entered followed by no arguments
  - Test for when the weather command is entered followed by two invalid inputs
  - Test for when the weather command is entered followed by two invalid coordinates
  - Weather test for when the weather command is entered followed by two invalid coordinates outside of the United States
  - Test for when the weather command is entered followed by two valid coordinates


### Steps Needs to Run the Integration and Unit Tests:
- Open terminal and navigate to the project directory. 
- Run 'npm install' to install the needed dependencies.
- Once it is done installing, run 'npm test'. This will run the tests in src/tests.

### Build and Run Program:
- Open terminal and navigate to the project directory. 
- Run 'npm install' to install the needed dependencies.
- Once it is done installing, run 'npm start'. This should open the website as a tab in your browser.
- You can then run the commands you like!
### For developers: 
- the CommandProcessor class contains a method 'addNewCommand()' which allows you to add a new command and its corresponding keyword.

