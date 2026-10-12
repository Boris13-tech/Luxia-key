# Existing visual language (conceptual extraction)

Source: frozen src/index.css, common/PhoneFrame.tsx, BottomNavBar.tsx, BiometricModal.tsx and screen components. No UI rewrite or token substitution.
- Color: slate-950 canvas, slate-900 panels, slate-700/800 borders, slate-100 primary text, slate-400 secondary text; cyan/sky/blue brand accents; emerald verified, amber caution, red denied/danger. These are Tailwind palette references, not authorization results.
- Typography: Plus Jakarta Sans primary, Space Grotesk display (index.html), existing system fallbacks; retain current size/weight hierarchy.
- Spacing: Tailwind 4px base with half-step 2px increments; common p-3.5 (14px), p-6 (24px), gaps 1.5/2/3.
- Radius: xl 12px, 2xl 16px, 3xl 24px, pill 9999px; phone shell 52px and inner 44px are preview chrome only.
- Elevation: shadow-sm/lg/2xl and tinted cyan/red shadows; phone custom shadow stays preview-only.
- Semantic states: pending is neutral/caution; verified emerald requires server evidence in real app; denied red; unknown must not be rendered as approved. Existing demo colors are illustrative.
- Motion: scanner 2.4s ease-in-out, radar 2s cubic-bezier(0,0,0.2,1), active scale 0.95 and short transitions. Native implementations must respect reduced-motion preferences.
- Icons: lucide-react line icons and BrandIcon local brand artwork; map meaning to native icon assets with licensing review.

Future React/SwiftUI/Compose exports must use reviewed semantic names. Do not mechanically convert TSX or infer security state from color/animation.
