"use client";
import { useTheme } from "next-themes";
export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	return (
		<button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="rounded border px-2 py-1 text-xs">
			{theme === "dark" ? "Claro" : "Oscuro"}
		</button>
	);
}
