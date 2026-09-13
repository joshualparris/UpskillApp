# Podcast Integration TODO

**Decision:** Add — strong fit.  
**Status:** ✅ Core one-click podcast bank added 13 September 2026.
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
