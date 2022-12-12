import { open } from 'node:fs/promises';
import { getPathToTestFile } from '../helpers.js';

interface MatchResult {
  winner: 'A' | 'B' | 'C' | 'X' | 'Y' | 'Z' | 'DRAW';
  winnerPoints: number;
  loserPoints: number;
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

const matchResults: MatchResults = {
  AX: { winner: 'DRAW', winnerPoints: 4, loserPoints: 4 },
  AY: { winner: 'Y', winnerPoints: 8, loserPoints: 1 },
  AZ: { winner: 'A', winnerPoints: 7, loserPoints: 3 },
  BX: { winner: 'B', winnerPoints: 8, loserPoints: 1 },
  BY: { winner: 'DRAW', winnerPoints: 5, loserPoints: 5 },
  BZ: { winner: 'Z', winnerPoints: 9, loserPoints: 2 },
  CX: { winner: 'X', winnerPoints: 7, loserPoints: 3 },
  CY: { winner: 'C', winnerPoints: 9, loserPoints: 2 },
  CZ: { winner: 'DRAW', winnerPoints: 6, loserPoints: 6 },
};

const testPairings: MatchPairing[] = await readMatchDataFromFile('test.txt');

const inputPairings: MatchPairing[] = await readMatchDataFromFile('input.txt');

console.log(getTotalPointsAimingWinAll(testPairings));
console.log(getTotalPointsAimingWinAll(inputPairings));
console.log(getTotalPointsAimingWinSelect(testPairings));
console.log(getTotalPointsAimingWinSelect(inputPairings));

async function readMatchDataFromFile(
  fileName: string
): Promise<MatchPairing[]> {
  const data: MatchPairing[] = [];
  let file = null;
  try {
    const pathToFile: string = getPathToTestFile('day-02', fileName);

    file = await open(pathToFile);

    for await (const line of file.readLines()) {
      const id: MatchPairing = line.split(' ').join('') as MatchPairing;
      data.push(id);
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (file) {
      file.close();
    }
  }
  return data;
}

function getTotalPointsAimingWinAll(matchPairings: MatchPairing[]) {
  return getTotalPoints(matchPairings, matchResults);
}

function getTotalPointsAimingWinSelect(matchPairings: MatchPairing[]) {
  const matchResultsWinSelect: MatchResults = {
    AX: matchResults.AZ,
    AY: matchResults.AX,
    AZ: matchResults.AY,
    BX: matchResults.BX,
    BY: matchResults.BY,
    BZ: matchResults.BZ,
    CX: matchResults.CY,
    CY: matchResults.CZ,
    CZ: matchResults.CX,
  };

  return getTotalPoints(matchPairings, matchResultsWinSelect);
}

function getTotalPoints(
  matchPairings: MatchPairing[],
  matchResults: MatchResults
) {
  let totalPointsForMe = 0;

  matchPairings.forEach((mathPairing: MatchPairing): void => {
    const matchResult: MatchResult = matchResults[mathPairing];
    const winner = matchResult.winner;
    if (
      winner === 'X' ||
      winner === 'Y' ||
      winner === 'Z' ||
      winner === 'DRAW'
    ) {
      totalPointsForMe += matchResult.winnerPoints;
    } else {
      totalPointsForMe += matchResult.loserPoints;
    }
  });

  return totalPointsForMe;
}
