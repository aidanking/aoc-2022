import { cwd } from 'process';
import { FileHandle, open, readFile } from 'node:fs/promises';
import path from 'node:path';

async function readDataFromFileAsStringArray(
  day: string,
  fileName: string
): Promise<string[]> {
  let file: FileHandle | null = null;
  const data: string[] = [];

  try {
    const filePath: string = getPathToTestFile(day, fileName);
    file = await open(filePath);

    for await (const line of file.readLines()) {
      data.push(line);
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (file) {
      file.close();
    }
    return data;
  }
}

async function readDataFromFileAsString(
  day: string,
  fileName: string
): Promise<string> {
  const filePath: string = getPathToTestFile(day, fileName);
  let file: string | null = null;

  try {
    file = await readFile(filePath, { encoding: 'utf-8' });
  } catch (err) {
    console.error(err);
  } finally {
    if (file) {
      return file.toString();
    } else {
      return '';
    }
  }
}

async function readDataFromFileAsNumberGrid(
  day: string,
  fileName: string
): Promise<number[][]> {
  const filePath: string = getPathToTestFile(day, fileName);
  let file: FileHandle | null = null;
  const grid: number[][] = [];

  try {
    file = await open(filePath);

    for await (const line of file.readLines()) {
      const data: number[] = [];
      for (const character of line.split('')) {
        data.push(Number(character));
      }
      grid.push(data);
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (file) {
      file.close();
    }
    return grid;
  }
}

function getPathToTestFile(day: string, fileName: string): string {
  const projectRoot = cwd();

  const pathToTestFiles = path.join(projectRoot, `src/${day}/`);

  return path.join(pathToTestFiles, fileName);
}

export {
  readDataFromFileAsStringArray,
  readDataFromFileAsString,
  readDataFromFileAsNumberGrid,
  getPathToTestFile,
};
