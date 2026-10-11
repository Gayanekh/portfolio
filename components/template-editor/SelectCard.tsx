"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const smooth = [0.22, 1, 0.36, 1] as const;

export interface SelectOption<T extends string> {
  id: T;
  label: string;
}

// A select after the reference dropdown: a white card showing the chosen
// option and a chevron. Opening it flips the chevron and grows the card to
// reveal the list, with a soft shadow under the header; the chosen option
// carries a dot. Pressing an option sends a ripple out from the pointer, the
// dot slides to it, and the card closes with the new value in the header.
// Keyboard: Enter/Space or arrows open it, arrows move, Enter picks, Esc closes.
export default function SelectCard<T extends string>({
  value,
  options,
  onChange,
  labelledBy,
}: {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  labelledBy?: string;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [ripple, setRipple] = useState<{ key: number; id: T; x: number; y: number } | null>(null);
  const current = options.find((o) => o.id === value) ?? options[0];

  // Close when clicking anywhere else.
  useEffect(() => {
    if (!open) return;
    const away = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);

  const show = () => {
    setActive(Math.max(0, options.findIndex((o) => o.id === value)));
    setOpen(true);
  };
  const pick = (id: T) => {
    onChange(id);
    // Let the dot reach its new place before the list folds away.
    window.setTimeout(() => setOpen(false), 220);
  };
  const press = (id: T, event: PointerEvent<HTMLButtonElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    setRipple({ key: event.timeStamp, id, x: event.clientX - box.left, y: event.clientY - box.top });
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      setOpen(false);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) return show();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + options.length) % options.length);
    } else if ((event.key === "Enter" || event.key === " ") && open) {
      event.preventDefault();
      pick(options[active].id);
    }
  };

  return (
    <motion.div
      ref={rootRef}
      layout
      transition={{ duration: 0.35, ease: smooth }}
      onKeyDown={onKey}
      className="relative overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgb(15_23_42/0.05),0_12px_32px_-14px_rgb(15_23_42/0.25)] ring-1 ring-foreground/[0.06]"
    >
      <button
        type="button"
        role="combobox"
        aria-labelledby={labelledBy}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${options[active].id}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        className={`relative z-10 flex h-12 w-full cursor-pointer items-center justify-between gap-3 bg-white px-4 text-left outline-none transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground/20 ${
          open ? "shadow-[0_8px_14px_-10px_rgb(15_23_42/0.25)]" : ""
        }`}
      >
        <span className="relative min-w-0 flex-1 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={current.id}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.25, ease: smooth }}
              className="block truncate text-sm font-medium text-foreground"
            >
              {current.label}
            </motion.span>
          </AnimatePresence>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.35, ease: smooth }} className="flex text-foreground/40">
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: smooth }}
            className="overflow-hidden"
          >
            <ul id={listId} role="listbox" aria-labelledby={labelledBy} className="m-0 list-none px-0 py-1.5">
              {options.map((option, i) => {
                const chosen = option.id === value;
                return (
                  <li key={option.id} role="none">
                    <button
                      type="button"
                      id={`${listId}-${option.id}`}
                      role="option"
                      aria-selected={chosen}
                      tabIndex={-1}
                      onPointerDown={(event) => press(option.id, event)}
                      onPointerEnter={() => setActive(i)}
                      onClick={() => pick(option.id)}
                      className={`relative flex w-full cursor-pointer items-center overflow-hidden py-2.5 pl-8 pr-4 text-left text-sm transition-colors duration-200 ${
                        chosen ? "font-medium text-foreground" : "text-foreground/60"
                      } ${active === i ? "bg-foreground/[0.03] text-foreground" : ""}`}
                    >
                      {chosen && (
                        <motion.span
                          layoutId={`${listId}-dot`}
                          transition={{ duration: 0.35, ease: smooth }}
                          className="absolute left-4 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-foreground"
                        />
                      )}
                      <span className="relative truncate">{option.label}</span>
                      <AnimatePresence>
                        {ripple?.id === option.id && (
                          <motion.span
                            key={ripple.key}
                            initial={{ scale: 0, opacity: 0.45 }}
                            animate={{ scale: 1, opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="pointer-events-none absolute size-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/15"
                            style={{ left: ripple.x, top: ripple.y }}
                          />
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
