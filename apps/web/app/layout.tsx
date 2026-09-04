import { Head } from "nextra/components";
import { JetBrains_Mono } from "next/font/google";
import "nextra-theme-docs/style.css";
import "./globals.css";

export const metadata = {
	title: {
		default: "coolcode",
		template: "%s — coolcode",
	},
	description: "The terminal AI coding agent.",
};

const jetbrainsMono = JetBrains_Mono({
	weight: ["400", "500", "700"],
	subsets: ["latin"],
	variable: "--font-jetbrains-mono",
	display: "swap",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			dir="ltr"
			suppressHydrationWarning
			className={jetbrainsMono.variable}
		>
			<Head
				// Primary = {colors.ink} #201d1d -> hsl(0, 5%, 12%); in dark mode the
				// canvas flips to the brand's surface-dark and the primary lightens.
				color={{
					hue: { light: 0, dark: 0 },
					saturation: { light: 5, dark: 5 },
					lightness: { light: 12, dark: 90 },
				}}
				// Background = {colors.canvas} #fdfcfc / {colors.surface-dark} #201d1d
				backgroundColor={{ light: "rgb(253,252,252)", dark: "rgb(32,29,29)" }}
				faviconGlyph="❯"
			/>
			<body>{children}</body>
		</html>
	);
}
