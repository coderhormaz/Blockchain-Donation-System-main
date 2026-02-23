import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Shield } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Page not found</p>
        <p className="text-sm text-muted-foreground mb-8">
          The page at <code className="bg-muted px-2 py-1 rounded text-foreground">{location.pathname}</code> doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md bg-gradient-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity shadow-warm"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
