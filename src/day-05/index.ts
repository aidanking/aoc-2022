import { FileHandle, open } from 'node:fs/promises';
import { getPathToTestFile } from '../helpers.js';

interface DrawingFileData {
  stacks: string[];
  instructions: string[];
}

interface Drawing {
  stacks: Array<Array<string>>;
  instructions: Instruction[];
}

interface Instruction {
  count: number;
  source: number;
  destination: number;
}

console.log(await getTopCrateEachStack('test.txt'));
console.log(await getTopCrateEachStack('input.txt'));
console.log(await getTopCrateEachStackKeepOrder('test.txt'));
console.log(await getTopCrateEachStackKeepOrder('input.txt'));

async function getTopCrateEachStack(fileName: string): Promise<string> {
  const drawing: Drawing = await getDrawingData(fileName);

  for (const instruction of drawing.instructions) {
    const sourceStack = drawing.stacks[instruction.source - 1];
    const destinationStack = drawing.stacks[instruction.destination - 1];

    const cratesToAdd = getCratesToAdd(sourceStack, instruction);

    addCratesToDestinationStack(destinationStack, cratesToAdd);
  }

  return getTopCratesAnswerString(drawing);
}

async function getTopCrateEachStackKeepOrder(
  fileName: string
): Promise<string> {
  const drawing: Drawing = await getDrawingData(fileName);

  for (const instruction of drawing.instructions) {
    const sourceStack = drawing.stacks[instruction.source - 1];
    const destinationStack = drawing.stacks[instruction.destination - 1];

    const cratesToAdd = getCratesToAdd(sourceStack, instruction);

    addCratesToDestinationStackKeepOrder(destinationStack, cratesToAdd);
  }

  return getTopCratesAnswerString(drawing);
}

async function getDrawingData(fileName: string): Promise<Drawing> {
  const fileData: DrawingFileData = await readFileData(fileName);

  const drawing: Drawing = {
    stacks: getStackData(fileData.stacks),
    instructions: getInstructionData(fileData.instructions),
  };

  return drawing;
}

async function readFileData(fileName: string): Promise<DrawingFileData> {
  let fileData: DrawingFileData = { stacks: [], instructions: [] };
  let file: FileHandle | null = null;

  try {
    const filePath = getPathToTestFile('day-05', fileName);
    file = await open(filePath);
    let blankLineFound = false;

    for await (const line of file.readLines()) {
      if (line === '') {
        blankLineFound = true;
      } else if (!blankLineFound) {
        fileData.stacks.push(line);
      } else {
        fileData.instructions.push(line);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (file) {
      file.close();
    }
    return fileData;
  }
}

function getStackData(stacks: string[]): Array<Array<string>> {
  const lastStacksLine = stacks.pop() || '';
  const resultStacks: Array<Array<string>> = [];

  for (const character of lastStacksLine) {
    if (isNumber(character)) {
      resultStacks.push([]);
    }
  }

  for (let i = stacks.length - 1; i >= 0; i--) {
    const stackLine: string = stacks[i];

    let j = 1;
    let stackIndex = 0;

    while (j < stackLine.length) {
      const currentCharacter = stackLine[j];
      const currentStack = resultStacks[stackIndex];

      if (isUpperCharacter(currentCharacter)) {
        currentStack.push(currentCharacter);
      }

      j += 4;
      stackIndex++;
    }
  }

  return resultStacks;
}

function getInstructionData(instructions: Array<string>) {
  const instructionsResult: Instruction[] = [];
  const regex = /move (\d+) from (\d+) to (\d+)/g;

  for (const instructionString of instructions) {
    const regexData = instructionString.matchAll(regex);

    for (const data of regexData) {
      const instruction: Instruction = {
        count: Number(data[1]),
        source: Number(data[2]),
        destination: Number(data[3]),
      };
      instructionsResult.push(instruction);
    }
  }

  return instructionsResult;
}

function getCratesToAdd(
  sourceStack: string[],
  instruction: Instruction
): string[] {
  const cratesToAdd: string[] = [];

  let i = 1;

  while (i <= instruction.count) {
    const crateToAdd = sourceStack.pop();
    if (crateToAdd) {
      cratesToAdd.push(crateToAdd);
    }
    i++;
  }

  return cratesToAdd;
}

function addCratesToDestinationStack(
  destinationStack: string[],
  cratesToAdd: string[]
) {
  for (const crate of cratesToAdd) {
    destinationStack.push(crate);
  }
}

function addCratesToDestinationStackKeepOrder(
  destinationStack: string[],
  cratesToAdd: string[]
) {
  for (const crate of cratesToAdd.reverse()) {
    destinationStack.push(crate);
  }
}

function getTopCratesAnswerString(drawing: Drawing) {
  const topCrates: string[] = [];

  for (const stack of drawing.stacks) {
    const crate = stack.pop();
    if (crate) {
      topCrates.push(crate);
    }
  }

  return topCrates.join('');
}

function isNumber(str: string): boolean {
  return /^\d+$/.test(str);
}

function isUpperCharacter(str: string): boolean {
  return /^[A-Z]+$/.test(str);
}
