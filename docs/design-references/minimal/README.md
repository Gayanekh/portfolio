# Minimal template: design reference

Reference: https://kima.framer.media/ ("Kima", a one-page portfolio for a
digital designer). Minimal (the Signature site template,
`components/site-templates/signature`) takes its **content and section order**
from it: intro, about with four figures, services, stack, experience, awards,
testimonials, projects and contact.

The layout and look are deliberately our own, not a copy:

- **Left side.** A dark profile panel stays pinned on the left while the
  rest of the page scrolls. It works as a living poster built in layers that
  shift with the pointer at different depths:
  - a drifting glow and a dot grid;
  - the first name, huge and outlined;
  - a portrait in a breathing shape that turns to colour on hover;
  - a turning ring of words that leads to Contact;
  - stickers you can drag and throw;
  - the name with a swash line that draws itself;
  - a live clock and coordinates;
  - a "now" readout that follows the section in view.
- **Right side.**
  - Marked title words get a hand-drawn swash.
  - The intro has a fan of recent pieces.
  - Projects sit in an interlocking two-column grid with a "View project" circle that follows the pointer.
  - Services open as accordion rows.
  - The experience timeline fills as you scroll.
  - Award rows flood with ink on hover.
  - Testimonials sit in a strip you drag sideways.
  - Contact is a cobalt card with a magnetic email.
- **Palette.** Warm paper, ink and one cobalt accent, with Space Grotesk and DM Mono.

The shared pieces live in `components/site-templates/sections/signature/kit.tsx`.
