import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Homepage from './components/Homepage'
import Contact from './components/Contact'
import About from './components/About'
import Programs from './components/Programs'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/programs" element={<Programs />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
