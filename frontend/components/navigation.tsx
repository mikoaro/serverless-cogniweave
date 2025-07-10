"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Brain, Menu, X, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/contexts/user-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { hasCompletedOnboarding, resetProfile } = useUser();
  const router = useRouter();

  const navItems = [
    { href: "/", label: "Home" },
    ...(hasCompletedOnboarding
      ? [{ href: "/transform", label: "Transform" }]
      : []),
    { href: "/about", label: "About" },
  ];

  const handleQuickReset = () => {
    if (
      confirm(
        "Are you sure you want to reset your profile? This will delete your current settings and you'll need to complete onboarding again."
      )
    ) {
      resetProfile();
      toast.success("Profile reset! Redirecting to onboarding...");
      setIsMenuOpen(false);
      setTimeout(() => {
        router.push("/onboard");
      }, 1500);
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">CogniWeave</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {hasCompletedOnboarding && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleQuickReset}
                className="text-muted-foreground hover:text-destructive"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
            {!hasCompletedOnboarding && (
              <Button asChild>
                <Link href="/onboard">Get Started</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:text-primary ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {hasCompletedOnboarding && (
                <div className="px-3 py-2">
                  <Button
                    variant="ghost"
                    onClick={handleQuickReset}
                    className="w-full justify-start text-muted-foreground hover:text-destructive"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Profile
                  </Button>
                </div>
              )}
              {!hasCompletedOnboarding && (
                <div className="px-3 py-2">
                  <Button asChild className="w-full">
                    <Link href="/onboard" onClick={() => setIsMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
