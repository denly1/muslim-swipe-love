import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Custom colors for our app
				"muslim-green": {
					50: "#E5F2E9",
					100: "#C0E2CB",
					200: "#9AD2AC",
					300: "#70C287",
					400: "#4EAF68",
					500: "#2D9C4A", // Main green
					600: "#0A5F38", // Dark green
					700: "#063E23", // Deeper dark green
					800: "#042918",
					900: "#02150C",
				},
				"muslim-gold": {
					50: "#FFF8E1",
					100: "#FFECB3",
					200: "#FFE082",
					300: "#FFD54F",
					400: "#FFCA28",
					500: "#FFC107", // Main gold
					600: "#FFB300",
					700: "#FFA000",
					800: "#FF8F00",
					900: "#FF6F00",
				},
				// Keep sidebar and other themed colors
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"swipe-right": {
					from: { transform: "translateX(0) rotate(0)" },
					to: { transform: "translateX(400px) rotate(20deg)", opacity: "0" },
				},
				"swipe-left": {
					from: { transform: "translateX(0) rotate(0)" },
					to: { transform: "translateX(-400px) rotate(-20deg)", opacity: "0" },
				},
				"match-pulse": {
					"0%, 100%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.15)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"swipe-right": "swipe-right 0.5s forwards",
				"swipe-left": "swipe-left 0.5s forwards",
				"match-pulse": "match-pulse 1s infinite ease-in-out",
			},
			backgroundImage: {
				"islamic-pattern": "url('/islamic-pattern.svg')",
				"muslim-gradient": "linear-gradient(135deg, #0A5F38 0%, #063E23 100%)",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
