import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Formación en San Martín",
  description: "Catálogo de programas educativos en San Martín",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
