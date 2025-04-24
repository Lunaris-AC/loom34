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
  Users
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
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5 mr-2" />,
    },
    {
      title: "Articles",
      href: "/admin/articles",
      icon: <FileText className="h-5 w-5 mr-2" />,
    },
    {
      title: "Events",
      href: "/admin/events",
      icon: <CalendarDays className="h-5 w-5 mr-2" />,
    },
    {
      title: "Gallery",
      href: "/admin/gallery",
      icon: <ImageIcon className="h-5 w-5 mr-2" />,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5 mr-2" />,
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
          onClick={() => setOpen(false)}
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
                <h2 className="text-lg font-bold text-brown mb-1">Admin Panel</h2>
                <p className="text-sm text-gray-500">
                  Logged in as {profile?.full_name || profile?.username || "Admin"}
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
                  Sign out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold">{title}</h1>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
      </header>

      {/* Desktop layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex md:w-64 flex-col bg-white border-r">
          <div className="p-6">
            <h1 className="text-xl font-bold text-brown">Admin Panel</h1>
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
              Sign out
            </Button>
            <Button variant="ghost" className="mt-2 w-full justify-start" asChild>
              <Link to="/">
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back to site
              </Link>
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
