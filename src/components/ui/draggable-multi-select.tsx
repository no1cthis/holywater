import type { SelectProps } from 'antd/es/select';

import { Select, Tag, theme } from 'antd';
import React, { type FC, useEffect, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export type DraggableMultiSelectProps<ValueType = any> = Omit<SelectProps<ValueType | ValueType[]>, 'onChange'> & {
  onChange?: (value: ValueType[]) => void;
  value?: ValueType[];
};

export interface SelectOption {
  disabled?: boolean;
  label: React.ReactNode;
  value: any;
}

// Interface for drag item
interface DragItem {
  id: number | string;
  index: number;
  type: string;
}

// The main component
export const DraggableMultiSelect:FC<DraggableMultiSelectProps> = props => {
  const { 
    disabled = false, 
    onChange,
    options = [],
    placeholder = "Select items",
    style,
    value = [],
    ...restProps 
  } = props;
  
  const { token } = theme.useToken();
  const [selectedItems, setSelectedItems] = useState<string[]>(value);
  const [isOpen, setIsOpen] = useState(false);
  
  // Update internal state when value prop changes
  useEffect(() => {
    setSelectedItems(value);
  }, [value]);

  // Handle selection changes
  const handleChange = (newValue: string[]) => {
    setSelectedItems(newValue);
    onChange?.(newValue);
  };

  // Remove a specific item
  const handleRemoveItem = (itemToRemove: string) => {
    const newItems = selectedItems.filter(item => item !== itemToRemove);
    handleChange(newItems);
  };

  // Move item in the array (reorder)
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const newItems = [...selectedItems];
    const draggedItem = newItems[dragIndex];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, draggedItem);
    handleChange(newItems);
  };

  // The draggable tag component
  const DraggableTag: React.FC<{
    index: number;
    item: string;
    moveItem: (dragIndex: number, hoverIndex: number) => void;
    onRemove: () => void;
  }> = ({ index, item, moveItem, onRemove }) => {
    const ref = useRef<HTMLDivElement>(null);
    
    // Find the label for this value
    const option = options.find(opt => opt.value === item);
    const label = option?.label || item;
    
    // Set up drag handler
    const [{ isDragging }, drag] = useDrag({
      canDrag: () => !disabled,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      item: (): DragItem => ({ id: item, index, type: 'DRAGGABLE_TAG' }),
      type: 'DRAGGABLE_TAG',
    });

    // Set up drop handler
    const [, drop] = useDrop({
      accept: 'DRAGGABLE_TAG',
      hover: (draggedItem: DragItem, monitor) => {
        if (!ref.current || draggedItem.index === index || disabled) {
          return;
        }

        const dragIndex = draggedItem.index;
        const hoverIndex = index;

        // Determine rectangle on screen
        const hoverBoundingRect = ref.current.getBoundingClientRect();
        
        // Get horizontal middle
        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
        
        // Determine mouse position
        const clientOffset = monitor.getClientOffset();
        
        // Get pixels to the left
        const hoverClientX = clientOffset ? clientOffset.x - hoverBoundingRect.left : 0;

        // Only perform the move when the mouse has crossed half of the items width
        if ((dragIndex < hoverIndex && hoverClientX < hoverMiddleX) ||
            (dragIndex > hoverIndex && hoverClientX > hoverMiddleX)) {
          return;
        }

        moveItem(dragIndex, hoverIndex);
        draggedItem.index = hoverIndex;
      },
    });

    // Apply both handlers to the ref
    drag(drop(ref));

    return (
      <Tag
        closable={!disabled}
        onClose={() => { onRemove(); }}
        ref={ref}
        style={{
          background: token.colorBgContainer,
          borderColor: isDragging ? token.colorPrimary : token.colorBorder,
          boxShadow: isDragging ? `0 0 5px ${token.colorPrimaryBorder}` : 'none',
          cursor: disabled ? 'default' : isDragging ? 'grabbing' : 'grab',
          margin: '2px 4px 2px 0',
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ position: 'relative', ...style }}>
        {/* Selected items with drag-drop capability */}
        <div 
          onClick={() => { setIsOpen(true); }}
          style={{ 
            background: token.colorBgContainer,
            border: `1px solid ${isOpen ? token.colorPrimary : token.colorBorder}`,
            borderRadius: token.borderRadius,
            cursor: 'text',
            display: 'flex',
            flexWrap: 'wrap',
            minHeight: '32px',
            padding: '4px 4px 0',
          }}
        >
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => (
              <DraggableTag
                index={index}
                item={item}
                key={item}
                moveItem={moveItem}
                onRemove={() => { handleRemoveItem(item); }}
              />
            ))
          ) : (
            <div style={{ 
              color: token.colorTextPlaceholder,
              lineHeight: '30px',
              padding: '0 8px',
            }}>
              {placeholder}
            </div>
          )}
        </div>
        
        {/* Actual Select component for selection */}
        <div style={{ position: 'relative' }}>
          <Select
            disabled={disabled}
            mode="multiple"
            onChange={handleChange}
            onDropdownVisibleChange={setIsOpen}
            open={isOpen}
            options={options}
            style={{ height:0, left: 0, opacity: 0, position: 'absolute', top: 0, width: '100%' }}
            value={selectedItems}
            {...restProps}
          />
        </div>
      </div>
    </DndProvider>
  );
};