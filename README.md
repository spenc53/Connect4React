# Connect 4 AI

## How it works

It's normal connect 4 but, the second player is an AI. The AI is based off of a Monte Carlo Search tree. This estimates the best move by simulating a bunch of games. You can learn more at these sites: https://en.wikipedia.org/wiki/Monte_Carlo_tree_search and https://towardsdatascience.com/monte-carlo-tree-search-158a917a8baa.

A simple explanation is that the AI intelligently deepens a tree of the game. It does this by expanding a game tree at each move. It will pick a move at the current tree level. It does this by choosing the highest value move or randomly selecting a move that it has not played before. It will keep doing this until it reaches a tree that it has not been to before. Once it gets to that spot in a game tree, it will randomly pick moves for both players to the end of the game. It will then propagate the value of the end state up the path that was taken to get to the end game state. At each move that was made, that move's value will be increased or decreased by the end game's value.

### My Code

#### src/ai/GameNode.ts
This represents a move that can be made and it's current value. It also has a reference of moves that can be played next.

#### src/ai/MCTS.ts
This is the code that generates the tree and finds the next best move.

#### src/data/Board.ts
This contains all the logic about how the game is played. It also includes some helper functions (to/from json) to allow it be easier to transfer to a service worker.

## Available Scripts

In the project directory, you can run:

### `npm install`
This installs the needed dependencies in order to run this project.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
