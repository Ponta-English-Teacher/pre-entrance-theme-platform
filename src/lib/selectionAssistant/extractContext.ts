/**
 * Pure DOM utilities for turning a browser text `Selection` into the
 * context payload the AI needs: the exact selected text, the sentence it
 * sits in, and the surrounding paragraph. No React, no side effects —
 * easy to unit test in isolation.
 */

const BLOCK_TAGS = new Set([
  'P', 'DIV', 'LI', 'TD', 'TH', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SECTION', 'ARTICLE',
]);

/** Walk up from a node to the nearest block-level ancestor, so we have a
 *  sensible "paragraph" boundary even when the selection starts inside a
 *  nested <span> (e.g. the sr-only paragraph-number label). */
export function findContainingBlock(node: Node): HTMLElement | null {
  let el: HTMLElement | null = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
  let hops = 0;
  while (el && hops < 8) {
    if (BLOCK_TAGS.has(el.tagName)) return el;
    el = el.parentElement;
    hops++;
  }
  return el;
}

/** Splits on sentence-ending punctuation while keeping the punctuation
 *  attached to its sentence. Good enough for English learning-material
 *  prose; not meant to handle abbreviations perfectly. */
export function splitIntoSentences(text: string): string[] {
  const matches = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g);
  return matches ? matches.map(s => s.trim()).filter(Boolean) : [text.trim()];
}

/** Finds the sentence (from the full paragraph) that contains the
 *  selected text, falling back gracefully if the selection spans a
 *  sentence boundary or whitespace doesn't line up exactly. */
export function findSurroundingSentence(paragraphText: string, selectedText: string): string {
  const sentences = splitIntoSentences(paragraphText);
  const exact = sentences.find(s => s.includes(selectedText));
  if (exact) return exact;

  const firstWord = selectedText.trim().split(/\s+/)[0];
  const fallback = firstWord ? sentences.find(s => s.includes(firstWord)) : undefined;
  return fallback ?? paragraphText;
}

export interface ExtractedSelection {
  text: string;
  surroundingSentence: string;
  surroundingParagraph: string;
  rect: DOMRect;
}

/** Interactive/editable elements the assistant must never activate inside,
 *  even if one somehow ends up nested inside a selectable scope. */
const EXCLUDED_TAGS = new Set(['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT', 'A']);

function isInsideExcludedElement(node: Node): boolean {
  let el: HTMLElement | null = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
  let hops = 0;
  while (el && hops < 12) {
    if (EXCLUDED_TAGS.has(el.tagName) || el.isContentEditable) return true;
    el = el.parentElement;
    hops++;
  }
  return false;
}

export function extractSelectionContext(selection: Selection): ExtractedSelection | null {
  if (selection.rangeCount === 0 || selection.isCollapsed) return null;

  const range = selection.getRangeAt(0);
  const text = selection.toString().trim();
  if (!text) return null;

  if (isInsideExcludedElement(range.commonAncestorContainer)) return null;

  const block = findContainingBlock(range.commonAncestorContainer);
  const surroundingParagraph = (block?.textContent ?? text).trim();
  const surroundingSentence = findSurroundingSentence(surroundingParagraph, text);
  const rect = range.getBoundingClientRect();

  return { text, surroundingSentence, surroundingParagraph, rect };
}
