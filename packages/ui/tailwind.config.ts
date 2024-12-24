import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
  	fontFamily: {
  		sans: [
  			'Public Sans',
  			'sans-serif'
  		]
  	},
  	extend: {
  		colors: {
  			text: 'hsl(var(--text))',
  			light: 'hsl(var(--light))',
  			blank: 'hsl(var(--blank))',
  			border: 'hsl(var(--border))',
  			primary: 'hsl(var(--primary))',
  			background: 'hsl(var(--background))',
  			overlay: {
  				DEFAULT: 'hsl(var(--overlay))',
  				light: 'hsl(var(--overlay-light))'
  			},
  			ring: {
  				DEFAULT: 'hsl(var(--ring))',
  				offset: 'hsl(var(--ring-offset))'
  			},
  			secondary: {
  				black: 'hsl(var(--secondary-dark))'
  			},
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
  			base: 'var(--border-radius)'
  		},
  		boxShadow: {
  			shadow: 'var(--shadow)'
  		},
  		translate: {
  			'box-shadow-x': 'var(--box-shadow-x)',
  			'box-shadow-y': 'var(--box-shadow-y)',
  			'reverse-box-shadow-x': 'var(--reverse-box-shadow-x)',
  			'reverse-box-shadow-y': 'var(--reverse-box-shadow-y)'
  		},
  		fontWeight: {
  			base: 'var(--base-font-weight)',
  			heading: 'var(--heading-font-weight)'
  		},
  		zIndex: {
  			'10': 'calc(var(--z-base) + 10)',
  			'20': 'calc(var(--z-base) + 20)',
  			'30': 'calc(var(--z-base) + 30)',
  			'40': 'calc(var(--z-base) + 40)',
  			'50': 'calc(var(--z-base) + 50)',
  			base: 'var(--z-base)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [animate],
} satisfies Config;

export default config;
