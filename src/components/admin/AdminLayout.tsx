import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  LayoutDashboard,
  FileText,
  CalendarDays,
  Image as ImageIcon,
  LogOut,
  Menu,
  X,
  Users,
  MessageSquare
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type AdminLayoutProps = {
  children: ReactNode;
  title: string;
};

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { signOut, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const menuItems = [
    {
      title: "Tableau de bord",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
    },
    {
      title: "Articles",
      href: "/admin/articles",
      icon: <FileText className="h-5 w-5 mr-2" />,
    },
    {
      title: "Événements",
      href: "/admin/events",
      icon: <CalendarDays className="h-5 w-5 mr-2" />,
    },
    {
      title: "Photos",
      href: "/admin/gallery",
      icon: <ImageIcon className="h-5 w-5 mr-2" />,
    },
    {
      title: "Utilisateurs",
      href: "/admin/users",
      icon: <Users className="h-5 w-5 mr-2" />,
    },
    {
      title: "Tickets",
      href: "/admin/tickets",
      icon: <MessageSquare className="h-5 w-5 mr-2" />,
    },
  ];

  const NavigationLinks = () => (
    <div className="space-y-1">
      {menuItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={`flex items-center px-4 py-2 text-sm rounded-md ${
            location.pathname === item.href
              ? "bg-brown text-white font-medium"
              : "text-gray-700 hover:bg-tan/20"
          }`}
          onClick={() => {
            setOpen(false);
            window.location.href = item.href;
          }}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile header */}
      <header className="bg-white shadow-sm py-4 px-4 md:hidden flex items-center justify-between">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="flex flex-col h-full">
              <div className="py-4 px-2">
                <h2 className="text-lg font-bold text-brown mb-1">Panneau d'administration</h2>
                <p className="text-sm text-gray-500">
                  Connecté en tant que {profile?.full_name || profile?.username || "Admin"}
                </p>
              </div>
              <div className="flex-1">
                <NavigationLinks />
              </div>
              <div className="py-4 px-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Se déconnecter
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold">{title}</h1>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour
          </Link>
        </Button>
      </header>

      {/* Desktop layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex md:w-64 flex-col bg-white border-r">
          <div className="p-6">
            <h1 className="text-xl font-bold text-brown">Panneau d'administration</h1>
            <p className="text-sm text-gray-500 mt-1">
              {profile?.full_name || profile?.username || "Admin"}
            </p>
          </div>
          <nav className="flex-1 px-4 py-2">
            <NavigationLinks />
          </nav>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Se déconnecter
            </Button>
            <Button variant="ghost" className="mt-2 w-full justify-start" onClick={() => window.location.href = "/"}>
              <ChevronLeft className="h-5 w-5 mr-2" />
              Retour au site
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="hidden md:block mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          <div className="bg-white shadow rounded-lg p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
