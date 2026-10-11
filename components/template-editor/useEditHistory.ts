"use client";

import { useCallback, useState } from "react";

interface History<T> {
  past: T[];
  // The value as of the last recorded step.
  committed: T;
  present: T;
  future: T[];
}

const same = <T,>(a: T, b: T) => Object.is(a, b) || JSON.stringify(a) === JSON.stringify(b);

// Undo and redo for the editor. `update` changes the current value as you
// type; `commit` records it as one step (on blur, or before undo), so a
// whole edit undoes at once rather than letter by letter.
export function useEditHistory<T>(initial: T) {
  const [state, setState] = useState<History<T>>({ past: [], committed: initial, present: initial, future: [] });

  const update = useCallback((next: T | ((value: T) => T)) => {
    setState((s) => ({ ...s, present: typeof next === "function" ? (next as (value: T) => T)(s.present) : next }));
  }, []);

  const commit = useCallback(() => {
    setState((s) => (same(s.present, s.committed) ? s : { past: [...s.past, s.committed], committed: s.present, present: s.present, future: [] }));
  }, []);

  const undo = useCallback(() => {
    setState((s) => {
      // An edit still being typed counts as the last step.
      const past = same(s.present, s.committed) ? s.past : [...s.past, s.committed];
      if (!past.length) return s;
      const previous = past[past.length - 1];
      return { past: past.slice(0, -1), committed: previous, present: previous, future: [s.present, ...s.future] };
    });
  }, []);

  const redo = useCallback(() => {
    setState((s) => {
      if (!s.future.length) return s;
      const [next, ...future] = s.future;
      return { past: [...s.past, s.present], committed: next, present: next, future };
    });
  }, []);

  // Start over from a value, with no history (after discarding changes).
  const reset = useCallback((value: T) => {
    setState({ past: [], committed: value, present: value, future: [] });
  }, []);

  return {
    value: state.present,
    update,
    commit,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0 || !same(state.present, state.committed),
    canRedo: state.future.length > 0,
  };
}
