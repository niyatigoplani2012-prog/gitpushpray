# Design Tokens: Surplus-to-Shelter MVP

These tokens define the strict, highly accessible Light Theme for the frontend, ensuring high contrast for non-technical users and drivers in the field.

## Color Palette (Tailwind reference)
- **Background**: `bg-gray-50`
- **Surface**: `bg-white` (Cards, Modals)
- **Primary / Action Elements**: `bg-emerald-600` (Text `text-white`)
- **Secondary Action**: `bg-blue-600`
- **Text Headings**: `text-gray-900`
- **Text Body**: `text-gray-700`
- **Text Muted/Hint**: `text-gray-500`

## Status Indicators
- **Posted/Pending**: `text-yellow-700 bg-yellow-100`
- **Matched/Picked Up**: `text-blue-700 bg-blue-100`
- **Delivered**: `text-emerald-700 bg-emerald-100`
- **Unmatched/Escalated**: `text-red-700 bg-red-100`

## Typography & Structure
- **Global Font**: `font-sans` (System fallbacks: Inter, Roboto, Helvetica)
- **Touch Targets**: Min height 48px (`h-12`) footprint for all mobile buttons (Driver / Donor views).
- **Shadows**: Distinct `shadow-sm` on structural cards, `shadow-md` on modals.
- **--text-5xl**: 56px / 64px /* dashboard big numbers on shared/TV screens only */
