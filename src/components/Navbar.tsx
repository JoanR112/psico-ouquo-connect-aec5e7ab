
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative flex items-center">
              <img 
                src="/lovable-uploads/cdebb1c4-99a9-4a08-9fe3-47a612c502ff.png" 
                alt="Psicome" 
                className="h-10 w-10"
              />
              <span className="mx-2">×</span>
              <img 
                src="/lovable-uploads/b6b02843-d7d2-4f3d-bcc6-7400bf3d3a01.png" 
                alt="Ouquo" 
                className="h-10 w-10" 
              />
            </div>
            <span className="font-bold text-lg">
              <span className="text-psicoblue">Psico</span>
              <span className="ouquo-gradient-text">Ouquo</span>
              <span className="text-black">Connect</span>
            </span>
          </Link>
          
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-foreground hover:text-psicoblue transition-colors">Home</Link>
              <Link to="/services" className="text-foreground hover:text-psicoblue transition-colors">Services</Link>
              <Link to="/about" className="text-foreground hover:text-psicoblue transition-colors">About</Link>
            </nav>
          )}
        </div>

        {!isMobile ? (
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link to="/video">
              <Button>
                Start Video Call
              </Button>
            </Link>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <div className="container mx-auto px-4 pb-4 bg-background">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="px-2 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="px-2 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="px-2 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/login" 
              className="px-2 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Log in
            </Link>
            <Link 
              to="/video" 
              className="px-2 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors text-center"
              onClick={() => setMenuOpen(false)}
            >
              Start Video Call
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
