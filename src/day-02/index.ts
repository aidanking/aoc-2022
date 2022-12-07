import { open } from 'node:fs/promises';
import { getPathToTestFile } from '../helpers.js';

const dataOne = await readMatchDataFromFile('test.txt');

console.log(dataOne);

async function readMatchDataFromFile(fileName: string): Promise<string[]> {
  const data: string[] = [];
  try {
    const pathToFile = getPathToTestFile('day-02', 'test.txt');

    const file = await open(pathToFile);

    for await (const line of file.readLines()) {
      const id: string = line.split(' ').join('');
      data.push(id);
    }

    return data;
  } catch (err) {
    return [];
  }
}

const matchResults = {
  AX: { winner: 'DRAW', points: 4 },
  AY: { winner: 'Y', points: 8 },
  AZ: { winner: 'A', points: 7 },
  BX: {},
  BY: {},
  BZ: {},
  CX: {},
  CY: {},
  CZ: {},
};
