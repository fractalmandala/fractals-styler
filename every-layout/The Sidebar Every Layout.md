---
title: "The Sidebar: Every Layout"
description: "A composable CSS layout primitive."
---


-   [The problem](https://every-layout.dev/layouts/sidebar/#the-problem)
-   [The solution](https://every-layout.dev/layouts/sidebar/#the-solution)
-   [Use cases](https://every-layout.dev/layouts/sidebar/#use-cases)
-   [The generator](https://every-layout.dev/layouts/sidebar/#the-generator)
-   [The component](https://every-layout.dev/layouts/sidebar/#the-component)

When the dimensions and settings of the medium for your visual design are indeterminate, even something simple like _putting things next to other things_ is a quandary. Will there be enough horizontal space? And, even if there is, will the layout make the most of the _vertical_ space?

![The left example shows the content overflowing where there are too many adjacent elements. The right example shows the unsightly gaps produced when there are adjacent elements of different heights](https://every-layout.dev/images/illustrations/sidebar_gaps.svg)

Where there’s not enough space for two adjacent items, we tend to employ a breakpoint (a width-based `@media` query) to reconfigure the layout, and place the two items one atop the other.

It’s important we use _content_ rather than _device_ based `@media` queries. That is, we should intervene anywhere the content needs reconfiguration, rather than adhering to arbitrary widths like `720px` and `1024px`. The massive proliferation of devices means there’s no real set of standard dimensions to design for.

But even this strategy has a fundamental shortcoming: `@media` queries for width pertain to the _viewport_ width, and have no bearing on the actual available space. A component might appear within a `300px` wide container, or it might appear within a more generous `500px` wide container. But the width of the viewport is the same in either case, so there’s nothing to “respond” to.

![Shows two viewports of the same width. In one, the component takes up the whole width, in the next it is constrained by a narrow container](https://every-layout.dev/images/illustrations/sidebar_viewport_constant.svg)

Design systems tend to catalogue components that can appear between different contexts and spaces, so this is a real problem. Only with a capability like the mooted [container queries](https://css-tricks.com/container-query-discussion/) might we teach our component layouts to be fully _context aware_.

In some respects, the CSS Flexbox module, with its provision of `flex-basis`, can already govern its own layout, per context, rather well. Consider the following code:

```css
.parent {  display: flex;  flex-wrap: wrap;}.parent > * {  flex-grow: 1;  flex-shrink: 1;  flex-basis: 30ch;}
```

The `flex-basis` value essentially determines an _ideal_ target width for the subject child elements. With growing, shrinking, and wrapping enabled, the available space is used up such that each element is as _close_ to `30ch` wide as possible. In a `> 90ch` wide container, more than three children may appear per row. Between `60ch` and `90ch` only two items can appear, with one item taking up the whole of the final row (if the total number is odd).

![At more than 90ch, there are three items per row. At less than 90ch, there are 5 items, with two items per row except the last row, which is taken up entirely by the last item](https://every-layout.dev/images/illustrations/sidebar_wrapping.svg)

Image caption: An item with an odd index, which is also the last item, can be expressed by concatenating two pseudo selectors: `:nth-child(odd):last-child`

By designing to _ideal_ element dimensions, and tolerating reasonable variance, you can essentially do away with `@media` breakpoints. Your component handles its own layout, intrinsically, and without the need for manual intervention. Many of the layouts we’re covering finesse this basic mechanism to give you more precise control over placement and wrapping.

For instance, we might want to create a classic sidebar layout, wherein one of two adjacent elements has a fixed width, and the other—the _principle_ element, if you will—takes up the rest of the available space. This should be responsive, without `@media` breakpoints, and we should be able to set a _container_ based breakpoint for wrapping the elements into a vertical configuration.

The **Sidebar** layout is named for the element that forms the diminutive _sidebar_: the narrower of two adjacent elements. It is a _quantum_ layout, existing simultaneously in one of the two configurations—horizontal and vertical—illustrated below. Which configuration is adopted is not known at the time of conception, and is dependent entirely on the space it is afforded when placed within a parent container.

![The left configuration is in a wide context and the elements are next to each other. The right configuration is in a narrow context and the elements are above and below each other.](https://every-layout.dev/images/illustrations/sidebar_quantum.svg)

Where there is enough space, the two elements appear side-by-side. Critically, the sidebar’s width is _fixed_ while the two elements are adjacent, and the non-sidebar takes up the rest of the available space. But when the two elements wrap, _each_ takes up `100%` of the shared container.

How to force wrapping at a certain point, we will come to shortly. First, we need to set up the horizontal layout.

```css
.with-sidebar {  display: flex;  flex-wrap: wrap;}.sidebar {  flex-basis: 20rem;  flex-grow: 1;}.not-sidebar {  flex-basis: 0;  flex-grow: 999;}
```

The key thing to understand here is the role of _available space_. Because the `.not-sidebar` element’s `flex-grow` value is so high (`999`), it takes up all the available space. The `flex-basis` value of the `.sidebar` element is not counted as available space and is subtracted from the total, hence the sidebar-like layout. The non-sidebar essentially squashes the sidebar down to its ideal width.

![The sidebar width is marked as n. The width of the accompanying element is all of the available space, or space minus n.](https://every-layout.dev/images/illustrations/sidebar_available.svg)

The `.sidebar` element is still technically allowed to grow, and is able to do so where `.not-sidebar` wraps beneath it. To control where that wrapping happens, we can use `min-inline-size`, which is equivalent to `min-width` in the default `horizontal-tb` writing mode.

```css
.not-sidebar {  flex-basis: 0;  flex-grow: 999;  min-inline-size: 50%;}
```

Where `.not-sidebar` is destined to be less than or equal to `50%` of the container’s width, it is forced onto a new line/row and grows to take up all of its space. The value can be anything, but `50%` is apt since a sidebar ceases to be a sidebar when it is no longer the narrower of the two elements.

![On the left, a legitimate sidebar, where the accompanying element is wider than 50% of the container. On the right, a narrower viewport has made it a false sidebar, because the accompanying element takes up less than 50% of the width.](https://every-layout.dev/images/illustrations/sidebar_50_50.svg)

### The gutter

So far, we’re treating the two elements as if they’re touching. Instead, we might want to place a gutter/space between them. Since we want that space to appear between the elements regardless of the configuration and we _don’t_ want there to be extraneous margins on the outer edges, we’ll use the `gap` property as we did for the [**Cluster** layout](https://every-layout.dev/layouts/cluster).

For a gutter of `1rem`, the CSS now looks like the following.

```css
.with-sidebar {  display: flex;  flex-wrap: wrap;  gap: 1rem;}.sidebar {  /* ↓ The width when the sidebar _is_ a sidebar */  flex-basis: 20rem;  flex-grow: 1;}.not-sidebar {  /* ↓ Grow from nothing */  flex-basis: 0;  flex-grow: 999;  /* ↓ Wrap when the elements are of equal width */  min-inline-size: 50%;}
```

vehicula convallis nec interdum ornare dolor tempus eu blandit ut dolor tellus ac ligula ante justo nec commodo phasellus euismod mauris semper in diam amet sit cubilia porttitor nec vulputate tincidunt orci lorem euismod odio amet ornare id mi sapien varius quam auctor cubilia semper pretium leo tincidunt fusce varius sed vulputate in sapien tempus dolor ipsum mi duis quisque

So far, we have been prescribing the width of our sidebar element (`flex-basis: 20rem`, in the last example). Instead, we might want to let the sidebar’s _content_ determine its width. Where we do not provide a `flex-basis` value at all, the sidebar’s width is equal to the width of its contents. The wrapping behavior remains the same.

![The sidebar is shown to be the width of the image found inside it](https://every-layout.dev/images/illustrations/sidebar_intrinsic.svg)

If we set the width of an image inside of our sidebar to `15rem`, that will be the width of the sidebar in the horizontal configuration. It will grow to `100%` in the vertical configuration.

The **Sidebar** is applicable to all sorts of content. The ubiquitous “media object” (the placing of an item of media next to a description) is a mainstay, but it can also be used to align buttons with form inputs (where the button forms the sidebar and has an _intrinsic_, content-based width).

The following example uses the [component](https://every-layout.dev/layouts/sidebar/#the-component) version, defined as a custom element.

```html
<form>  <sidebar-l side="right" space="0" contentMin="66.666%">    <input type="text">    <button>Search</button>  </sidebar-l></form>
```

Use this tool to generate basic **Sidebar** CSS and HTML.

CSS HTML

```


.with-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s1);
}

.with-sidebar > :first-child {
  flex-grow: 1;
}

.with-sidebar > :last-child {
  flex-basis: 0;
  flex-grow: 999;
  min-inline-size: 50%;
}
  
```

A custom element implementation of the **Sidebar** is provided for download. Consult the API and examples to follow for more information.

[Download Sidebar.zip](https://every-layout.dev/downloads/Sidebar.zip)

### Props API

The following props (attributes) will cause the **Sidebar** component to re-render when altered. They can be altered by hand—in browser developer tools—or as the subjects of inherited application state.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| side | `string` | `"left"` | Which element to treat as the sidebar (all values but "left" are considered "right") |
| sideWidth | `string` |  | Represents the width of the sidebar _when_ adjacent. If not set (`null`) it defaults to the sidebar's content width |
| contentMin | `string` | `"50%"` | A CSS **percentage** value. The minimum width of the content element in the horizontal configuration |
| space | `string` | `"var(--s1)"` | A CSS margin value representing the space between the two elements |
| noStretch | `boolean` | `false` | Make the adjacent elements adopt their natural height |

### Examples

#### Media object

Uses the default `50%` “breakpoint” and an increased `space` value, taken from the custom property-based [modular scale](https://every-layout.dev/rudiments/modular-scale). The sidebar/image is `15rem` wide in the horizontal configuration.

Because the image is a flex child, `noStretch` must be supplied, to stop it distorting. If the image was placed inside a `<div>` (making the `<div>` the flex child) this would not be necessary.

```html
<sidebar-l space="var(--s2)" sideWidth="15rem" noStretch>  <img src="path/to/image" alt="Description of image" />  <p><!-- the text accompanying the image --></p></sidebar-l>
```

#### Switched media object

The same as the last example, except the text _accompanying_ the image is the sidebar (`side="right"`), allowing the image to grow when the layout is in the horizontal configuration. The `<p>` sidebar has a width ([measure](https://en.wikipedia.org/wiki/Line_length)) of `30ch` (approximately 30 characters) in the horizontal configuration.

The image is contained in `<div>`, meaning `noStretch` is not necessary in this case. The image should grow to use up the available space, so the basic CSS for responsive images should be in your global styles (`img { max-width: 100% }`).

```html
<sidebar-l space="var(--s2)" side="right" sideWidth="30ch">  <div>    <image src="path/to/image" alt="Description of image">  </div>  <p><!-- the text accompanying the image --></p></sidebar-l>
```
