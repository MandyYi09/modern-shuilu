# Canonical project

This repository is the source of truth for Modern Shuilu. The desktop modern-shuilu folder is a symbolic link to this checkout; it is not a second copy.

Publish changes by committing and pushing main, checking the Publish website workflow for that exact commit, and opening https://mandyyi09.github.io/modern-shuilu/.

The portfolio opens this canonical public site. Do not patch a compiled copy in my-website to change Modern Shuilu. Preserve source images and local print/design artifacts. Build outputs, local launchers, caches and private environment files stay out of commits.
## Current illustration assets

For every character image, card export, screenshot, or portfolio graphic, use the current cartoon artwork referenced by `apps/web/src/lib/paintings.ts` (currently `paintings/character-web/`). Never substitute the older `paintings/character/` illustrations or reuse an old export without checking its embedded artwork. For a higher-resolution export, use `paintings/character-modern/` only after visually verifying it matches the current web artwork. Check every figure before delivery. Historical source paintings are separate reference material and must remain preserved.
