import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Experience } from './components/Experience'
import { Elsewhere } from './components/Elsewhere'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        {/* Projects temporarily hidden - import { Projects } from './components/Projects' and add <Projects /> here to restore. */}
        <Elsewhere />
      </main>
      <Footer />
    </div>
  )
}

export default App
