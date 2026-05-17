import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import Skills from './sections/Skills'
import Experience from './sections/Experience'
import About from './sections/About'
import Projects from './sections/Projects'
import Contact from './sections/Contact'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <Experience />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
