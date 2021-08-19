import React from 'react';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import classNames from 'classnames';
import DragHandle from './drag-handle.svg';

export const SORT_MODE = {
  VERTICAL: "vertical",
  HORIZONTAL: "horizontal",
  GRID: "grid"
}

const ListSort = ({ items, setItems, isSortEnabled = true, renderItem, sortMode = SORT_MODE.VERTICAL }) => {
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
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement, ...chooseModifiers(sortMode)]}
    >
      <SortableContext
        items={items}
        strategy={chooseSortStrategy(sortMode)}
      >
        {items.map((o, idx) => <SortableItem key={o.id} idx={idx} data={o} disabled={!isSortEnabled} renderItem={renderItem} />)}
      </SortableContext>
    </DndContext>
  )
}

const SortableItem = ({ data, disabled, idx, renderItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: data.id, disabled });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 100 : undefined
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={classNames({ item: true, sortable: !disabled })}>
      {renderItem(data, idx)}
      {!disabled && <img src={DragHandle} alt="Drag handle" className="dragHandle" {...listeners}
        title={!disabled ? "Drag to sort" : null} />}
    </div>
  );
}

const chooseSortStrategy = sortMode => {
  switch (sortMode) {
    case SORT_MODE.VERTICAL:
      return verticalListSortingStrategy;

    case SORT_MODE.HORIZONTAL:
      return horizontalListSortingStrategy;

    default:
      return rectSortingStrategy;
  }
}

const chooseModifiers = sortMode => {
  switch (sortMode) {
    case SORT_MODE.VERTICAL:
      return [restrictToVerticalAxis];

    case SORT_MODE.HORIZONTAL:
      return [restrictToHorizontalAxis];

    default:
      return [];
  }
}

export default ListSort;