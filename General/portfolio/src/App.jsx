
import './App.css'
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Testimonial from './components/Testimonial'
// import Contact from './components/Contact'
import Footer from './components/Footer'
import NotFound from './components/NotFound'
import LandingPage from './pages/LandingPage'

function App() {
  

  return (
    <>
    <BrowserRouter>
      {/* Navigation Links — don't use <a> tags! */}
      <nav>
        <Link to="/">Home</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <Routes>
        <Route path="/"          element={<LandingPage />} />
        {/* <Route path="/contact"    element={<Contact />} /> */}
        <Route path="*"         element={<NotFound />} />   // 404
      </Routes>
    </BrowserRouter>




      {/* <Header />
      <Hero />
      <Testimonial />
      <Contact />
      <Footer /> */}

    </>
  )
}

export default App
