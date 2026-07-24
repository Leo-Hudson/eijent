'use client';

import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import { format, parse, isValid } from 'date-fns';
import 'react-day-picker/style.css';

/**
 * Compact date field with popover calendar (react-day-picker).
 * Value is always YYYY-MM-DD or empty string.
 */
const LedgerDateField = ({ id, value, onChange, placeholder = 'Select date', 'aria-label': ariaLabel }) => {
  const [open, setOpen] = React.useState(false);

  const selected = React.useMemo(() => {
    if (!value) return undefined;
    const d = parse(value, 'yyyy-MM-dd', new Date());
    return isValid(d) ? d : undefined;
  }, [value]);

  const label = selected ? format(selected, 'MMM d, yyyy') : placeholder;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          id={id}
          className={`ledger-date-trigger${selected ? '' : ' is-empty'}`}
          aria-label={ariaLabel}
        >
          <span>{label}</span>
          <CalendarIcon />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="ledger-date-popover" align="start" sideOffset={6}>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(day) => {
              onChange(day ? format(day, 'yyyy-MM-dd') : '');
              setOpen(false);
            }}
            defaultMonth={selected || new Date()}
          />
          <div className="ledger-date-popover__footer">
            <button
              type="button"
              className="ledger-date-clear"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              disabled={!value}
            >
              Clear
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
    <path d="M1.5 5.5h11" stroke="currentColor" strokeWidth="1.25" />
    <path d="M4 1.5v2M10 1.5v2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
);

export default LedgerDateField;
