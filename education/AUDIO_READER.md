# Think Flow First audio reader

`audio-reader.html` is a self-contained Module 1 pilot. Its embedded `reader-data` JSON contains the approved lesson divided into nine pages. It uses device speech synthesis to narrate the visible page text; no recorded audio or external speech service is included.

Features: previous/next and chapter navigation, keyboard navigation, play/pause/resume/replay, English voice choices, speed choices, adjustable text size, optional continuous listening, saved page position and A4 printing of all pages. Unavailable speech support and narration errors display a readable fallback message. Changing pages cancels speech and pending auto-advance. Reduced-motion settings are respected.

The existing Express `/education` static route serves this file without server changes. Module 1 links to it in this branch. The main branch has not been changed or deployed.

To reuse: clone the reader, update title/description, header and lesson links, and replace the embedded JSON with the next module's approved text. When changing an approved lesson, update the reader text too. Recorded narration requires a separate audio playback adapter and matching per-page audio assets; the present pilot uses device voices only.

Validation: JavaScript syntax; exact preservation and order of Module 1 body text; mocked speech-state checks covering pause/resume, cancelled utterance callbacks, page boundaries, manual completion, auto advance and cancellation, and narration errors. Browser visual QA and actual device speech playback remain to be checked. Device voices and pause behavior can differ by browser.
