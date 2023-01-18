import { readDataFromFileAsStringArray } from '../helpers.js';
const FILE_SYSTEM_SIZE = 70000000;
const AMOUNT_TO_REMOVE = 30000000;

interface FileSystem {
  rootDirectory: File;
  allDirectories: File[];
}

class File {
  public name: string = '';
  public parent: File | null = null;
  private children: File[] = [];
  private _size = 0;

  constructor(name: string, size: number) {
    this.name = name;
    this._size = size;
  }

  get size(): number {
    const children = this.children;

    let total = this._size;

    for (const child of children) {
      total += child.size;
    }

    return total;
  }

  set size(value: number) {
    this._size = value;
  }

  public addChild(child: File): File {
    this.children.push(child);

    return child;
  }

  public getChildByName(name: string): File | undefined {
    return this.children.find((x) => x.name === name);
  }

  public getAllChildren(): File[] {
    return this.children;
  }
}

interface Command {
  program: string;
  arg: string;
  rootDirectory: File;
  currentDirectory: File;
}

const testData = await readDataFromFileAsStringArray('day-07', 'test.txt');
const inputData = await readDataFromFileAsStringArray('day-07', 'input.txt');

const testDataFileSystem = buildFileSystemFromInput(testData);
const inputDataFileSystem = buildFileSystemFromInput(inputData);

console.log(getSumSmallDirectories(testDataFileSystem));
console.log(getSumSmallDirectories(inputDataFileSystem));
console.log(getSmallestDirectoryGreaterThanTarget(testDataFileSystem));
console.log(getSmallestDirectoryGreaterThanTarget(inputDataFileSystem));

function getSumSmallDirectories(fileSystem: FileSystem): number {
  const allDirectories: File[] = fileSystem.allDirectories;

  return allDirectories
    .filter((x) => x.size < 100000)
    .reduce((acc, current) => acc + current.size, 0);
}

function getSmallestDirectoryGreaterThanTarget(fileSystem: FileSystem): number {
  const allDirectories: File[] = fileSystem.allDirectories;
  const rootDirectory = fileSystem.rootDirectory;

  const unusedSpace = FILE_SYSTEM_SIZE - rootDirectory.size;

  let smallestDirectory: File = new File('start', Infinity);

  for (const currentDirectory of allDirectories) {
    if (
      unusedSpace + currentDirectory.size >= AMOUNT_TO_REMOVE &&
      currentDirectory.size < smallestDirectory.size
    ) {
      smallestDirectory = currentDirectory;
    }
  }

  return smallestDirectory.size;
}

function buildFileSystemFromInput(lines: string[]): FileSystem {
  const rootDirectory = new File('root', 0);
  let currentDirectory: File = rootDirectory;
  const allDirectories: File[] = [rootDirectory];
  for (const line of lines) {
    const lineParts: string[] = line.split(' ');

    if (currentDirectory) {
      if (lineParts[0] === '$') {
        currentDirectory = processCommand({
          program: lineParts[1],
          arg: lineParts[2],
          rootDirectory,
          currentDirectory,
        });
      } else if (lineParts[0] === 'dir') {
        const newDirectory = new File(lineParts[1], 0);
        newDirectory.parent = currentDirectory;
        currentDirectory.addChild(newDirectory);
        allDirectories.push(newDirectory);
      } else {
        const newFile = new File(lineParts[1], Number(lineParts[0]));
        currentDirectory.addChild(newFile);
      }
    }
  }
  currentDirectory = rootDirectory;
  return { rootDirectory, allDirectories };
}

function processCommand(command: Command): File {
  if (command.program === 'cd') {
    if (command.arg === '/') {
      command.currentDirectory = command.rootDirectory;
    } else if (command.arg === '..') {
      if (command.currentDirectory.parent) {
        command.currentDirectory = command.currentDirectory.parent;
      }
    } else {
      if (command.currentDirectory) {
        const newDirectory = command.currentDirectory.getChildByName(
          command.arg
        );
        const oldDirectory = command.currentDirectory;
        if (newDirectory) {
          command.currentDirectory = newDirectory;
          command.currentDirectory.parent = oldDirectory;
        }
      }
    }
  }

  return command.currentDirectory;
}
