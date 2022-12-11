import { open } from 'node:fs/promises';
import { getPathToTestFile } from '../helpers.js';

interface MatchResult {
  winner: 'A' | 'B' | 'C' | 'X' | 'Y' | 'Z' | 'DRAW';
  points: number;
}

type MatchPairing =
  | 'AX'
  | 'AY'
  | 'AZ'
  | 'BX'
  | 'BY'
  | 'BZ'
  | 'CX'
  | 'CY'
  | 'CZ';

type MatchResults = {
  [key in MatchPairing]: MatchResult;
};

const matchPairingsOne: MatchPairing[] = await readMatchDataFromFile(
  'test.txt'
);

console.log(getTotalPointsForMe(matchPairingsOne));

async function readMatchDataFromFile(
  fileName: string
): Promise<MatchPairing[]> {
  const data: MatchPairing[] = [];
  try {
    const pathToFile: string = getPathToTestFile('day-02', fileName);
    console.log(pathToFile);

    const file = await open(pathToFile);

    for await (const line of file.readLines()) {
      const id: MatchPairing = line.split(' ').join('') as MatchPairing;
      data.push(id);
    }

    return data;
  } catch (err) {
    return [];
  }
}

function getTotalPointsForMe(matchPairings: MatchPairing[]) {
  const matchResults: MatchResults = {
    AX: { winner: 'DRAW', points: 3 },
    AY: { winner: 'Y', points: 8 },
    AZ: { winner: 'A', points: 7 },
    BX: { winner: 'B', points: 8 },
    BY: { winner: 'DRAW', points: 3 },
    BZ: { winner: 'Z', points: 9 },
    CX: { winner: 'X', points: 7 },
    CY: { winner: 'C', points: 9 },
    CZ: { winner: 'DRAW', points: 3 }
  };

  let totalPointsForMe = 0;

  matchPairingsOne.forEach((mathPairing: MatchPairing): void => {
    const matchResult: MatchResult = matchResults[mathPairing];
    const winner = matchResult.winner;
    if (
      winner === 'X' ||
      winner === 'Y' ||
      winner === 'Z' ||
      winner === 'DRAW'
    ) {
      totalPointsForMe += matchResult.points;
    }
  });

  return totalPointsForMe;
}

