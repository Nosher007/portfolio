import { Component, lazy, Suspense, useState, type ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Contact from './sections/Contact'

// three.js is loaded in its own chunk so the page text paints first
const Constellation = lazy(() => import('./components/constellation/Constellation'))

function hasWebGL() {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

/** If WebGL fails for any reason, drop the 3D layer and keep the site working */
class SilentBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function App() {
  const [webgl] = useState(hasWebGL)

  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <Hero />
        {/* Fixed-position layer; placed here so its hub buttons follow the hero in tab order */}
        {webgl && (
          <SilentBoundary>
            <Suspense fallback={null}>
              <Constellation />
            </Suspense>
          </SilentBoundary>
        )}
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
