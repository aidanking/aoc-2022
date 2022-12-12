import { open } from 'node:fs/promises';
import { getPathToTestFile } from '../helpers.js';

const dataOne = await getCalorieListFromFile('test.txt');
const dataTwo = await getCalorieListFromFile('input.txt');

console.log(getMaxCalorieAmount(dataOne));
console.log(getMaxCalorieAmount(dataTwo));
console.log(getSumTopThreeCalorieAmounts(dataOne));
console.log(getSumTopThreeCalorieAmounts(dataTwo));

async function getCalorieListFromFile(fileName: string): Promise<number[]> {
  const result: number[] = [];
  let file = null;

  try {
    const filePath = getPathToTestFile('day-01', fileName);

    file = await open(filePath);

    for await (const line of file.readLines()) {
      if (line === '') {
        result.push(-1);
      } else {
        result.push(Number(line));
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (file) {
      file.close();
    }
  }

  return result;
}

function getMaxCalorieAmount(calories: number[]): number {
  let maxCalorieAmount = 0;
  let runningTotalCalorieAmount = 0;

  calories.forEach((calorieAmount: number) => {
    if (calorieAmount === -1) {
      if (runningTotalCalorieAmount > maxCalorieAmount) {
        maxCalorieAmount = runningTotalCalorieAmount;
      }
      runningTotalCalorieAmount = 0;
    } else {
      runningTotalCalorieAmount += calorieAmount;
    }
  });

  if (
    runningTotalCalorieAmount > 0 &&
    runningTotalCalorieAmount > maxCalorieAmount
  ) {
    maxCalorieAmount = runningTotalCalorieAmount;
    runningTotalCalorieAmount = 0;
  }

  return maxCalorieAmount;
}

function getSumTopThreeCalorieAmounts(calories: number[]): number {
  let topThreeCalorieAmounts: number[] = [0, 0, 0];
  let runningTotalCalorieAmount = 0;

  calories.forEach((calorieAmount: number) => {
    if (calorieAmount === -1) {
      if (runningTotalCalorieAmount > topThreeCalorieAmounts[0]) {
        insertIntoTopThreeCalorieAmounts(
          topThreeCalorieAmounts,
          runningTotalCalorieAmount
        );
      }
      runningTotalCalorieAmount = 0;
    } else {
      runningTotalCalorieAmount += calorieAmount;
    }
  });

  if (
    runningTotalCalorieAmount > 0 &&
    runningTotalCalorieAmount > topThreeCalorieAmounts[0]
  ) {
    insertIntoTopThreeCalorieAmounts(
      topThreeCalorieAmounts,
      runningTotalCalorieAmount
    );
    runningTotalCalorieAmount = 0;
  }

  return topThreeCalorieAmounts.reduce(
    (acc: number, current: number) => acc + current,
    0
  );
}

function insertIntoTopThreeCalorieAmounts(
  topThreeCalorieAmounts: number[],
  runningTotalCalorieAmount: number
): number[] {
  if (runningTotalCalorieAmount < topThreeCalorieAmounts[0]) {
    return topThreeCalorieAmounts;
  }

  let i = topThreeCalorieAmounts.length - 1;

  while (runningTotalCalorieAmount <= topThreeCalorieAmounts[i] && i > 0) {
    i--;
  }

  let j = 0;

  while (j < i) {
    topThreeCalorieAmounts[j] = topThreeCalorieAmounts[j + 1];
    j++;
  }

  topThreeCalorieAmounts[i] = runningTotalCalorieAmount;

  return topThreeCalorieAmounts;
}
