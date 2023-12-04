import * as React from 'react';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Home from './Home';

import './App.css';

function App() {
  return (
    <div className='App'>
      <header style={{ minHeight: '100vh' }}>
        <DndProvider backend={HTML5Backend}>
          <Home />
        </DndProvider>
      </header>
    </div>
  );
}

export default App;
