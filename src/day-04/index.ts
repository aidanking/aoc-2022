import { open } from 'node:fs/promises';
import { getPathToTestFile } from '../helpers.js';

type SectionAssignmentRange = Array<number>;
type SectionAssignmentPair = Array<SectionAssignmentRange>;

const testSectionAssignmentPairs = await readSectionAssignmentPairs('test.txt');
const inputSectionAssignmentPairs = await readSectionAssignmentPairs(
  'input.txt'
);
console.log(getFullyContainedRangeCount(testSectionAssignmentPairs));
console.log(getFullyContainedRangeCount(inputSectionAssignmentPairs));
console.log(getOverlappingRangesCount(testSectionAssignmentPairs));
console.log(getOverlappingRangesCount(inputSectionAssignmentPairs));

async function readSectionAssignmentPairs(
  fileName: string
): Promise<Array<SectionAssignmentPair>> {
  let file = null;
  const sectionAssignmentPairs: Array<SectionAssignmentPair> = [];

  try {
    const filePath = getPathToTestFile('day-04', fileName);
    file = await open(filePath);

    for await (const line of file.readLines()) {
      const pairs: SectionAssignmentPair = line
        .split(',')
        .map((range: string): number[] => {
          return range.split('-').map((x: string) => Number(x));
        });
      sectionAssignmentPairs.push(pairs);
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (file) {
      file.close();
    }
    return sectionAssignmentPairs;
  }
}

function getFullyContainedRangeCount(
  sectionAssignmentPairs: Array<SectionAssignmentPair>
): number {
  let fullyContainedRangeCount = 0;

  for (const sectionAssignmentPair of sectionAssignmentPairs) {
    const firstRangeSet: Set<number> = getSectionAssignmentRangeSet(
      sectionAssignmentPair[0]
    );
    const secondRangeSet: Set<number> = getSectionAssignmentRangeSet(
      sectionAssignmentPair[1]
    );

    if (isSmallerSetContainedInLarger(firstRangeSet, secondRangeSet)) {
      fullyContainedRangeCount++;
    }
  }

  return fullyContainedRangeCount;
}

function getOverlappingRangesCount(
  sectionAssignmentPairs: Array<SectionAssignmentPair>
): number {
  let overlappingRangeCount = 0;

  for (let i = 0; i < sectionAssignmentPairs.length; i++) {
    const sectionAssignmentPair = sectionAssignmentPairs[i];

    const firstRangeSet: Set<number> = getSectionAssignmentRangeSet(
      sectionAssignmentPair[0]
    );
    const secondRange: SectionAssignmentRange = sectionAssignmentPair[1];
    let secondRangeCurrent = secondRange[0];
    let secondRangeEnd = secondRange[1];

    while (secondRangeCurrent <= secondRangeEnd) {
      if (firstRangeSet.has(secondRangeCurrent)) {
        overlappingRangeCount++;
        break;
      }
      secondRangeCurrent++;
    }
  }

  return overlappingRangeCount;
}

function getSectionAssignmentRangeSet(
  sectionAssignmentRange: SectionAssignmentRange
): Set<number> {
  const sectionAssignmentRangeSet: Set<number> = new Set();
  let currentNumber = sectionAssignmentRange[0];
  const endNumber = sectionAssignmentRange[1];

  while (currentNumber <= endNumber) {
    sectionAssignmentRangeSet.add(currentNumber);
    currentNumber++;
  }

  return sectionAssignmentRangeSet;
}

function isSmallerSetContainedInLarger(
  firstSet: Set<number>,
  secondSet: Set<number>
): boolean {
  let smallSet: Set<number> | null = null;
  let largeSet: Set<number> | null = null;

  if (firstSet.size > secondSet.size) {
    largeSet = firstSet;
    smallSet = secondSet;
  } else {
    largeSet = secondSet;
    smallSet = firstSet;
  }

  return Array.from(smallSet).every((num) => largeSet && largeSet.has(num));
}
