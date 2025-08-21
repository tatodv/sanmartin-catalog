"use client";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteShell({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="min-h-screen flex flex-col">
			<header className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
				<div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
					<Link href="/" className="font-semibold">Formación en San Martín</Link>
					<nav className="hidden md:flex items-center gap-4 text-sm">
						<Link href="/" className="hover:underline">Catálogo</Link>
						<Link href="/resumen" className="hover:underline">Resumen</Link>
						<a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Mapa general</a>
						<ThemeToggle />
					</nav>
					<button className="md:hidden rounded border px-2 py-1 text-sm" onClick={()=>setOpen(v=>!v)}>Menú</button>
				</div>
				{open && (
					<div className="md:hidden border-t bg-white">
						<div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2 text-sm">
							<Link href="/" onClick={()=>setOpen(false)}>Catálogo</Link>
							<Link href="/resumen" onClick={()=>setOpen(false)}>Resumen</Link>
						</div>
					</div>
				)}
			</header>
			<main className="flex-1">{children}</main>
			<footer className="border-t">
				<div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-600">
					Datos municipales + UNSAM. Algunas direcciones en verificación. {new Date().getFullYear()}.
				</div>
			</footer>
		</div>
	);
}
