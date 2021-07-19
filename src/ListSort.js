import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import classNames from 'classnames';
import DragHandle from './drag-handle.svg';

const ListSort = ({ items, setItems, isSortEnabled = true, renderRow }) => {
  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(o => o.id === active.id);
        const newIndex = items.findIndex(o => o.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
      >
        {items.map((o, idx) => <SortableItem key={o.id} idx={idx} data={o} disabled={!isSortEnabled} renderRow={renderRow} />)}
      </SortableContext>
    </DndContext>
  )
}

const SortableItem = ({ data, disabled, idx, renderRow }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: data.id, disabled });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 100 : undefined
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={classNames({ item: true, sortable: !disabled })}>
      {renderRow(data, idx)}
      {!disabled && <img src={DragHandle} alt="Drag handle" className="dragHandle" {...listeners}
        title={!disabled ? "Drag to sort" : null} />}
    </div>
  );
}

export default ListSort;