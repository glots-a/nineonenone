import {Code} from '../types/Code';

const pullOfCodes: Code[] = [];
const codeCount = new Map<string, number>();

export function getMostFrequent(codeData: Code): Code | undefined {
  codeCount.set(codeData.value, (codeCount.get(codeData.value) || 0) + 1);

  pullOfCodes.push(codeData);

  if (pullOfCodes.length === 15) {
    const mostFrequentCodeValue = [...codeCount.entries()].reduce(
      (a: [string, number], b: [string, number]) => (b[1] > a[1] ? b : a),
      ['', 0],
    )[0];

    const mostFrequentCode = pullOfCodes.find(
      c => c.value === mostFrequentCodeValue,
    );

    pullOfCodes.length = 0;
    codeCount.clear();

    return mostFrequentCode;
  }

  return undefined;
}
