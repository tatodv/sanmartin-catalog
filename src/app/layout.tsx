import "./globals.css";
import { ThemeProvider } from "next-themes";
export const metadata = {
	title: "Formación en San Martín",
	description: "Catálogo de oferta educativa y cursos en San Martín.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<body className="bg-white text-slate-900 antialiased">
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
