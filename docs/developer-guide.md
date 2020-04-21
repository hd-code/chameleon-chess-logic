# Developer Guide

This document will give you an overview over the project, it's basic structure, useful commands and conventions.

## General Information

This is a node module and makes extensive use of the NPM package manager.

This project is written in TypeScript. Unit tests are written in normal JavaScript.

There should be unit tests for every file. As a testing framework we use 'Mocha' in combination with the Node.js `assert` library.

## Project Structure

In the root directory of this project you find the following files and directories:

- `src/` holds all the actual source code of this project in TypeScript. 
- `src/main.ts` is the main file of this library. It holds all the public data types and functions. This is the entry point for the public API. Only what is exported here, will be visible to the users of this library.
- `src/models/` contains all the models (data structures + functions with application logic) of this project. The core functionalities are located here.
- `test/` has the same structure as `src/`. Because for every file in `src/` there is a unit test script to be found in this directory.
- `test/test-data.js` holds a collection of several testing scenarios that the API has to be checked against. All unit tests use the scenarios in this file.
- `lib/` contains auxiliary libraries and helper functions.
- `docs/` contains all kinds of documentation files, like this guide. You will also find a description of the game and the basic rules. There is also a documentation on the public API (all available data types and functions for the users of this library).
- `build/` is automatically generated during the build process. It contains the transpiled JavaScript files from `src/` plus a TypeScript declaration file. This also is the only directory exported in the final package. 
- `.gitignore` specifies files and directories, that should not be commited to git.
- `package.json` is a file holding the settings, dependencies and options for NPM.
- `README.md` gives an introduction to the project as well as an installation guide.
- `tsconfig.json` holds the settings for the TypeScript compiler.

## NPM commands

There are several NPM command line scripts, which will help in development.

- `npm install` will install all needed dependencies (e.g. typescript, mocha, ...).
- `npm test` will build the project and run all unit tests.
- `npm start` will build and minify the project and run all the unit tests.
- `npm pack` creates a tarball archive with the final build. 

There are also some auxiliary commands:

- `npm run ts` transpieles all TypeScript files in `src/` to JavaScript files and outputs them in the `build/` directory.
- `npm run ts:debug` does the same as above, but it will also create mapping files. These help the debugger to link the code in `build/` to its origin in `src/`.
- `npm run minify` reduces the file size of all JavaScript files in `build/` by deleting whitespace, shortening local variables, functions etc.
- `npm run mocha` will run all unit tests in directory `test/`.

## Git repo

Currently there are two branches in this git repository:

- `master` is the main development branch.
- `v1` is a stable release version.

Please do not work on `v1`! Only make a pull request into `v1` under the following conditions:

- All previous unit tests work.
- All public (exported in `src/main.ts`) data types and functions are still there and work as they did previously.
- Any new functionality is tested by a bunch of unit tests and all are passing.

In other words do not make any breaking changes to branch `v1`.

If you have to completely change any existing functionality, consider creating another branch, with another stable release version e.g. `v2` etc.

## General rules

If the unit tests fail, the whole build process is terminated. So, always make sure that the unit tests work correctly.

There should be a unit test for every public function.

In the file `test/test-data.js` are several test scenarios that should be used for testing. However, feel free to test additional cases as well.

In the file `src/main.ts` every function and every data type should be documented using JSDoc. The reason is that this module is a library. So, other people use the data types and functions exported in `src/main.ts`. The JSDoc annotations are exported as well and will be visible for users in e.g. IntelliSense.

The file `src/ai.ts` contains the current implementation of the computer opponent. The algorithm is not the best and will be exchanged soon by an artificial intelligence.

### Functional Style

This library should be a functional programm. So, functions are **not allowed** to have any **side effects**.

Side-effects include:
- reading/writing to files, databases or global variables
- producing any kind of screen output
- altering input parameters

**Your functions should not have any of these side-effects.** Excessively use the return value of your functions.

Make sure that input parameters of functions are never altered. Use the helper function `deepClone()` to make a copy of a parameter if needed.

### Code Style

Use descriptive names for everything (functions, variables, constants etc.).

Use the TypeScript code conventions for camelCasing, line indentation etc.

Lines should be shorter than 80 characters and they must not exceed 120 characters.

End lines with `;`.

Try to keep functions shorter than 20 lines. Abide by the 'Single Responsibility Principle'.

Prefix user-specified types with a capital letter of their kind (`I` for interfaces, `E` for enums, `T` for types, etc.).

Structure your source code files:

1. All imports
2. A Divider
3. All exported types, constants and functions
4. A Divider
5. All local types, constants and functions (everything that is used locally in the file and not exported)

Always order your sections like this:
1. type declarations
2. constants
3. functions

```ts
import * as fs from "fs";

// -----------------------------------------------------------------------------

export interface IPerson {
    name: string;
    age: number;
}

export const START_VALUE = 3;

export function add(a: number, b: number): number {
    return a + b;
}

// -----------------------------------------------------------------------------

type TPersons = IPerson[]

const MAX_VALUE = 13;

function sub(a: number, b: number): number {
    return a - b;
}
```