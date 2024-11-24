import * as fs from 'fs';
import * as path from 'path';

export default function sameStem(word1: string, word2: string): boolean {
  
  if (word1 === word2) {
    return true;
  }

  if (word1.length >= 12 && word2.length >= 12) {
    return true;
  }

  const stem1 = getStem(word1);
  const stem2 = getStem(word2);

  if (stem1 !== undefined && stem2 !== undefined) {
    return stem1 === stem2;
  }

  return levenshtein(word1, word2) <= Math.floor(Math.min(word1.length, word2.length) / 3);

}

/**
 * @param word Input word, a string
 * @returns Base form of the word
 */
function getStem(word: string): string | undefined {
  const filePath = path.join(__dirname, "../data/sgjp-20241117-lemmatized.tab");
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('\n');

  for (const line of lines) {
    const [baseForm, ...forms] = line.split('\t');
    if (forms.includes(word)) {
      return baseForm;
    }
  }

  return undefined
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];

  // increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
  }

  // increment each column in the first row
  for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
  }

  // fill in the rest of the matrix
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