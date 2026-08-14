---
title: "Global and local styling: Every Layout"
description: "Relearn CSS layout"
---


In the [**Composition**](https://every-layout.dev/rudiments/composition) section we covered how small, _nonlexical_ components for layout can be used to create larger composites, but not all styles within an efficient and consistent CSS-based design system should be strictly component based. This section will contextualize layout components in a larger system that includes global styles.

## What are global styles?

When people talk about the _global_ nature of CSS, they can mean one of a few different things. They may be referring to rules on the `:root` or `<body>` elements that are _inherited_ globally (with just a few exceptions).

```css
:root {  /* ↓ Now (almost) all elements display a sans-serif font */  font-family: sans-serif;}
```

Alternatively, they may mean using the unqualified [`*` selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Universal_selectors) to style all elements _directly_.

```css
* {  /* ↓ Now literally all elements display a sans-serif font */  font-family: sans-serif;}
```

Element selectors are more specific, and only target the elements they name. But they are still “global” because they can _reach_ those elements wherever they are situated.

```css
p {  /* ↓ Wherever you put a paragraph, it’ll be sans-serif */  font-family: sans-serif;}
```

A liberal use of element selectors is the hallmark of a comprehensive design system. Element selectors take care of generic [atoms](http://bradfrost.com/blog/post/atomic-web-design/#atoms) such as headings, paragraphs, links, and buttons. Unlike when using classes (see below), element selectors can target the arbitrary, unattributed content produced by [WYSIWYG editors](https://en.wikipedia.org/wiki/WYSIWYG) and [markdown](https://help.github.com/en/articles/basic-writing-and-formatting-syntax).

The [layouts](https://every-layout.dev/layouts) of **Every Layout** do not explore or prescribe styles for simple elements; that is for you to decide. It is the imbrication of simple elements into composite layouts that we are interested in here.

![A box labeled layout contains three boxes, each labeled element or layout](https://every-layout.dev/images/illustrations/global_layout_recursive.svg)

Image caption: Each layout requires a container element which establishes a _formatting context_ for its children. Simple elements, without children for which they establish a context, can be thought of as 'end nodes' in the layout hierarchy.

Finally, class-based styles, once defined, can be adhered to any HTML element, anywhere in a document. These are more portable and composable than element styles, but require the author to affect the markup directly.

```css
.sans-serif {  font-family: sans-serif;}
```

```html
<div class="sans-serif">...</div><small class="sans-serif">...</small><h2 class="sans-serif">...</h2>
```

It should be appreciated how important it is to leverage the global reach of CSS rules. CSS itself _exists_ to enable the styling of HTML globally, and by category, rather than element-by-element. When used as intended, it is the most efficient way to create any kind of layout or aesthetic on the web. Where global styling techniques (such as the ones above) are used appropriately, it’s much easier to separate branding/aesthetic from layout, and treat the two as [separate concerns](https://en.wikipedia.org/wiki/Separation_of_concerns).

![Two separate layers. The top layer is labeled fonts, colors, shadows, etc. The bottom layer is labeled arrangement of boxes.](https://every-layout.dev/images/illustrations/global_layers.svg)

### Utility classes

As we already stated, classes differ from the other global styling methods in terms of their portability: you can use classes between different HTML elements and their types. This allows us to _diverge_ from inherited, universal, and element styles _globally_.

For example, all of our `<h2>` elements may be styled, by default, with a `2.25rem` `font-size`:

```css
h2 {  font-size: 2.25rem;}h3 {  font-size: 1.75rem;}
```

However, there may be a specific cases where we want that `font-size` to be diminished slightly (perhaps horizontal space is at a premium, or the heading is somewhere where it should have less visual affordance). If we were to switch to an `<h3>` element to affect this visual change, we would [make a nonsense of the document structure](https://webaim.org/techniques/semanticstructure/#correctly).

Instead, we could build a more complex selector pertaining to the smaller `<h2>`’s context:

```css
.sidebar h2 {  font-size: 1.75rem;}
```

While this is better than messing up the document structure, I've made the mistake of not taking the _whole_ emerging system into consideration: We've solved the problem for a specific element, in a specific context, when we should be solving the general problem (needing to adjust `font-size`) for _any_ element in _any_ context. This is where utility classes come in.

```css
/* ↓ Backslash to escape the colon */.font-size\:base {  font-size: 1rem;}.font-size\:biggish {  font-size: 1.75rem;}.font-size\:big {  font-size: 2.25rem;}
```

We use a very _on the nose_ naming convention, which emulates CSS declaration structure: `property-name:value`. This helps with recollection of utility class names, especially where the value echos the actual value, like `.text-align:center`.

Sharing values between elements and utilities is a job for [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*). Note that we’ve made the custom properties themselves globally available by attaching them to the `:root` (`<html>`) element:

```css
:root {  --font-size-base: 1rem;  --font-size-biggish: 1.75rem;  --font-size-big: 2.25rem;}/* elements */h3 {  font-size: var(--font-size-biggish);}h2 {  font-size: var(--font-size-big);}/* utilities */.font-size\:base {  font-size: var(--font-size-base) !important;}.font-size\:biggish {  font-size: var(--font-size-biggish) !important;}.font-size\:big {  font-size: var(--font-size-big) !important;}
```

Each utility class has an `!important` suffix to max out its specificity. Utility classes are for final adjustments, and should not be overridden by anything that comes before them.

![An inverted triangle with reach pointing towards to top edge and specificity reaching towards to bottom point](https://every-layout.dev/images/illustrations/measure_inverted_triangle.svg)

Image caption: Sensible CSS architecture has “reach” (how many elements are affected) inversely proportional to specificity (how complex the selectors are). This was formalized by Harry Roberts as ITCSS, with IT standing for Inverted Triangle.

The values in the previous example are just for illustration. For consistency across the design, your sizes should probably be derived from a modular scale. See [**Modular scale**](https://every-layout.dev/rudiments/modular-scale) for more.

## Local or 'scoped' styles

Notably, the `id` attribute/property (for [reasons of accessibility](https://www.deque.com/blog/unique-id-attributes-matter/), most importantly) can only be used on one HTML element per document. Styling via the `id` selector is therefore limited to one instance.

```css
#unique {  /* ↓ Only styles id="unique" */  font-family: sans-serif;}
```

The `id` selector has a very high [specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) because it’s assumed unique styles are intended to override competing generic styles in all cases.

Of course, there’s nothing more “local” or _instance specific_ than applying styles directly to elements using the `style` attribute/property:

```html
<p style="font-family: sans-serif">...</p>
```

The only remaining _standard_ for localizing styles is within Shadow DOM. By making an element a `shadowRoot`, one can use low-specificity selectors that only affect elements inside that parent.

```js
const elem = document.querySelector('div');const shadowRoot = elem.attachShadow({mode: 'open'});shadowRoot.innerHTML = `  <style>    p {      /* ↓ Only styles <p>s inside the element’s Shadow DOM */      font-family: sans-serif;    }  </style>  <p>A sans-serif paragraph</p>`;
```

### Drawbacks

The `id` selector, inline styles, and Shadow DOM all have drawbacks:

-   **`id` selectors:** Many find the high specificity to cause systemic issues. There’s also the necessity of coming up with the `id`’s name in each case. Dynamically generating a unique string is often preferable.
-   **Inline styles:** A maintenance nightmare, which is the reason CSS was antidotally conceived in the first place.
-   **Shadow DOM:** Not only are styles prevented from “leaking out” of the Shadow DOM root, but (most) styles are not permitted to get _in_ either — meaning you can no longer leverage global styling.

![The outer box represents the DOM and the inner box represents the Shadow DOM. Styles from the DOM bounce off the Shadow DOM box, and styles inside the Shadow DOM bounce off its own edges and stay contained.](https://every-layout.dev/images/illustrations/global_shadow.svg)

What we need is a way to simultaneously leverage global styling, but apply local, _instance-specific_ styles in a controlled fashion.

## Primitives and props

As set out in [**Composition**](https://every-layout.dev/rudiments/composition), the main focus of **Every Layout** is on the simple [layout primitives](https://every-layout.dev/layouts) that help to arrange elements/boxes together. These are the primary tools for eliciting layout and take their place between generic global styles and utilities.

1.  Universal (including inherited) styles
2.  Layout primitives
3.  Utility classes

Manifested as reusable components, using the [custom elements specification](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements), these layouts can be used globally. But unique _configurations_ of these layouts are possible using props (properties).

### Defaults

Each layout component has an accompanying stylesheet that defines its basic and default styles. For example, the [**Stack**](https://every-layout.dev/layouts/stack) stylesheet (`Stack.css`) looks like the following.

```css
stack-l {  display: block;}stack-l > * + * {  margin-top: var(--s1);}
```

A few things to note:

-   The `display: block` declaration is necessary since custom elements render as inline elements by default. See [**Boxes**](https://every-layout.dev/rudiments/boxes) for more information on block and inline element behavior.
-   The `margin-top` value is what makes the **Stack** a _stack_: it inserts margin between a vertical stack of elements. By default, that margin value matches the first point on our [modular scale](https://every-layout.dev/rudiments/modular-scale): `--s1`.
-   The `*` selector applies to any element, but our use of `*` is qualified to match any _successive_ child element of a `<stack-l>` (note the [adjacent sibling combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_combinator)). The layout primitive is a composition in abstract, and should not prescribe the content, so I use `*` to match any child element types given to it.

![The larger box is labeled layout. The three boxes inside it are each labeled with an asterisk (universal selector) and the text “any element”.](https://every-layout.dev/images/illustrations/global_layout_star.svg)

In the custom element definition itself, we apply the default value to the `space` property:

```js
get space() {  return this.getAttribute('space') || 'var(--s1)';}
```

Each **Every Layout** custom element builds an embedded stylesheet based on the instance’s property values. That is, this…

```html
<stack-l space="var(--s3)">  <div>...</div>  <div>...</div>  <div>...</div></stack-l>
```

…would become this…

```html
<stack-l data-i="Stack-var(--s3)" space="var(--s3)">  <div>...</div>  <div>...</div>  <div>...</div></stack-l>
```

… and would generate this:

```html
<style id="Stack-var(--s3)">  [data-i='Stack-var(--s3)'] > * + * {    margin-top: var(--s3);  }</style>
```

However—and this part is important—the `Stack-var(--s3)` string only represents a unique _configuration_ for a layout, not a unique instance. One `id="Stack-var(--s3)"` `<style>` element is used to serve all instances of `<stack-l>` sharing the configuration represented by the `Stack-var(--s3)` string. Between instances of the same configuration, the only thing that _really_ differentiates them is their _content_.

While each item of content within a web page should generally offer unique information, the _look and feel_ should be consistent and regular, using familiar and repeated patterns, motifs, and arrangements. Leveraging global styles along with controlled layout configurations results in consistency and cohesion, and with minimal code.
