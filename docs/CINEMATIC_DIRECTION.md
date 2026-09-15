# Hayati cinematic direction

## Subject and job

Hayati is a visual companion to Abdulrahim's 20-chapter novel for Sun'dus. Its single job is to let a visitor feel the distance, patience, scale, and unfinished promise of the story before downloading the book.

## Design system

- Midnight lapis `#030914`: the shared sky and spatial depth.
- River blue `#18304f`: water, rain, and mirror shadow.
- Moon silver `#eef2f4`: distant celestial illumination.
- Lantern gold `#d4a95f`: human warmth, the soul-thread, and portal activation.
- Ivory `#f5efe5`: characters and the only major interface copy.
- Cormorant Garamond: lyrical title; Marcellus: inscription-like subtitle and controls.

The layout is a fixed cinematic viewport over a 25-screen master scroll track. There are no content sections, cards, navigation, chapter labels, dialogue, or hard cuts. The world is 85–90 percent of every composition. The opening and finale alone carry title and download controls.

## Signature

The Gate remembers: one recurring liquid-light Arabian arch changes material as the camera crosses books, mirrors, water, moonlight, memory, and the True Gate. It is both transition system and emotional measure of whether distance can become touch.

## Self critique

The obvious approach was to use the approved vertical mood boards as full-screen backgrounds. That would reproduce their surface style but fail the brief's central requirement: a living world. The implementation instead uses several optimized environment plates as deep scenery, then adds independent WebGL water deformation, flowing waterfall light, fog, portal refraction, particles, small characters, camera travel, and cross-scene color state. The generated Asterra panorama is the opening visual source; the approved art remains the authority for architecture, costume, and palette.

## Timeline

`StoryTimeline.ts` defines all 20 canonical beats plus the present-day finale on one normalized `0 → 1` continuum. Weather, plate selection, portal skin, camera travel, character distance, and light warmth derive from that source. Scene titles exist only as internal identifiers and never appear in the interface.

## Performance

The site uses compressed WebP scenery, adaptive DPR, a single R3F canvas, one shared particle field, shader-driven water/waterfalls, and simple distant character geometry. Lower-power devices retain the same art direction without expensive post-processing or fluid simulation.
