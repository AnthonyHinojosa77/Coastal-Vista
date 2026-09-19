# Coastal Vista portfolio release

The existing six-photo homepage, family contact introduction, and scroll-linked text transitions are retained. Gallery in the main navigation opens a separate page at `/gallery.html` with 14 photographs and six silent films. Filters switch between all work, photos, and videos. Full images and films open in a keyboard-accessible dialog. Full video files are requested only after opening a film; smaller muted previews load and play as their cards enter view.

The emblem has moved from the contact area to the upper left of the opening photograph. It fades in independently on arrival, fades out while scrolling away, and fades back in on upward scroll. It remains visible without animation when reduced motion is requested.

## Media decisions

| Item | Published version |
| --- | --- |
| P045, P077, P082, P097, P056, P064, P068 | Previously approved photograph edits |
| P024 night bridge | First reviewed edit, previously described as acceptable; the experimental night refinement is not used |
| Six existing homepage photographs | Existing approved edits |
| V063 golden-hour bridge | Stabilized Revision 2, native frame rate, fixed crop |
| V072 North Beach | Approved color edit |
| V010 blue-lit bridge | Approved color edit |
| V015 sports field | Four-second revision, ending before the unwanted zoom |
| V079 warm city sky | Revision 2 with separate sky and foreground adjustments |
| V048 pool film | Existing 30-second edited sequence, with original captions cropped out |

The source media and Lightroom working copies remain preserved in OneDrive. Web exports contain no generated scenery. Video audio is intentionally absent in this portfolio set. The emblem uses the supplied transparent artwork, resized for web use, and also provides the favicon.

## Preview behavior

Preview exports are H.264, 960 pixels wide, 30 fps, silent, and no longer than 10 seconds. The pool film has a 10-second preview; the other approved clips are four to eight seconds long and play to their existing end. The full approved film remains available in the viewer. Previews stop offscreen, when the browser tab is hidden, and while the viewer is open. A pause/enable control is provided. Reduced-motion visitors start with autoplay disabled; failed autoplay leaves the poster and manual viewer available. See `qa/preview-media-checks.json` for export durations and sizes.

## Validation

- `npm run lint`
- `npm run build`
- `npm run qa` against a running development or preview server
- `npm run qa:webkit`
- `QA_URL=https://coastal-vista.com QA_OUTPUT=/tmp/cv-gallery-live-qa npm run qa` after deployment
- `QA_URL=https://coastal-vista.com QA_OUTPUT=/tmp/cv-gallery-live-qa npm run qa:webkit` after deployment

The browser check covers all image viewers, playback of all six full films, filters, dialog keyboard behavior, responsive layouts, reduced motion, automated accessibility rules, direct gallery reloads, cross-page contact navigation, and actual entrance/exit/return opacity of the emblem and five scrolling photo panels after the opening scene. Preview checks verify muted inline playback, offscreen/modal pausing, the toggle, and the 10-second stop. Complete full-film playback was verified in the initial portfolio release; those full-film files are unchanged. Contact success/error handling is simulated in the repeatable test, so repeated runs do not send inquiries. Anthony confirmed receipt of the separately labeled live Formspree test inquiry on September 19, 2026.

Automated accessibility tests supplement visual review; they do not certify every assistive technology. Desktop Chrome with phone/tablet viewport sizes is used for reproducible layout checks. A second WebKit pass uses iPhone emulation to check photo viewing, all six video formats, preview playback, emblem fades, and cross-page navigation. It is run with `npm run qa:webkit` after `npx playwright install webkit`; this is browser emulation, not a physical iPhone test.
