# same-stem

`same-stem` is a helper package that contains one function, which compares 2 words of the **Polish** Language and checks whether they have the same stem.

## Usage

```js
import sameStem from 'same-stem';

const word1 = 'jabłko';
const word2 = 'jabłkiem';

const result = sameStem(word1, word2);
console.log(result); // true
```