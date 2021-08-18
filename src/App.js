import React, { useState } from 'react';
import './App.css';
import { coffees as coffeeData, desserts as dessertData } from './data.js';
import ListSort from './ListSort';

function App() {
  const [coffees, setCoffees] = useState(coffeeData);
  const [desserts, setDesserts] = useState(dessertData);
  const [isSortEnabled, setSortEnabled] = useState(true);
  const [sortMode, setSortMode] = useState('vertical');

  return (
    <div className="app">
      <div>
        <div className={`container ${sortMode}`}>
          <ListSort
            items={coffees}
            setItems={setCoffees}
            isSortEnabled={isSortEnabled}
            sortMode={sortMode}
            renderRow={rowData => (<div>
              <div className="title"><QueryLink query={rowData.blend_name}>{rowData.blend_name}</QueryLink></div>
              <div className="desc">{rowData.origin}</div>
            </div>)} />
        </div>
        <button type="button" onClick={() => setSortEnabled(prev => !prev)}>
          {isSortEnabled ? 'disable sort' : 'enable sort'}
        </button>
        <select value={sortMode} onChange={evt => setSortMode(evt.target.value)}>
          <option value="vertical">vertical</option>
          <option value="horizontal">horizontal</option>
        </select>
      </div>
      <pre className="state">
        {JSON.stringify(coffees.map(({ id, blend_name }) => ({ id, blend_name })), undefined, 2)}
      </pre>

      <div>
        <div className="container vertical">
          <ListSort
            items={desserts}
            setItems={setDesserts}
            isSortEnabled={true}
            renderRow={rowData => (<div>
              <div className="title">{rowData.variety}</div>
              <div className="desc">{rowData.topping}</div>
            </div>)} />
        </div>
      </div>
      <pre className="state">
        {JSON.stringify(desserts.map(({ id, variety, topping }) => ({ id, variety, topping })), undefined, 2)}
      </pre>
    </div>
  );
}

const QueryLink = ({ query, children }) => 
  <a href={`https://google.pl/search?q=${query}`} target="_blank">
    {children}
  </a>


export default App;