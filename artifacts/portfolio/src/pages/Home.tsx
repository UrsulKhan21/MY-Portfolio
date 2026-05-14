import NeuralBackground from '../components/NeuralBackground';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import RagChatbot from '../components/RagChatbot';

export default function HomePage() {
  return (
    <div className="w-full" style={{ background: '#050505', minHeight: '100vh' }}>
      <NeuralBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
        <Footer />
        <RagChatbot />
      </div>
    </div>
  );
}
