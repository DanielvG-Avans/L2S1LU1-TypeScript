import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

/**
 * ThemeDemo component showcasing dark mode features and toast integration.
 * This component is useful for testing and demonstrating theme capabilities.
 *
 * Features demonstrated:
 * - Theme-aware UI components
 * - Sonner toast integration with themes
 * - Semantic color tokens
 * - Accessible contrast
 * - Focus indicators
 */
export function ThemeDemo() {
  const { theme, resolvedTheme } = useTheme();

  const showSuccessToast = () => {
    toast.success("Success!", {
      description: `Theme is working perfectly in ${resolvedTheme} mode`,
      icon: <CheckCircle className="h-5 w-5" />,
    });
  };

  const showErrorToast = () => {
    toast.error("Error Example", {
      description: "This is how errors look in the current theme",
      icon: <XCircle className="h-5 w-5" />,
    });
  };

  const showInfoToast = () => {
    toast.info("Information", {
      description: "Info toasts automatically adapt to your theme",
      icon: <Info className="h-5 w-5" />,
    });
  };

  const showWarningToast = () => {
    toast.warning("Warning", {
      description: "Warnings are clearly visible in both themes",
      icon: <AlertTriangle className="h-5 w-5" />,
    });
  };

  const showCustomToast = () => {
    toast(
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-semibold text-foreground">Custom Toast</p>
          <p className="text-sm text-muted-foreground mt-1">
            This toast uses semantic tokens and adapts perfectly to {resolvedTheme} mode
          </p>
        </div>
      </div>,
      {
        duration: 5000,
      },
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dark Mode Theme Demo</h1>
        <p className="text-muted-foreground">
          Testing theme integration with Sonner toasts and UI components
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Theme Info Card */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Current Theme</CardTitle>
            <CardDescription>Active theme information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Selected:</span>
              <span className="font-medium text-foreground capitalize">{theme || "system"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Resolved:</span>
              <span className="font-medium text-foreground capitalize">
                {resolvedTheme || "loading..."}
              </span>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                The theme persists in localStorage and automatically follows your OS preference when
                set to "system".
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Toast Examples Card */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Toast Examples</CardTitle>
            <CardDescription>Test Sonner integration with current theme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={showSuccessToast} variant="default" className="w-full">
              Success Toast
            </Button>
            <Button onClick={showErrorToast} variant="destructive" className="w-full">
              Error Toast
            </Button>
            <Button onClick={showInfoToast} variant="secondary" className="w-full">
              Info Toast
            </Button>
            <Button onClick={showWarningToast} variant="outline" className="w-full">
              Warning Toast
            </Button>
            <Button onClick={showCustomToast} variant="ghost" className="w-full">
              Custom Toast
            </Button>
          </CardContent>
        </Card>

        {/* Color Tokens Card */}
        <Card className="border-border bg-card md:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-foreground">Semantic Color Tokens</CardTitle>
            <CardDescription>Theme-aware color system in action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-background border border-border rounded flex items-center justify-center">
                  <span className="text-xs text-foreground">background</span>
                </div>
                <p className="text-xs text-center text-muted-foreground">Background</p>
              </div>

              <div className="space-y-2">
                <div className="h-16 bg-card border border-border rounded flex items-center justify-center">
                  <span className="text-xs text-card-foreground">card</span>
                </div>
                <p className="text-xs text-center text-muted-foreground">Card</p>
              </div>

              <div className="space-y-2">
                <div className="h-16 bg-primary rounded flex items-center justify-center">
                  <span className="text-xs text-primary-foreground">primary</span>
                </div>
                <p className="text-xs text-center text-muted-foreground">Primary</p>
              </div>

              <div className="space-y-2">
                <div className="h-16 bg-secondary rounded flex items-center justify-center">
                  <span className="text-xs text-secondary-foreground">secondary</span>
                </div>
                <p className="text-xs text-center text-muted-foreground">Secondary</p>
              </div>

              <div className="space-y-2">
                <div className="h-16 bg-muted rounded flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">muted</span>
                </div>
                <p className="text-xs text-center text-muted-foreground">Muted</p>
              </div>

              <div className="space-y-2">
                <div className="h-16 bg-accent rounded flex items-center justify-center">
                  <span className="text-xs text-accent-foreground">accent</span>
                </div>
                <p className="text-xs text-center text-muted-foreground">Accent</p>
              </div>

              <div className="space-y-2">
                <div className="h-16 bg-destructive rounded flex items-center justify-center">
                  <span className="text-xs text-destructive-foreground">destructive</span>
                </div>
                <p className="text-xs text-center text-muted-foreground">Destructive</p>
              </div>

              <div className="space-y-2">
                <div className="h-16 bg-popover border border-border rounded flex items-center justify-center">
                  <span className="text-xs text-popover-foreground">popover</span>
                </div>
                <p className="text-xs text-center text-muted-foreground">Popover</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Elements Card */}
        <Card className="border-border bg-card md:col-span-2">
          <CardHeader>
            <CardTitle className="text-card-foreground">Interactive Elements</CardTitle>
            <CardDescription>
              All elements support focus indicators and smooth transitions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Focus me to see the ring indicator"
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
              />
              <textarea
                placeholder="Textarea with focus indicator"
                rows={3}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Accessibility Features</CardTitle>
          <CardDescription>WCAG AA compliant contrast ratios and focus indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <span className="text-foreground">
                <strong>Contrast:</strong> All text meets WCAG AA standards (4.5:1 for body text,
                3:1 for large text)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <span className="text-foreground">
                <strong>Focus:</strong> Visible focus indicators on all interactive elements
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <span className="text-foreground">
                <strong>Motion:</strong> Respects prefers-reduced-motion preference
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <span className="text-foreground">
                <strong>Screen Readers:</strong> Proper ARIA labels and semantic HTML
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <span className="text-foreground">
                <strong>Persistence:</strong> Theme choice saved in localStorage
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <span className="text-foreground">
                <strong>Transitions:</strong> Smooth 0.3s transitions for colors
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
