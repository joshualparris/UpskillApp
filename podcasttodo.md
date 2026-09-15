# Podcast Integration TODO

**Decision:** Add — strong fit.  
**Status:** ✅ Core one-click podcast bank added 13 September 2026.  
**Deployment QA:** ✅ GitHub Pages production build verified again 15 September 2026.
**Topic bank:** career change, training pathways, interviews, return-to-work and professional development.

## TODO
- [x] Curate about 25 Spotify episodes across career-change and job-search themes (shared JoshHub `career` bank).
- [x] Add a collapsed bottom dock: **🎧 Listen to a different career-development podcast**.
- [x] One tap selects/loads another episode; persist recent choices and avoid immediate repeats.
- [x] Use Spotify embed/deep links without assuming autoplay.
- [ ] Recommend episodes based on the selected pathway/person where practical — optional future enhancement; current bank is deliberately broad.
- [ ] Expand tagging with pathway-specific IT and nursing episodes — current bank covers interviews, confidence, return-to-work, values and career change.
- [x] Keep verified pathway/contact information primary; podcast content is supplementary.
- [x] Mobile/keyboard/screen-reader behaviour is supplied by the shared Josh Podcast Dock; repo-specific automated dock tests can be added later.

## Implementation
Loaded from the shared JoshHub catalogue through `podcast-dock-universal.js` with `data-bank="career"`. The dock collapses while typing into forms.

## Deployment incident and fix
On 13 September 2026 the GitHub Pages URL could show a blank white app while the podcast dock still rendered. Pages was serving the Vite source `index.html` directly, including `/src/main.tsx`, instead of a compiled production build. A proper Vite → GitHub Pages build/deploy workflow was added.

The release rule is now: do not treat HTTP 200 or a green deployment badge as proof the app works. Confirm meaningful application content renders, compiled assets load, and mobile controls remain usable. The latest checked Pages workflow on 15 September 2026 completed successfully.

Live test: <https://joshualparris.github.io/UpskillApp/>
