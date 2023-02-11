import { readDataFromFileAsNumberGrid } from '../helpers.js';

type Direction = 'undefined' | 'north' | 'east' | 'south' | 'west';

interface Node {
  value: number;
  row: number;
  column: number;
  direction: Direction;
  distanceFromStart: number;
}

const testGridData = await readDataFromFileAsNumberGrid('day-08', 'test.txt');
const inputGridData = await readDataFromFileAsNumberGrid('day-08', 'input.txt');

console.log(await getVisibleTreeCount(testGridData));
console.log(await getVisibleTreeCount(inputGridData));
console.log(await getMaxScenicScore(testGridData));
console.log(await getMaxScenicScore(inputGridData));

async function getVisibleTreeCount(grid: number[][]): Promise<number> {
  let count = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const currentNode: Node = {
        value: grid[i][j],
        row: i,
        column: j,
        direction: 'undefined',
        distanceFromStart: 0,
      };

      if (
        isOnEdgeOfGrid(grid, currentNode) ||
        checkIsVisible(grid, currentNode)
      ) {
        count++;
      }
    }
  }

  return count;
}

function checkIsVisible(grid: number[][], startNode: Node): boolean {
  const queue: Node[] = [startNode];

  while (queue.length > 0) {
    const currentNode = queue.pop();
    if (currentNode) {
      if (currentNode.value < startNode.value || startNode === currentNode) {
        const neighbours = getNeighbours(grid, currentNode);

        if (neighbours.length === 0 && isOnEdgeOfGrid(grid, currentNode)) {
          return true;
        }

        queue.push(...neighbours);
      }
    }
  }

  return false;
}

async function getMaxScenicScore(grid: number[][]): Promise<number> {
  let maxScore = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const currentNode: Node = {
        value: grid[i][j],
        row: i,
        column: j,
        direction: 'undefined',
        distanceFromStart: 0,
      };
      const currentScore = getScenicScore(grid, currentNode);
      if (currentScore > maxScore) {
        maxScore = currentScore;
      }
    }
  }

  return maxScore;
}

function getScenicScore(grid: number[][], startNode: Node): number {
  if (isOnEdgeOfGrid(grid, startNode)) {
    return 0;
  }
  let score = 0;

  const queue = [startNode];

  while (queue.length > 0) {
    const currentNode = queue.pop();

    if (currentNode) {
      const neighbours = getNeighbours(grid, currentNode);

      if (neighbours.length > 0) {
        for (const neighbour of neighbours) {
          if (neighbour.value < startNode.value) {
            queue.push(neighbour);
          } else {
            score =
              score === 0
                ? neighbour.distanceFromStart
                : score * neighbour.distanceFromStart;
          }
        }
      } else {
        score =
          score === 0
            ? currentNode.distanceFromStart
            : score * currentNode.distanceFromStart;
      }
    }
  }

  return score;
}

function isOnEdgeOfGrid(grid: number[][], currentNode: Node) {
  return (
    currentNode.row === 0 ||
    currentNode.row === grid.length - 1 ||
    currentNode.column === 0 ||
    currentNode.column === grid[currentNode.row].length - 1
  );
}

function getNeighbours(grid: number[][], currentNode: Node): Node[] {
  const neighbours: Node[] = [];
  const distanceFromStart: number = currentNode.distanceFromStart + 1;

  if (
    (currentNode.direction === 'undefined' ||
      currentNode.direction === 'north') &&
    currentNode.row - 1 >= 0
  ) {
    neighbours.push({
      value: grid[currentNode.row - 1][currentNode.column],
      row: currentNode.row - 1,
      column: currentNode.column,
      direction: 'north',
      distanceFromStart,
    });
  }

  if (
    (currentNode.direction === 'undefined' ||
      currentNode.direction === 'east') &&
    currentNode.column + 1 < grid[currentNode.row].length
  ) {
    neighbours.push({
      value: grid[currentNode.row][currentNode.column + 1],
      row: currentNode.row,
      column: currentNode.column + 1,
      direction: 'east',
      distanceFromStart,
    });
  }

  if (
    (currentNode.direction === 'undefined' ||
      currentNode.direction === 'south') &&
    currentNode.row + 1 < grid.length
  ) {
    neighbours.push({
      value: grid[currentNode.row + 1][currentNode.column],
      row: currentNode.row + 1,
      column: currentNode.column,
      direction: 'south',
      distanceFromStart,
    });
  }

  if (
    (currentNode.direction === 'undefined' ||
      currentNode.direction === 'west') &&
    currentNode.column - 1 >= 0
  ) {
    neighbours.push({
      value: grid[currentNode.row][currentNode.column - 1],
      row: currentNode.row,
      column: currentNode.column - 1,
      direction: 'west',
      distanceFromStart,
    });
  }

  return neighbours;
}
