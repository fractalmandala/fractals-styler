As [the mathematician Euclid was aware](http://mathworld.wolfram.com/EuclidsPostulates.html), even the most complex geometries are founded on simple, irreducible axioms (or _postulates_). Unless your design is founded on axioms, your output will be inconsistent and malformed. The subject of this section is how to honor a design axiom system-wide, using _typographic measure_ as an exemplar.

## Measure

The width of a line of text, in characters, is known as its [measure](https://en.wikipedia.org/wiki/Line_length). Choosing a _reasonable_ measure is critical for the comfortable scanning of successive lines. [The Elements Of Typographic Style](http://webtypography.net/2.1.2) considers any value between 45 and 75 reasonable.

Setting a measure for print media is relatively straightforward. It is simply the width of the paper artefact divided by the number of text columns placed within it — minus [margins and gutters](https://en.wikipedia.org/wiki/Column_(typography)), of course.

![A full-spread magazine layout divided into three columns of text](https://every-layout.dev/images/illustrations/measure_print_layout.svg)

The web is not static or predictable like print. Each word is separated by a breaking space ([unicode point U+0020](https://www.fileformat.info/info/unicode/char/0020/index.htm)), freeing runs of text to wrap dynamically according to available space. The amount of available space is determined by a number of interrelated factors including device size and orientation, text size, and zoom level.

As designers, we seek to control the users’ experience. But, as John Allsopp wrote in 2000’s [The Dao Of Web Design](https://alistapart.com/article/dao/), attempting _direct_ control over the way users consume content on the web is foolhardy. Enforcing a specific measure would mean setting a fixed width. Many users would experience horizontal scrolling and broken zoom functionality.

![When the viewport is narrowed, the text stays the same width and becomes obscured. A horizontal scroll bar appears](https://every-layout.dev/images/illustrations/measure_scroll.svg)

To design “adaptable pages” (Allsopp’s term), we must relinquish control to the algorithms (like text wrapping) browsers use to lay out web pages automatically. But that’s not to say there’s no place for _influencing_ layout. Think of yourself as the browser’s mentor, rather than its micro-manager.

## The measure axiom

It’s good practice to try and set out a design axiom in a short phrase or sentence. In this case that statement might be, _“the measure should never exceed 60ch”_.

The measure of what? And where? There’s no reason why _any_ line of text should become too lengthy. This axiom, like all axioms, should pervade the design without qualifications or exceptions. The real question is: how? In [**Global and local styling**](https://every-layout.dev/rudiments/global-and-local-styling) we set out three main tiers of styling:

1.  Universal (including inherited) styles
2.  Layout primitives
3.  Utility classes

The measure axiom should be seeded as pervasively as possible in the universal styles, but also made available to layout primitives (see [**Composition**](https://every-layout.dev/rudiments/composition)) and [utility classes](https://every-layout.dev/rudiments/global-and-local-styling#utility-classes). But first, which property and which value should inscribe the rule?

## The declaration

Fixed widths (and heights!) are anathema to responsive design, as we established in [**Boxes**](https://every-layout.dev/rudiments/boxes) and again here. Instead, we should deal in _tolerances_. The `max-inline-size` property, for example, tolerates any length of text, in any writing mode, _up to_ a certain value.

```css
p {  max-inline-size: 700px;}
```

That’s the property covered. However, the `px` unit is problematic. We may be able to judge, by eye, that `700px` creates a reasonable measure for the given `font-size`. But the given `font-size` is really just the `font-size` our screen happens to be displaying at the time — it’s our parochial view of our own design.

Changing `font-size` for paragraphs, or adjusting the default system font size, will create a different (maximum) measure. Because there is no _relationship_ between character length and pixel width, we do not have an algorithm that can guarantee the correct maximum measure value.

![A pixel based measure creates equal width columns of text regardless of measure](https://every-layout.dev/images/illustrations/measure_px.svg)

Fortunately, CSS includes the `ch` unit. The value of `1ch` is based on the width of the font’s `0` character. Importantly, this means changing the `font-size` changes the value of `1ch`, thereby adapting the measure. Using `ch` units is an innately algorithmic approach to measure, because the outcome is predicated on a calculation you permit the browser to make for you.

Using `ch` enables us to enforce the axiom independent of `font-size`, allowing it to be highly pervasive and in no danger of “going wrong”. Where _"the measure should never exceed 60ch"_ might have been a note in some documentation, it can instead be a quality directly coded into the design’s character.

## Global defaults

To realize the axiom, we need to ensure all applicable elements are subject to it. This is a question of selectors. We could create a class selector…

```css
.measure-cap {  max-inline-size: 60ch;}
```

…but it’s a mistake to think in terms of (utility) classes too early. It would mean applying the style manually, to individual elements in the HTML, wherever we felt it was applicable. Manual intervention is laborious, prone to error (missing elements out), and will lead to bloated markup.

Instead, we should ask ourselves which _types_ of elements the rule might apply to. Certainly flow elements designed for text. Inline elements like `<em>` and `<small>` would not need to be included, since they would take up only a part of their parent flow elements’ total measure.

```css
p,h1,h2,h3,h4,h5,h6,li,figcaption {  max-inline-size: 60ch;}
```

### Exception-based styling

It’s difficult to know if we’ve remembered everything here. An exception based approach is smarter, since we only have to remember which elements should _not_ be subject to the rule. Note that inline elements _would_ be included in the following example but, since they would take up an equal or lesser horizontal space than their parents, no ill effects would emerge.

```css
* {  max-inline-size: 60ch;}html,body,div,header,nav,main,footer {  max-inline-size: none;}
```

The `<div>` element particularly tends to be used as a generic container/wrapper. It’s likely some of these elements will contain multiple adjacent [boxes](https://every-layout.dev/layouts/box), with one or more of each wishing to take up the full `60ch`. This makes their parents logical exceptions.

An exception-based approach to CSS lets us do _most_ of our styling with the _least_ of our code. If you are not taking an exception-based approach, it may be because making exceptions feels like _correcting mistakes_. But this is far from the case. CSS, with its [cascade and other features](https://www.smashingmagazine.com/2016/11/css-inheritance-cascade-global-scope-new-old-worst-best-friends/), is designed for this. In Harry Roberts’ [ITCSS (Inverted Triangle CSS)](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/) thesis, specificity (how specific selectors are) is inversely proportional to reach (how many elements they should affect).

### A universal value

Before we start using the measure value everywhere, we’d best define it as a custom property. That way, any change to the value will be propagated throughout the design.

Note that not all custom properties have to be global, but in this case we want our elements, props, and utility classes to agree. Therefore, we place the custom property on the `:root` element.

```css
:root {  --measure: 60ch;}
```

This is passed into our universal block…

```css
* {  max-inline-size: var(--measure);}html,body,div,header,nav,main,footer {  max-inline-size: none;}
```

…and to any utility classes we may find we need.

```css
.max-inline-size\:measure {  max-inline-size: var(--measure);}.max-inline-size\:measure\/2 {  max-inline-size: calc(var(--measure) / 2);}
```

## Measure in composite layouts

Certain [layout primitives](https://every-layout.dev/rudiments/composition#layout-primitives) inevitably accept measure-related props, and some set default values for those props using `var(--measure)`. The [**Switcher**](https://every-layout.dev/layouts/switcher) has a `threshold` prop that defines the container width at which the layout switches between a horizontal and vertical configuration:

```js
get threshold() {  return this.getAttribute('threshold') || 'var(--measure)';}set threshold(val) {  return this.setAttribute('threshold', val);}
```

This is a sensible default, but can easily be overridden with any string value:

```html
<switcher-l threshold="20rem">...</switcher-l>
```

If we pass an illegitimate value to `threshold`, the declaration will be dropped, and the **Switcher’s** fallback stylesheet will apply the default value anyway. Here’s what that stylesheet looks like:

```css
switcher-l {  display: flex;  flex-wrap: wrap;}switcher-l > * {  flex-basis: calc((var(--measure) - 100%) * 999);  flex-grow: 1;}
```

Our approach to measure is one where we assume control, but a tempered kind of control that's deferential towards the way browsers work and users operate them. Many of the 'axioms' that govern your design, like _"the body font will be Font X"_ or _"headings will be dark blue"_ will not have an impact on layout as such, making them much simpler to apply just with [global styles](https://every-layout.dev/rudiments/global-and-local-styling). When layout comes into the equation, be wary of differing configurations and orientations. Choose properties, values, and units that enable the browser to calculate the most suitable layout on your behalf.