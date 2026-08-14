Everything you see on the web is composed out of the little dots of light that make up your device’s screen: _pixels_. So, when measuring out the artefacts that make up our interfaces, thinking in terms of pixels, and using the CSS `px` unit, makes sense. Or does it?

Screens’ [pixel geometries vary wildly](https://geometrian.com/programming/reference/subpixelzoo/index.php), and most modern displays employ sub-pixel rendering, which is the manipulation of the color components of individual pixels, to smooth jagged edges and produce a higher _perceived_ resolution. The notion of `1px` is fuzzier than how it’s often portrayed.

![Two pixels next to each other. They are each made up of three subpixels, but the arrangement of the subpixel oblongs differ between the two](https://every-layout.dev/images/illustrations/units_subpixels.svg)

Image caption: The Samsung Galaxy Tab S 10.5 alternates the arrangement of subpixels between pixels. Every other pixel is composed differently.

Screen resolutions—how many pixels screens pack—also differ. Consequently, while one “CSS pixel” (`1px` in CSS) may approximate one “device” or “hardware” pixel on a lower resolution screen, a high resolution screen may proffer _multiple_ device pixels for each `1px` of CSS. So there are pixels, and then there are pixels _of_ pixels.

![A grid of 9 equally sized boxes. The grid itself is labeled as a pixel, and so is one of the boxes it is composed from](https://every-layout.dev/images/illustrations/units_pixel-pixel.svg)

Suffice it to say that, while screens are indeed made up of pixels, pixels are not regular, immutable, or constant. A `400px` box viewed by a user browsing _zoomed in_ is simply not `400px` in CSS pixels. It may not have been `400px` in _device pixels_ even before they activated zoom.

Working with the `px` unit in CSS is not _incorrect_ as such; you won’t see any error messages. But it encourages us to labour under a false premise: that [pixel perfection](https://kelliekowalski.com/articles/the-myth-of-pixel-perfection/) is both attainable and desirable.

## Scaling and accessibility

Designing using the `px` unit doesn’t only encourage us to adopt the wrong mindset: there are manifest limitations as well. For one, when you set your fonts using `px`, browsers assume you want to _fix_ the fonts at that size. Accordingly, the font size chosen by the user in their browser settings is disregarded.

With modern browsers now supporting [full page zoom](https://support.google.com/chrome/answer/96810?hl=en-GB) (where everything, including text is zoomed proportionately), this is often blown off as a solved problem. However, as [Evan Minto discovered](https://medium.com/@vamptvo/pixels-vs-ems-users-do-change-font-size-5cfb20831773), there are more users who adjust their default font size in browser settings than there are users of the browsers Edge or Internet Explorer. That is: disregarding users who adjust their default font size is as impactful as disregarding whole browsers.

The units `em`, `rem`, `ch`, and `ex` present no such problem because they are all units _relative_ to the user’s default font size, as set in their operating system and/or browser. Browsers translate values using these units into pixels, of course, but in such a way that’s sensitive to context and configuration. Relative units are arbitrators.

## Relativity

Browsers and operating systems typically only afford users the ability to adapt the _base_ or _body_ font size. This can be expressed as `1rem`: exactly one times the root font size. Your paragraph elements should always be `1rem`, because they represent body text. You don’t need to set `1rem` explicitly, because it’s the default value.

```css
:root {  /* ↓ redundant */  font-size: 1rem;}p {  /* ↓ also redundant */  font-size: 1rem;}
```

Elements, like headings, should be set _relatively_ larger — otherwise hierarchy will be lost. My `<h2>` might be `2.5rem`, for example.

```css
h2 {  /* ↓ 2.5 × the root font-size */  font-size: 2.5rem;}
```

While the units `em`, `rem`, `ch`, and `ex` are all measurements of text, they can of course be applied to the `margin`, `padding`, and `border` properties (among others). It’s just that text is the basis of the web medium, and these units are a convenient and constant reminder of this fact. Learn to extrapolate your layouts from your text’s intrinsic dimensions and your designs will be beautiful.

## Proportionality and maintainability

My `<h2>` is 2.5 times the root/base size. If I enlarge the root size, my `<h2>`—and all the other dimensions set in `rem`\-based multiples—will be enlarged _proportionately_. The upshot is that scaling the entire interface is trivial:

```css
@media (min-width: 960px) {  :root {    /* ↓ Upscale by 25% at 960px */    font-size: 125%;  }}
```

If I had instead adopted `px`, the implications for maintenance would be clear: the lack of relative and proportional sizing would require adjusting individual elements case-by-case.

```css
h3 {  font-size: 32px;}h2 {  font-size: 40px;}@media (min-width: 960px) {  h3 {    font-size: 40px;  }  h2 {    font-size: 48px;  }  /* etc etc ad nauseum */}
```

## Viewport units

In **Every Layout**, we eschew width-based `@media` queries. They represent the hard coding of layout reconfigurations, and are not sensitive to the immediate available space actually afforded the element or component in question. Scaling the interface at a discrete _breakpoint_, as in the last example, is arbitrary. What’s so special about `960px`? Can we really say the smaller size is acceptable at `959px`?

![The 959px version has very small text, and the 960px version (just one pixel different in width) has very large text](https://every-layout.dev/images/illustrations/units_width-jump.svg)

Image caption: A `1px` disparity represents a significant _jump_ when using a breakpoint.

[Viewport units](https://css-tricks.com/fun-viewport-units/) are relative to the browser viewport’s size. For example, `1vw` is equal to 1% of the screen’s width, and `1vh` is equal to 1% of the screen’s height. Using viewport units and `calc()` we can create an algorithm whereby dimensions are scaled proportionately, but from a _minimum_ value.

```css
:root {  font-size: calc(1rem + 0.5vw);}
```

The `1rem` part of the equation ensures the `font-size` never drops _below_ the default (system/browser/user defined) value. That is, `1rem + 0vw` is `1rem`.

## The `em` unit

The `em` unit is to the `rem` unit what a [container query](https://ethanmarcotte.com/wrote/on-container-queries/) is to a `@media` query. It pertains to the immediate context rather than the outer document. If I wanted to slightly enlarge a `<strong>` element’s `font-size` within my `<h2>`, I could use `em` units:

```css
h2 {  font-size: 2.5rem;}h2 strong {  font-size: 1.125em;}
```

The `<strong>`’s `font-size` is now `1.125 × 2.5rem`, or `2.53125rem`. If I set a `rem` value for the `<strong>` instead, it wouldn’t scale with its parent `<h2>`: if I changed the `h2` value, I would have to change the `h2 strong` CSS value as well.

As a rule of thumb, `em` units are better for sizing inline elements, and `rem` units are better for block elements. [SVG icons are perfect candidates](https://andy-bell.design/links/121/) for `em`\-based sizing, since they either accompany or supplant text.

![A download icon has a 0.75em height to match the height of the accompanying text: Download Stack.zip](https://every-layout.dev/images/illustrations/units_metrics.svg)

Image caption: The actual value, in `ems`, of the icon height/width must be adapted to the accompanying font’s own metrics, in some cases. The Barlow Condensed font used on this site has a lot of internal space to compensate for — hence the `0.75em` value.

### The `ch` and `ex` units

The `ch` and `ex` units pertain to the (approximate) width and height of one character respectively. `1ch` is based on the width of a `0`, and `1ex` is equal to the _height_ of your font’s `x` character—also known as the [x height or corpus size](https://en.wikipedia.org/wiki/X-height).

![Shows that the width of one zero is 1ch and the height of one lowercase x is one ex](https://every-layout.dev/images/illustrations/units_ch-ex.svg)

In the [**Axioms**](https://every-layout.dev/rudiments/axioms) section, the `ch` unit is used to restrict elements’ [measure](https://en.wikipedia.org/wiki/Line_length) for readability. Since measure is a question of characters per line, `ch` (short for _character_) is the only appropriate unit for this styling task.

An `<h2>` and an `<h3>` can have different `font-size` values, but the same (maximum) measure.

```css
h2,h3 {  max-inline-size: 60ch;}h3 {  font-size: 2rem;}h2 {  font-size: 2.5rem;}
```

The width, in pixels, of one full line of text is _extrapolated_ from the relationship between the `rem`\-based `font-size` and `ch`\-based `max-width`. By delegating an algorithm to determine this value—rather than hard coding it as a `px`\-based `width`—we avoid frequent and serious error. In CSS layout terms, an error is malformed or obscured content: _data loss for human beings_.