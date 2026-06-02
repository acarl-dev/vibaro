# Vibaro Styleguide (Binding, MVP)

Status: Active  
Scope: Studio, Public Page, Landingpage  
Related: ARCHITECTURE.md, PRODUCT_RULES.md, PRODUCT_V2.md, THEMES.md

This styleguide defines Vibaro's visual and verbal direction in a binding way.
It applies to all design and UX decisions in the MVP.

Guiding principle: calm, high-quality, timeless. The band is the focus; the tool stays in the background.

---

## 1. Product DNA

### What Vibaro is

- A band page on Vibaro with a clear current focus.
- A workflow system for concrete promotion phases.
- A tool that makes visibility and impact measurable per phase.

### What Vibaro is not

- Not a generic "website builder homepage" without action focus.
- Not a loud marketing dashboard.
- Not a feature catalog without a clear next step.

### Core product loop (to support visually)

1. Define the current focus.
2. Share links and QR code.
3. See what works.

Rule for all screens: the current step in the loop must be clearly recognizable, and the next step must be visibly prepared.

---

## 2. Target Audience And Tone

### Primary MVP target audience

- Ambitious metal, metalcore, and alternative bands.

### Tone

- Serious.
- High-quality.
- Calm.
- Controlled.
- Direct and clear.

### Not allowed

- Playful or ironic product language.
- Generic SaaS phrases.
- Startup buzzwords.

Reference feel: a modern editorial aesthetic from a music/cultural context, not a "growth tool" look.

---

## 3. Language And Terms

### Binding product terms (UI-facing)

- My Page = permanent band page.
- Phase = current focus (for example release, tour, merch, studio).
- Share Links = tracking links and QR code per channel.
- Performance for This Phase = evaluation of one concrete phase.
- Analytics = cross-phase evaluation across multiple phases.

### Preferred visible terms in the primary UI

- Focus
- Phase
- Share Links
- QR Code
- Performance for This Phase
- Analytics
- Publish
- Visible / Not Visible

### Technical terms to avoid in the primary UI

- Distribution (as the primary term)
- Tracking (as the dominant user-facing term)
- Conversion
- Handle
- Hero
- Template
- UTM
- Attribution

Technical terms may appear in developer docs, optional help text, or API contexts, but not as dominant user guidance in the Studio.

### Term handling (binding)

- Distribution: okay internally; replace with "Share Links" in the UI.
- Tracking: okay internally/technically; prefer "Performance" or "Impact" in the UI.
- Conversion: only in analytics contexts, not as entry-point language.
- Handle: explain in the UI as "Band Address" or "Page Address".
- Hero: internal design term only.
- Template: replace in the UI with "Design" or "Look".

### German/English rule

- Studio: German as the default language for navigation, actions, help text, and status.
- Public Page: the language of band content is freely selectable; product/tool language stays in the background.
- Technical English terms only when there is no clear German alternative in the respective context.

---

## 4. Information Architecture

### Separation of the core areas

- My Page: permanent identity and base presence.
- Phase: current promotion focus.
- Share Links: operational distribution per channel including QR.
- Performance for This Phase: impact of a concrete phase.
- Analytics: broader view across development and patterns.

### Navigation principle

- Every screen needs a clear next step.
- Every screen state has exactly one dominant CTA.
- Secondary actions remain visually subordinate.

### Prioritization

- Actions are more important than data volume.
- Data is shown contextually, not as a permanent dashboard wall.

---

## 5. Visual System

### Colors

- Colors come exclusively from the theme system according to THEMES.md.
- No arbitrary HEX colors in components.
- No loud color fields as the default.
- Contrasts must be clearly readable, but not aggressive.

### Typography

- Calm, modern sans-serif typography.
- No playful or decorative type styles.
- Clear hierarchy: headline, subheadline, body, meta.
- Limit text widths so content stays editorial and readable.

### Spacing

- Generous spacing instead of dense compaction.
- Fewer elements per viewport.
- Mobile-first with a clean vertical rhythm.

### Cards

- Clear grouping, subtle separation.
- No heavy shadows, no loud effects.
- Cards must not feel like interchangeable SaaS feature boxes.

### Buttons

- One primary button per screen state.
- Clear visual hierarchy between primary and secondary.
- No "shiny" or playful styling devices.

### Icons

- Functional, restrained, consistent.
- No decorative icons without informational value.

### Empty States

- Always include a clear next action.
- Briefly explain why something is empty.
- No dead ends.

### Help Elements

- Help is visible, but not dominant.
- Help text supports decisions instead of replacing them.

---

## 6. Studio Design

### Core principle

- Calm, controlled, workflow-oriented.

### Binding rules

- No dashboard overload with equally weighted widgets.
- Actions before metrics.
- The current phase must be visually unambiguous.
- The help system must always be reachable, but must not push actions away.

### Interaction

- Short, subtle motion only for orientation.
- No continuous animations.
- No effects that hold attention unnecessarily.

---

## 7. Public Page Design

### Target image

- The band at the center.
- High-quality, dark, stage/editorial-like.
- Mobile-first for fans.

### Branding rule (binding)

- Vibaro branding may be visible, but only subtly in the footer.
- No Vibaro branding in the hero.
- No dominant Vibaro CTA inside the content.
- The band identity always has priority.

### Language rule for the Public Page

- No generic template language.
- Content should sound like real band communication, not tool copy.

---

## 8. Landing Page Design

### Positioning

- The landing page does not sell only "a homepage".
- It explains the product loop: define focus, share links/QR, see performance.

### Structure rule

- The hero and first sections must make the product loop visible.
- No feature desert.
- No interchangeable SaaS look.

### Design principle

- Reduced, editorial, clearly prioritized.
- One dominant message per section.
- Imagery: authentic, music-adjacent, not stock-startup-like.

---

## 9. Help System

### ExplainPanels

- Short.
- Contextual.
- Action-oriented.

### WhyButtons

- Optional for more depth.
- Not a required step for the main workflow.

### HelpHub

- Entry via the product loop.
- Structure help along the three core steps.

### Consistency rule

- No repetition of the same help text across multiple components.
- Help must never displace the primary action on the screen.

---

## 10. Forbidden / Anti-Patterns

- Too many equally strong CTAs on one screen.
- Technical terms as primary user guidance.
- "Distribution" as the dominant visible term.
- A Vibaro-centered public page instead of a band-centered presentation.
- Generic SaaS cards without productive action.
- Too many "Coming Soon" blocks in production flows.
- Help elements that cover the actual action.
- Loud colors, visual chaos, or permanent animations.
- Generic startup buzzword copy instead of clear, music-adjacent language.

---

## Implementation note

If there is a conflict between design wishes and product logic, the product loop applies:
Set focus -> Share links/QR -> See performance.
All new UX/UI slices must strengthen this flow in both visibility and usability.
