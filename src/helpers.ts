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
    const filePath = getPathToTestFile(day, fileName);
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
  const filePath = getPathToTestFile(day, fileName);
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

function getPathToTestFile(day: string, fileName: string): string {
  const projectRoot = cwd();

  const pathToTestFiles = path.join(projectRoot, `src/${day}/`);

  return path.join(pathToTestFiles, fileName);
}

export {
  readDataFromFileAsStringArray,
  readDataFromFileAsString,
  getPathToTestFile,
};
