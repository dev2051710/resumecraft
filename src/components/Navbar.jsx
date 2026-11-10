import { Link } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';
import { Logo } from './Sidebar';

export default function Navbar({ onMenu }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-sidebar px-4 lg:hidden">
      <div className="flex items-center gap-3">
        <button className="icon-btn" onClick={onMenu} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <Logo />
      </div>
      <Link to="/create" className="btn-primary !px-3 !py-1.5" aria-label="Create new resume">
        <Plus size={16} />
      </Link>
    </header>
  );
}
