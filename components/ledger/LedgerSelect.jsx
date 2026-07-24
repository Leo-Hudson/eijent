'use client';

import React from 'react';
import * as Select from '@radix-ui/react-select';

/**
 * Lightweight styled select for ledger filters (Radix Select).
 */
const LedgerSelect = ({
  id,
  value,
  onValueChange,
  options,
  placeholder = 'Select',
  disabled = false,
  'aria-label': ariaLabel,
}) => {
  const resolved = value === '' || value == null ? '__all__' : String(value);

  return (
    <Select.Root
      value={resolved}
      onValueChange={(next) => onValueChange(next === '__all__' ? '' : next)}
      disabled={disabled}
    >
      <Select.Trigger
        id={id}
        className="ledger-select-trigger"
        aria-label={ariaLabel}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="ledger-select-icon" aria-hidden>
          <ChevronIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="ledger-select-content" position="popper" sideOffset={6}>
          <Select.Viewport className="ledger-select-viewport">
            {options.map((opt) => {
              const optValue = opt.value === '' || opt.value == null ? '__all__' : String(opt.value);
              return (
                <Select.Item key={optValue} value={optValue} className="ledger-select-item">
                  <Select.ItemText>{opt.label}</Select.ItemText>
                </Select.Item>
              );
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
    <path
      d="M2.5 4.5L6 8l3.5-3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LedgerSelect;
