import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { SpendGuardProvider } from "@/lib/contexts/SpendGuardContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SpendGuardProvider>
            {children}
          </SpendGuardProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
