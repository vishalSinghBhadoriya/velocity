# Asset provenance

## Automotive imagery

The built-in OpenAI image generation tool created three source images for this project. The imagery represents fictional concept vehicles. No third-party stock photograph or vehicle mesh is bundled.

| Output in `public/media` | Generation brief |
| --- | --- |
| `hero`, `hero-sm`, `hero-mobile`, `hero-mobile-sm` | Photorealistic unbranded titanium hypercar facing left in a graphite concrete tunnel, low front three-quarter camera, lateral strip light and reserved space for the headline. |
| `gt`, `sport`, `electric`, `detail`, `cockpit`, `wheel` and their small variants | A borderless campaign contact sheet with a graphite grand tourer, copper coupe, ivory electric coupe, silver hypercar headlight and aero detail, black cockpit, and forged wheel with carbon brakes. |
| `studio-*` | Fixed-angle side profile of a fictional hypercar on a neutral charcoal cyclorama, with selectively recolorable magenta pigment on the bodywork. |

`scripts/prepare-media.mjs` crops the contact sheet, recolors the studio body pixels and writes responsive WebP variants using Sharp. Run it with the three source PNG paths in the order shown above. The local WebP outputs are included and are sufficient for installation and builds.

<details>
<summary>Source image prompts</summary>

**Hero**

> Photorealistic luxury automotive campaign hero, ultra-wide 3:2 landscape, unbranded fictional silver titanium mid-engine hypercar with thin LED blades, black wheels and dramatic front splitter, low front three-quarter camera, facing left, placed across the middle and lower right of a vast dark brutalist concrete tunnel, lateral strip light, restrained warm red light far back, graphite mostly monochrome. The top left third is dark clear concrete for text UI. Entire car visible. Editorial photography, realistic reflections and believable engineering. No words, badges or watermark.

**Campaign sheet**

> High resolution landscape contact sheet EXACT 3 columns by 2 rows, equal edge-to-edge rectangles with no borders, text or logos, six separate photoreal luxury automotive campaign photos. Top row left dark graphite grand touring coupe 3/4 exterior in concrete studio, center burnt orange compact widebody performance coupe entire car 3/4 in same studio, right ivory futuristic electric performance coupe entire car in same setting. Bottom row left close detail silver hypercar headlight and carbon aero, center black leather hypercar cockpit from driver door, right macro forged wheel and carbon ceramic braking system. Minimal charcoal color grading, soft directional window light, premium high-end editorial photography.

**Configuration Studio**

> Landscape 3:2 photographic automotive configurator visual. Single original fictional titanium silver hypercar facing left, entire car in clean precise low side profile with slight front visibility, thin LED blades black wheels, on seamless neutral graphite cyclorama. Soft white directional studio light. Absolutely neutral black and gray background. Paint body has subtle distinct pink-magenta pigment (medium deep magenta metallic) so postproduction can selectively recolor it without touching the black wheels, windows or set. No lettering or logos. Car occupies 83 percent width, centered vertically.

</details>

## Typography and UI

- Barlow Condensed, Space Grotesk and IBM Plex Mono are installed through Fontsource and served locally. Each family uses the SIL Open Font License 1.1. The [font notices](public/licenses) accompany the published assets.
- Lucide supplies interface icons under the ISC license.
- The VELOCITY wordmark, favicon and application layout were authored for the project.
