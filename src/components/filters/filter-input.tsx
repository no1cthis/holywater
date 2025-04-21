import type { CrudOperators, LogicalFilter } from '@refinedev/core';
import { Input, Select, Space, Typography } from 'antd';
import React, { useState } from 'react';

const { Text } = Typography;

export interface FilterInputProps {
  allowClear?: boolean;
  field: string;
  label?: string;
  onApply: (filter: LogicalFilter) => void;
  onRemove?: () => void;
  operator?: LogicalFilter['operator'];
  options?: { label: string; value: string }[];
  placeholder?: string;
  showLabel?: boolean;
  style?: React.CSSProperties;
  type?: 'multi-select' | 'select' | 'text';
  value?: string | string[];
}

/**
 * A generic filter input component that can be used in list pages
 * with Refine's filter system.
 */
export const FilterInput: React.FC<FilterInputProps> = ({
  allowClear = true,
  field,
  label,
  onApply,
  onRemove,
  operator = 'contains',
  options = [],
  placeholder,
  showLabel = true,
  style,
  type = 'text',
  value = '',
}) => {
  const [inputValue, setInputValue] = useState<string | string[]>(value);
  const displayLabel = label || field.charAt(0).toUpperCase() + field.slice(1);
  
  const handleApplyFilter = (newValue: string | string[]) => {
    // Skip empty strings but allow arrays with values
    if (newValue === '' || (Array.isArray(newValue) && newValue.length === 0)) {
      onRemove?.();
      return;
    }

    let filterOperator: CrudOperators = operator;
    
    // Adjust the operator based on the filter type
    if (type === 'multi-select') {
      filterOperator = 'in';

    } else if (type === 'text') {
      filterOperator = 'contains';
    }

    onApply({
      field,
      operator: filterOperator,
      value: newValue,
    });
  };

  const handleChange = (val: string | string[]) => {
    setInputValue(val);
    handleApplyFilter(val);
  };

  const handleClear = () => {
    setInputValue(type === 'multi-select' ? [] : '');
    onRemove?.();
  };

  return (
    <div style={{ marginRight: 16, ...style }}>
      {showLabel && <Text style={{ display: 'block', marginBottom: 4 }}>{displayLabel}</Text>}
      
      {type === 'text' && (
        <Input
          allowClear={allowClear}
          onChange={(e) => { handleChange(e.target.value); }}
          onPressEnter={(e) => { handleApplyFilter((e.target as HTMLInputElement).value); }}
          placeholder={placeholder || `Search by ${displayLabel.toLowerCase()}`}
          style={{ width: 200 }}
          value={inputValue as string}
        />
      )}
      
      {type === 'select' && (
        <Select
          allowClear={allowClear}
          onChange={handleChange}
          onClear={handleClear}
          options={options}
          placeholder={placeholder || `Select ${displayLabel.toLowerCase()}`}
          style={{ width: 200 }}
          value={inputValue as string}
        />
      )}

      {type === 'multi-select' && (
        <Select
          allowClear={allowClear}
          mode="multiple"
          onChange={handleChange}
          onClear={handleClear}
          options={options}
          placeholder={placeholder || `Select ${displayLabel.toLowerCase()}`}
          style={{ width: 200 }}
          value={inputValue as string[]}
        />
      )}
    </div>
  );
};

/**
 * A container for multiple FilterInput components with consistent spacing
 */
export const FilterContainer: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  return (
    <Space style={{ marginBottom: 16, ...style }} wrap>
      {children}
    </Space>
  );
};