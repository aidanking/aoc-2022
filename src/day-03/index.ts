import { FileHandle, open } from 'node:fs/promises';
import { getPathToTestFile } from '../helpers.js';

const rucksacksTest: string[] = await readRucksacksFromFile('test.txt');
const ruckSacksInput: string[] = await readRucksacksFromFile('input.txt');
const priorities: Map<string, number> = getPriorities();

console.log(getPrioritySum(rucksacksTest));
console.log(getPrioritySum(ruckSacksInput));
console.log(getPrioritySumForGroups(rucksacksTest));
console.log(getPrioritySumForGroups(ruckSacksInput));

async function readRucksacksFromFile(fileName: string): Promise<string[]> {
  let file: FileHandle | null = null;
  const rucksacks: string[] = [];
  try {
    const filePath = getPathToTestFile('day-03', fileName);
    file = await open(filePath);

    for await (const line of file.readLines()) {
      rucksacks.push(line);
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (file) {
      file.close();
    }
    return rucksacks;
  }
}

function getPriorities(): Map<string, number> {
  const priorities: Map<string, number> = new Map();
  let lowerStart = 'a'.charCodeAt(0);
  let lowerEnd = 'z'.charCodeAt(0);
  let priority = 0;

  while (lowerStart <= lowerEnd) {
    priority++;
    const key = String.fromCharCode(lowerStart);
    priorities.set(key, priority);
    lowerStart++;
  }

  let upperStart = 'A'.charCodeAt(0);
  let upperEnd = 'Z'.charCodeAt(0);

  while (upperStart <= upperEnd) {
    priority++;
    const key = String.fromCharCode(upperStart);
    priorities.set(key, priority);
    upperStart++;
  }

  return priorities;
}

function getPrioritySum(rucksacks: string[]): number {
  let prioritySum = 0;

  rucksacks.forEach((rucksack: string): void => {
    let i = 0;
    let middleIndex = Math.floor(rucksack.length / 2);
    const alreadySeen: Set<string> = new Set();

    while (i < rucksack.length) {
      const currentItem = rucksack[i];
      if (i < middleIndex) {
        alreadySeen.add(currentItem);
      } else if (alreadySeen.has(currentItem)) {
        prioritySum += priorities.get(currentItem) || 0;
        alreadySeen.delete(currentItem);
      }

      i++;
    }
  });

  return prioritySum;
}

function getPrioritySumForGroups(rucksacks: string[]): number {
  let prioritySum = 0;

  for (let i = 0; i < rucksacks.length; i += 3) {
    const firstRucksack = rucksacks[i];
    const firstRucksackItems: Set<string> = new Set();

    for (const item of firstRucksack) {
      firstRucksackItems.add(item);
    }

    const secondRucksack = rucksacks[i + 1];
    const secondRucksackItems: Set<string> = new Set();

    for (const item of secondRucksack) {
      secondRucksackItems.add(item);
    }

    const thirdRucksack = rucksacks[i + 2];
    for (let i = 0; i < thirdRucksack.length; i++) {
      const item = thirdRucksack[i];
      if (firstRucksackItems.has(item) && secondRucksackItems.has(item)) {
        prioritySum += priorities.get(item) || 0;
        break;
      }
    }
  }

  return prioritySum;
}
