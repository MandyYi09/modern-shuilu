# Carousel performance and design

The full website retains the approved cloud scene, one integrated draw invitation, and all 21 characters. It opens with 5695, 9549 and 438, with the hidden 9549 centred. Only the current character and its two neighbours are mounted; the next incoming image is warmed in advance.

The first three characters use responsive WebP images. Doumu uses the approved transparent cutout at every resolution, never the cloud-backed illustration. Regenerate only these cutout derivatives with `python3 scripts/build_carousel_cutout.py`; the original cutout and source/print artwork are preserved.

Drag movement writes the track transform at most once per animation frame instead of updating React state on every pointer event. Stage containment and composited moving layers bound rendering work. Rotation and breathing pause when the page is hidden or the carousel is offscreen, hovered, focused, dragged, or reduced-motion is requested. The portfolio visibility event is also respected. Dragging starts only on a character's nontransparent pixels; clicks retain the water ripple.

The separate framework-free `preview.html` entry and its `carousel-artwork` / `carousel-motion` modules are retained for portfolio performance work. That entry is an independent cover composition, not the full website's source of truth. Do not copy its navigation, three-image limit or layout over the application routes. Normal `pages:build` and publishing remain independent.

The October 31 import (`af010d5`) accidentally replaced newer application routes and theme rules with older ones. Restore application behaviour from `2b483a7` while retaining image compression and the independent cover. Future performance changes must preserve the single homepage invitation, complete carousel cast, per-browser daily draw, and source/character comparison. The carousel and daily-draw tests guard these behaviours.
