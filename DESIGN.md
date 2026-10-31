---
version: 1
name: Vynq — two voices
description: A messenger for one-to-one conversations, designed around the two sides of a conversation. Navy ink on cool paper for everything that is "them" or the interface; one ballpoint blue for "you" and for every action. One typeface, Familjen Grotesk. Content is left-aligned and quiet; the only loud moment is the landing headline set as an exchange.

colors:
  paper: "#f2f4f8"
  surface: "#ffffff"
  ink: "#171a33"
  ink-soft: "#565b7a"
  line: "#d8dce8"
  ballpoint: "#2a2acf"
  ballpoint-deep: "#1e1ea3"
  ballpoint-wash: "#e4e4fa"
  error: "#b42318"

typography:
  family: "Familjen Grotesk (next/font/google, variable 400–700), system-ui fallback"
  scale: # major third on 16px
    sm: 13px
    base: 16px
    md: 20px
    lg: 25px
    xl: 31px
    2xl: 39px
    hero: "clamp(48px, 10vw, 120px)"
  weights:
    body: 400
    emphasis: 500
    label-and-title: 600
    display: 700

rounded:
  control: 10px
  bubble: 18px
  tail: 4px
  avatar: 50%

spacing: [4, 8, 12, 16, 24, 32, 48, 72, 112]

components:
  button-primary: { background: ballpoint, hover: ballpoint-deep, text: surface, radius: control, height: 44px, weight: 600 }
  button-secondary: { background: transparent, border: "1.5px line", hover-border: ink, text: ink, radius: control }
  button-quiet: { background: surface, border: "1.5px line", text: ink, size: sm, height: 36px }
  input: { background: surface, border: "1.5px line", focus: "ballpoint border + 3px ballpoint-wash ring", radius: control, height: 48px }
  input-filled: { background: paper, border: transparent, focus: same as input }
  bubble-mine: { background: ballpoint, text: surface, radius: bubble, tail: bottom-right }
  bubble-theirs: { background: surface, border: "1px line", text: ink, radius: bubble, tail: bottom-left }
  avatar: { background: ballpoint-wash, text: ballpoint, active: "ballpoint / surface" }
---

Tokens live in `apps/web/app/globals.css` as CSS custom properties (`--color-*`, `--text-*`, `--radius-*`, `--space-*`). Components use the variables, never raw hex.

## Concept

Vynq only does one thing: conversations between exactly two people. The design is built on that pair. **Ink is them, ballpoint blue is you.** Your messages, the actions you can take and the chat you have open are blue; everything else is navy ink on cool paper. If blue appears somewhere, it should mean "you" or "you can do this".

## Colors

- **Paper** `#f2f4f8` is the page background, a cool off-white. Never warm cream.
- **Surface** `#ffffff` is for things that sit on the paper: inputs, the sidebar, the chat header and composer, the other person's bubbles.
- **Ink** `#171a33` is a navy-black for text and headings. Don't swap in neutral greys or `#000`.
- **Ink soft** `#565b7a` is for secondary text: leads, previews, timestamps, hints. It passes AA on both paper and surface.
- **Line** `#d8dce8` is for 1px dividers and 1.5px control borders.
- **Ballpoint** `#2a2acf` is the only accent. **Ballpoint deep** is its hover state. **Ballpoint wash** is the tint behind avatars, the active chat row, step numbers and focus rings.
- **Error** `#b42318` is for error text and invalid input borders only.

There are no gradients and no shadows except the focus ring.

## Typography

- Use one family, Familjen Grotesk. Hierarchy comes from size and weight, not a second face.
- Headlines are 700 with negative tracking (`-0.02em`, or `-0.035em` at hero size). Titles and labels are 600. Body text is 400 at 1.5 line-height.
- Keep running text under about 80 characters per line (`--measure: 34rem`).
- Use sentence case everywhere. No all-caps labels, no eyebrows above headings, and no colored or italic single words inside a headline. The landing headline's two colors are two speakers, not decoration.

## Layout

- Marketing and auth pages share a 1200px container with 24px side padding (16px under 640px). Content is left-aligned.
- The landing hero is the one loud moment: "Just you" sits left in ink and "and one other person." sits right in blue, at hero size. The second line arrives about half a second after the first, once, on load. This is the only non-interactive motion in the product, and it's turned off under `prefers-reduced-motion`.
- Sections are separated by a single 1px line rule and generous vertical space (72–112px), not by color bands or cards.
- Auth forms sit straight on the paper in a 400px column with no card around them.
- The chat app has a 340px white sidebar and a paper-colored conversation pane. Below 834px only one pane shows at a time.

## Components

- **Buttons**: primary (blue fill), secondary (outlined) and quiet (small outlined, for app chrome such as Sign out and Refresh). Labels say exactly what happens, e.g. "Create an account" or "Sign in", with no arrows.
- **Inputs**: white with a line border, or filled with paper inside white panels (search, composer). Focus shows a blue border plus a wash ring.
- **Bubbles**: 18px radius with a 4px tail corner pointing at the speaker. Yours are blue on the right; theirs are white with a line border on the left. The time sits inside the bubble at 11px.
- **Chat rows**: the active row gets the wash background and a solid blue avatar; hover gets paper.
- **Numbered markers** are only for real sequences (the three sign-up steps). Don't number lists that aren't ordered.

## Writing

- Use plain verbs and sentence case. Name things the way users see them ("chat", "email"), not the way the system is built.
- An action keeps its name throughout the flow.
- Errors say what happened and what to do next. They don't apologize.
- Empty states tell the person what to do next ("Pick a chat on the left, or search for someone by email to start one.").

## Quality floor

- Every interactive element has a visible `:focus-visible` style (a 2px ballpoint outline or the input ring).
- Touch targets are at least 44px tall, except quiet buttons in dense chrome, which are 36px.
- Layouts are checked at 1440, 834 and 390px wide.

## Don't

- Don't add a second accent color, gradients, drop shadows or glassy blur.
- Don't use identical card grids for feature lists.
- Don't use all-caps or tracked-out labels, middle-dot meta strings or monospace data labels.
- Don't add entrance animations on scroll or hover effects on non-interactive things.
