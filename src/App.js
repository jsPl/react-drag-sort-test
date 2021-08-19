import React, { useState } from 'react';
import './App.css';
import { coffees as coffeeData, desserts as dessertData } from './data.js';
import ListSort, { SORT_MODE } from './ListSort';

function App() {
  const [coffees, setCoffees] = useState(coffeeData);
  const [desserts, setDesserts] = useState(dessertData);

  return (
    <div className="app">
      <DebugControls debugItemProps={coffees.map(({ id, blend_name }) => ({ id, blend_name }))}>
        {
          ({ isSortEnabled, sortMode }) => (
            <ListSort
              items={coffees}
              setItems={setCoffees}
              isSortEnabled={isSortEnabled}
              sortMode={sortMode}
              renderItem={itemData => (<div>
                <div className="title"><QueryLink query={itemData.blend_name}>{itemData.blend_name}</QueryLink></div>
                <div className="desc">{itemData.origin}</div>
              </div>)} />
          )
        }
      </DebugControls>

      <DebugControls debugItemProps={desserts.map(({ id, variety, topping }) => ({ id, variety, topping }))}>
        {
          ({ isSortEnabled, sortMode }) => (
            <ListSort
              items={desserts}
              setItems={setDesserts}
              isSortEnabled={isSortEnabled}
              sortMode={sortMode}
              renderItem={itemData => (<div>
                <div className="title">{itemData.variety}</div>
                <div className="desc">{itemData.topping}</div>
              </div>)} />
          )
        }
      </DebugControls>
    </div>
  );
}

const QueryLink = ({ query, children }) =>
  <a href={`https://google.pl/search?q=${query}`} target="_blank" rel="noreferrer">
    {children}
  </a>

const DebugControls = ({ children, debugItemProps = [] }) => {
  const [isSortEnabled, setSortEnabled] = useState(true);
  const [sortMode, setSortMode] = useState(SORT_MODE.VERTICAL);

  return (
    <>
      <div className="list">
        <div className={`container ${sortMode}`}>
          {children({ isSortEnabled, sortMode })}
        </div>
        <button type="button" onClick={() => setSortEnabled(prev => !prev)}>
          {isSortEnabled ? 'disable sort' : 'enable sort'}
        </button>
        <select value={sortMode} onChange={evt => setSortMode(evt.target.value)}>
          <option value={SORT_MODE.VERTICAL}>vertical</option>
          <option value={SORT_MODE.HORIZONTAL}>horizontal</option>
          <option value={SORT_MODE.GRID}>grid</option>
        </select>
      </div>
      <pre className="state">
        {JSON.stringify(debugItemProps, undefined, 2)}
      </pre>
    </>
  )
}

export default App;