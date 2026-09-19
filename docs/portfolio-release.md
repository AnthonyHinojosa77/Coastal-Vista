# Coastal Vista portfolio release

The existing six-photo homepage, family contact introduction, and scroll-linked text transitions are retained. Work in the main navigation now opens a portfolio with 14 photographs and six silent films. Filters switch between all work, photos, and videos. Full images and films open in a keyboard-accessible dialog; video files are requested only after opening a film.

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

## Validation

- `npm run lint`
- `npm run build`
- `npm run qa` against a running development or preview server
- `QA_URL=https://coastal-vista.com QA_OUTPUT=/tmp/cv-live-qa npm run qa` after deployment

The browser check covers all image viewers, complete playback of all six videos, filters, dialog keyboard behavior, responsive layouts, reduced motion, automated accessibility rules, and the actual entrance/exit/return opacity of the five scrolling photo panels after the opening scene. Contact success/error handling is simulated in the repeatable test, so repeated runs do not send inquiries. One separately labeled live inquiry checks the real delivery path.

Automated accessibility tests supplement visual review; they do not certify every assistive technology. Desktop Chrome with phone/tablet viewport sizes is used for reproducible layout checks. A second WebKit pass uses iPhone emulation to check photo viewing, all six video formats, and the emblem. It is run with `npm run qa:webkit` after `npx playwright install webkit`.
