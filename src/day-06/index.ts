import {
  readDataFromFileAsStringArray,
  readDataFromFileAsString,
} from '../helpers.js';

const testData: string[] = await readDataFromFileAsStringArray(
  'day-06',
  'test.txt'
);
const inputData = await readDataFromFileAsString('day-06', 'input.txt');

console.log(await getEndCharacterUniqueSequenceEachDatastream(4, testData));
console.log(getEndCharacterOfUniqueSequenceOfLength(4, inputData));
console.log(await getEndCharacterUniqueSequenceEachDatastream(14, testData));
console.log(getEndCharacterOfUniqueSequenceOfLength(14, inputData));

async function getEndCharacterUniqueSequenceEachDatastream(
  sequenceLength: number,
  data: string[]
): Promise<string> {
  const result: number[] = [];

  for (const datastream of data) {
    result.push(
      getEndCharacterOfUniqueSequenceOfLength(sequenceLength, datastream)
    );
  }

  return result.join(',');
}

function getEndCharacterOfUniqueSequenceOfLength(
  sequenceLength: number,
  datastream: string
): number {
  let start = 0;
  let end = sequenceLength - 1;
  const characterCount: Map<string, number> = new Map();
  expandWindowToLengthFour(end, datastream, characterCount);

  if (isUniqueSequenceOfLength(sequenceLength, characterCount)) {
    return end + 1;
  }
  while (start < datastream.length && end < datastream.length) {
    removeCharacterAtStartWindow(start, datastream, characterCount);
    start++;

    end++;
    addCharacterToEndWindow(end, datastream, characterCount);

    if (isUniqueSequenceOfLength(sequenceLength, characterCount)) {
      return end + 1;
    }
  }

  return -1;
}

function expandWindowToLengthFour(
  end: number,
  datastream: string,
  characterCount: Map<string, number>
): void {
  let current = 0;

  while (current <= end) {
    const currentCharacter = datastream[current];
    if (characterCount.has(currentCharacter)) {
      characterCount.set(
        currentCharacter,
        (characterCount.get(currentCharacter) || 0) + 1
      );
    } else {
      characterCount.set(currentCharacter, 1);
    }

    current++;
  }
}

function removeCharacterAtStartWindow(
  start: number,
  datastream: string,
  characterCount: Map<string, number>
): void {
  const startCharacter = datastream[start];
  if ((characterCount.get(startCharacter) || 0) > 0) {
    if (characterCount.get(startCharacter) === 1) {
      characterCount.delete(startCharacter);
    } else {
      characterCount.set(
        startCharacter,
        (characterCount.get(startCharacter) || 0) - 1
      );
    }
  }
}

function addCharacterToEndWindow(
  end: number,
  datastream: string,
  characterCount: Map<string, number>
): void {
  const endCharacter = datastream[end];
  if (characterCount.has(endCharacter)) {
    characterCount.set(
      endCharacter,
      (characterCount.get(endCharacter) || 0) + 1
    );
  } else {
    characterCount.set(endCharacter, 1);
  }
}

function isUniqueSequenceOfLength(
  sequenceLength: number,
  characterCount: Map<string, number>
): boolean {
  return (
    characterCount.size === sequenceLength &&
    Array.from(characterCount.keys()).every(
      (key) => characterCount.get(key) === 1
    )
  );
}
