export interface DiffSegment {
  type: 'equal' | 'delete' | 'insert';
  text: string;
}

function tokenize(text: string): string[] {
  return text.match(/\S+|\s+/g) ?? [];
}

/**
 * Word-level diff between two short phrases (e.g. a correction's "wrong" and
 * "correct" fields), via the standard LCS algorithm. Returns the minimal set
 * of equal/delete/insert segments needed to turn `before` into `after`, so a
 * correction can highlight only the words that actually changed rather than
 * re-displaying the whole phrase as if every word were different.
 *
 * Whitespace is tokenized alongside words so exact spacing falls out of the
 * diff itself, with no separate join/spacing logic needed at render time.
 */
export function diffWords(before: string, after: string): DiffSegment[] {
  const a = tokenize(before);
  const b = tokenize(after);
  const n = a.length;
  const m = b.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const segments: DiffSegment[] = [];
  function push(type: DiffSegment['type'], text: string) {
    const last = segments[segments.length - 1];
    if (last && last.type === type) {
      last.text += text;
    } else {
      segments.push({ type, text });
    }
  }

  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      push('equal', a[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      push('delete', a[i]);
      i++;
    } else {
      push('insert', b[j]);
      j++;
    }
  }
  while (i < n) {
    push('delete', a[i]);
    i++;
  }
  while (j < m) {
    push('insert', b[j]);
    j++;
  }

  return segments;
}
