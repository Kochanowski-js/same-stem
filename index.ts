import * as fs from 'fs';
import * as path from 'path';

let cachedFileContent: string | null = null;
let cachedParsedContent: { [key: string]: string } | null = null;

function readFileContent(): string {
  if (cachedFileContent === null) {
    const filePath = path.join(__dirname, "sgjp-20241117-lemmatized.tab");
    cachedFileContent = fs.readFileSync(filePath, 'utf-8');
  }
  return cachedFileContent;
}

function parseFileContent(): { [key: string]: string } {
  if (cachedParsedContent === null) {
    const fileContent = readFileContent();
    const lines = fileContent.split('\n');
    cachedParsedContent = {};

    for (const line of lines) {
      const [baseForm, ...forms] = line.split('\t');
      for (const form of forms) {
        cachedParsedContent[form] = baseForm;
      }
    }
  }
  return cachedParsedContent;
}

const parsedContent = parseFileContent();

export default function sameStem(word1: string, word2: string): boolean {
  if (word1 === word2) {
    return true;
  }

  if (word1.length >= 12 && word2.length >= 12) {
    return true;
  }

  const stem1 = parsedContent[word1];
  const stem2 = parsedContent[word2];

  if (stem1 !== undefined && stem2 !== undefined) {
    return stem1 === stem2;
  }

  return levenshtein(word1, word2) <= Math.floor(Math.min(word1.length, word2.length) / 3);
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}