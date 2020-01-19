# Chameleon Chess Logic

This node module contains the game logic for the board game "Chameleon Chess".

Here you can find a description of the game and its rules:
- [english](./docs/game/en.md)
- [deutsch](./docs/game/de.md)

However, this module doesn't provide any kind of visual rendering. Instead, it is a library that implements the game logic of Chameleon Chess. It offers the basic models (data structures and functions to work on these data structures) that can be used to create an App or Website or any other kind of format to play a game of Chameleon Chess.

## Installation

The easiest way to use this library in your project, is by using NPM.

So, if you have the current version of NPM installed, just run this in the terminal in the folder of your project:

```` bash
npm install git+https://github.com/hd-code/chameleon-chess-logic.git
````

Now you can use this module in your app by simply requiring or importing it.

```` JS
const ccl = require('chameleon-chess-logic');
````

```` TS
import * as ccl from 'chameleon-chess-logic';
````

This project is written in Typescript. So all declarations interfaces etc. are included in the build.

## Usage

The data structures that this library provides are explained [here](./docs/data-types.md).

A Documentation on all functions this library offers, can be found [here](./docs/functions.md).

## Development

If you want to work on this module you need the current version of NPM installed on your machine.

Then open your terminal and do the following:

````bash
# clone git repo
git clone https://github.com/hd-code/chameleon-chess-logic.git

# change to project directory
cd chameleon-chess-logic

# install dev dependencies for npm module
npm i
````

Now, you can work on the project.

Please read the [Developer Guide](./docs/developer-guide.md) for an explanation of the project structure and further important information.