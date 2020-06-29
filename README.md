# Chameleon Chess Logic

This node module contains the game logic for the board game "Chameleon Chess".

You can find a description of the game and its rules in:
- `docs/game/en.md` [english](./docs/game/en.md)
- `docs/game/de.md` [deutsch](./docs/game/de.md)

However, this module doesn't provide any kind of visual rendering. Instead, it is a library that implements the game logic of Chameleon Chess. It offers the basic models (data structures and functions to work on these data structures) that can be used to create an App or Website or any other kind of format to play a game of Chameleon Chess.

## Installation

Add this library to your project with NPM by running:

```sh
npm install git+https://github.com/hd-code/chameleon-chess-logic.git
```

## Usage

Now you can use this module in your app by simply requiring:

```js
const ccl = require('chameleon-chess-logic');
```

or importing it:

```ts
import * as ccl from 'chameleon-chess-logic';
```

This project is written in Typescript and all declarations, interfaces etc. are included in the build.

### API Documentation

To see the documentation on all the public data structures and functions, run:

```sh
npm run docs
```

_Note:_ The npm dependencies have to be installed to generate the docs! Install them by running `npm install` first.

## Development

If you want to work on this module you need to clone the repository and run the setup script:

```shell
# clone git repo
git clone https://github.com/hd-code/chameleon-chess-logic.git

# change to project directory
cd chameleon-chess-logic

# install dependencies, generate docs and build package
npm run setup
```

### Project structure

This project is written in TypeScript. So, the shipped code has to be transpieled to JavaScript. The TypeScript compiler will also create declaration files (`*.d.ts`) for the JavaScript code automatically. The targeted JavaScript version is ES6.

- `dist/` holds the transpieled JavaScript code. This is generate by the TypeScript compiler and overwritten on every build. So, do not alter anything here directly.
- `docs/` contains the documentation. Here you find the api documentation, as well as a description of the game rules in different languages.
- `lib/` holds some external libraries, that are not managed by NPM.
- `src/` contains all the TypeScript source code. Everything in here is transpieled and will be part of the build in `dist/`.
- `test/` holds unit and integration tests. Unit tests use the Mocha test framework and ts-node. That means that unit tests are performed using the source code in `src/` directly. Integration tests however test the transpieled code in `dist/`. So, you have to build the project first before running the integration tests.

### NPM Scripts

To make development easier, there are several npm scripts available to be run:

- `npm install` installs the npm dependencies.
- `npm pack` builds the project and packs it into a tarball archive.
- `npm start` does the same as `npm test`.
- `npm test` runs all unit and integration tests. _Note:_ for the integration tests to work, the project needs to be build first with `npm run build` (see below).

More sophisticated npm scripts:

- `npm run build` builds the project by executing a build pipeline.
- `npm run build:fast` does a fast build. It omits several steps in the build pipeline. This is useful for quick testing during development.
- `npm run clear` deletes the `dist/` directory for a new clean build. This is usually run automatically during the build process.
- `npm run minify` will minify all the generated JavaScript files in `dist/`. This is usually run automatically during the build process.
- `npm run docs` will open the api documentation in the browser. If the documentation does not exist yet, it is generated first. However, once generated you have to run `npm run docs:make` to generate it again and overwrite the older version.
- `npm run setup` will install npm dependencies, generate the docs and build the project. Use this after cloning the repo to get started quickly.

### Git Repository

Do not work directly on `master` branch. Work on a separate branch and do a pull request to the master once done.

Git tags are used to mark different release versions of this package. Releases tags follow the NPM semver format.

There is one tag called 'legacy' which references the legacy version of the game logic, that was used in the very first version of the chameleon-chess-app.

### Coding Conventions

The most important ones first:

**There should be unit tests for every function in the public API.**

**This project is written in a functional style.** That means, there are no global variables, no databases, no interactions with the file system, no screen output and no interactive processing of user input. There are just constants and pure functions. So, a function's output only depends on the passed input parameters. Same input means same output – always. Functions are not allowed to alter anything outside of their local scope. That includes the passed parameters! Make copies of the input parameters if necessary. In the lib there are helper functions for that.

Additional conventions:

- use descriptive names for everything (functions, variables, constants etc.)
- use the TypeScript naming conventions for camelCasing, line indentation etc.
- lines should be shorter than 80 characters and absolutely must not exceed 120 characters
- try to keep functions shorter than 20 lines – abide by the 'Single Responsibility Principle'
- if possible files should not exceed 200 lines
- end statements with `;`
- prefix user-specified types with a capital letter of their kind (`I` for interfaces, `E` for enums, `M` for maps, etc.)
- source filenames only use lowercase letters, words are separated by hyphens
- try to avoid exporting constants
- use traditional declaration of functions with `function` keyword on package level, within code blocks fat arrow functions are fine

Source file structure:

1. TypeDoc file description (optional)
2. A Divider (only if there is a file description)
3. All imports
4. A Divider
5. All exported types, constants and functions
6. A Divider
7. All local types, constants and functions (everything that is used locally in the file and not exported)

Sections of code should be ordered like this:

1. type declarations
2. constants
3. functions

Example:

```ts
/**
 * TypeDoc description for this file...
 * @packageDocumentation
 */

// -----------------------------------------------------------------------------

import * as fs from 'fs';

// -----------------------------------------------------------------------------

export interface IPerson {
    name: string;
    age: number;
}

export function sum(n: number[]): number {
    return n.reduce((a, b) => a + b, 0);
}

// -----------------------------------------------------------------------------

type MNamePerson = {[name: string]: IPerson};

const MAX_VALUE = 13;

function sub(a: number, b: number): number {
    return a - b;
}
```
