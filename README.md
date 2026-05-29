# Luxe Frontend

## Project overview

Luxe Frontend is a React + Vite ecommerce interface built to preserve the premium editorial feel of the provided HTML reference while using a scalable modular architecture. The homepage is implemented with reusable UI primitives, local data modules, and CSS Modules to keep styling isolated and maintainable.

## Tech stack

- React 18
- Vite 5
- React Router DOM
- Jest + Testing Library
- CSS Modules
- Local JSON-style data modules

## Folder structure

- src/components/ — reusable UI primitives and layout pieces
- src/screens/ — route-level screen compositions
- src/styles/ — screen-specific CSS Modules
- src/utils/data/ — local ecommerce datasets
- src/routes/ — application routing
- design/ — source-of-truth HTML reference

## Architecture decisions

- Keep the homepage as a composition of small, reusable components.
- Use local data modules instead of external APIs for deterministic rendering and faster iteration.
- Keep styling inside CSS Modules to avoid global cascade conflicts.
- Maintain a clear separation between screens, UI primitives, and data.

## Data architecture explanation

The app uses local datasets under src/utils/data for:

- products
- categories
- banners
- collections
- testimonials
- recommendations

This avoids hardcoded repeated content and makes the homepage easy to extend while preserving a realistic ecommerce structure.

## Component architecture explanation

Reusable components live under src/components and include:

- layout shell pieces
- product cards and grids
- buttons, badges, chips, and skeleton states
- shared section/header blocks

This allows the homepage to render the UI with consistent spacing, interaction patterns, and premium styling.

## Responsive strategy

The homepage is designed to adapt across desktop, tablet, and mobile with:

- grid reflow for sections and cards
- responsive typography and spacing
- touch-friendly controls
- layout fallback behavior for dense sections

## Current completed phases

- Vite + React + routing foundation
- Local ecommerce data architecture
- Reusable component library
- Homepage visual composition and responsive shell
- Build and test validation

## Remaining phases

- Full product detail and cart/wishlist refinement
- Deeper fidelity pass against the HTML reference for all screens
- Expanded interaction polish and analytics-ready integration points

## Testing setup

- Jest configured with Babel and jsdom
- Testing Library used for UI smoke validation

## Run instructions

1. npm install
2. npm run dev

## Build instructions

1. npm install
2. npm run build

## Key engineering decisions

- Reuse existing components before introducing new ones.
- Keep the homepage visually anchored to the HTML reference instead of introducing a new visual language.
- Use local data to preserve architecture quality and remove dependency risk.

## Known gaps

- The homepage currently reflects the premium editorial structure and reusable foundation; full screen parity with the HTML reference continues as an active refinement item.
