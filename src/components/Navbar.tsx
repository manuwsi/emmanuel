export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full px-10 py-6 z-50 flex justify-between items-center text-neutral-200 text-xs uppercase pointer-events-none font-light">
      <div className="pointer-events-auto tracking-wider text-sm">Emmanuel — PARIS, FRANCE</div>
      <div className="space-x-6 pointer-events-auto">
        <a href="#" className="hover:opacity-60 transition">[ABOUT]</a>
        <a href="#" className="hover:opacity-60 transition">[WORKS]</a>
        <a href="#" className="hover:opacity-60 transition">[CONTACT]</a>
      </div>
    </nav>
  )
}
