import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { DataGrid } from './features/data-grid';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <DataGrid />
    </section>
    </>
  )
}

export default App
