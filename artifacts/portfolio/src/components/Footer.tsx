import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative border-t overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      {/* Animated gradient line */}
      <div className="h-px w-full" style={{
        background: 'linear-gradient(90deg, transparent, #8B5CF6, #06B6D4, #8B5CF6, transparent)',
        backgroundSize: '200% auto',
        animation: 'shimmer 4s linear infinite',
      }} />

      <div className="content-shell py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-display font-bold text-2xl gradient-text mb-1">Abdur Ursul Khan</div>
            <div className="text-slate-500 text-sm">AI Engineer · Full Stack Developer · ML Enthusiast</div>
          </div>

          <div className="flex items-center gap-4">
            {[
              { href: 'https://github.com/UrsulKhan21', label: 'GitHub', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg> },
              { href: 'https://www.linkedin.com/in/abdur-ursul-khan-0325522a9/', label: 'LinkedIn', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
              { href: 'mailto:abdurursulkhan@gmail.com', label: 'Email', icon: <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
            ].map(link => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                whileHover={{ y: -3, borderColor: 'rgba(139,92,246,0.4)', color: '#a78bfa', boxShadow: '0 0 15px rgba(139,92,246,0.3)' }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-sm">© 2025 Abdur Ursul Khan. All rights reserved.</p>
          <p className="text-slate-700 text-xs flex items-center gap-1">
            Built with React + Vite
            <span className="text-purple-500">♦</span>
            
          </p>
        </div>
      </div>
    </footer>
  );
}
