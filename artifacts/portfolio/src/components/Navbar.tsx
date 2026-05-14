import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const links = ['About', 'Skills', 'Projects', 'Experience', 'Contact'];
const resumeUrl = 'https://drive.google.com/file/d/1BB4Vu4cb2yrZ4sC5aNShsJEMc5foiqGX/view';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-white/5 shadow-lg shadow-black/20' : ''
      }`}
      style={{ backdropFilter: scrolled ? 'blur(20px)' : 'none' }}
    >
      <div className="content-shell py-4 flex items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="font-display font-bold text-xl gradient-text">
          AUK<span className="text-white/30">.</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group"
            >
              {l}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-full transition-all duration-300" />
            </button>
          ))}
          <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2 px-4">
            Resume
          </a>
        </div>

        <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)}>
          <div className={`w-5 h-0.5 bg-white transition-all mb-1 ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
          <div className={`w-5 h-0.5 bg-white transition-all mb-1 ${open ? 'opacity-0' : ''}`} />
          <div className={`w-5 h-0.5 bg-white transition-all ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass border-t border-white/5 overflow-hidden"
          >
            <div className="content-shell py-4 flex flex-col gap-4">
              {links.map(l => (
                <button key={l} onClick={() => scrollTo(l)} className="text-left text-slate-300 hover:text-white font-medium py-2 border-b border-white/5">
                  {l}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
