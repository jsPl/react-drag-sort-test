import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import classNames from 'classnames';
import './App.css';
import { coffees as data } from './data.js';
import DragHandle from './drag-handle.svg';

function App() {
  const [items, setItems] = useState(data);
  const [isSortEnabled, setSortEnabled] = useState(true);

  const handleDragStart = ({ active }) => {
    if (!active) {
      return;
    }
  }

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
    <div className="app">
      <div>
        <div className="container">
          <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              {items.map(o => <SortableItem key={o.id} data={o} disabled={!isSortEnabled} />)}
            </SortableContext>
          </DndContext>
        </div>
        <button type="button" onClick={() => setSortEnabled(prev => !prev)}>
          {isSortEnabled ? 'disable sort' : 'enable sort'}
        </button>
      </div>
      <pre className="state">
        {JSON.stringify(items.map(({ id, blend_name }) => ({ id, blend_name })), undefined, 2)}
      </pre>
    </div>
  );
}

const SortableItem = ({ data, disabled }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: data.id, disabled });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 100 : undefined
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={classNames({ item: true, sortable: !disabled })}>
      <div>
        <div className="title">{data.blend_name}</div>
        <div className="desc">{data.origin}</div>
      </div>
      {!disabled && <img src={DragHandle} alt="Drag handle" className="dragHandle" {...listeners}
        title={!disabled ? "Drag to sort" : null} />}
    </div>
  );
}

export default App;