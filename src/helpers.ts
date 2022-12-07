import { cwd } from 'process';
import path from 'node:path';

function getPathToTestFile(day: string, fileName: string): string {
  const projectRoot = cwd();

  const pathToTestFiles = path.join(projectRoot, `src/${day}/`);

  return path.join(pathToTestFiles, fileName);
}

export { getPathToTestFile };
