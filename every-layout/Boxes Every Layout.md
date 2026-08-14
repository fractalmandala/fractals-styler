As [Rachel Andrew](https://rachelandrew.co.uk/) has reminded us, [everything in web design is a box](https://www.smashingmagazine.com/2019/05/display-box-generation/), or the absence of a box. Not everything necessarily _looks_ like a box—`border-radius`, `clip-path`, and `transforms` can be deceptive, but everything takes up a box-like space. Layout is inevitably, therefore, the arrangement of boxes.

Before one can embark on combining boxes to make [composite layouts](https://every-layout.dev/rudiments/composition), it is important to be familiar with how boxes themselves are designed to behave as standard.

## The box model

The [box model](https://www.w3.org/TR/CSS2/box.html#box-dimensions) is the formula upon which layout boxes are based, and comprises content, padding, border, and margin. CSS lets us alter these values to change the overall size and shape of elements’ display.

![Concentric rectangles reading, from the center, content, padding, border, and margin](https://every-layout.dev/images/illustrations/boxes_box-model.svg)

Web browsers helpfully apply default CSS styles to some elements, meaning they are laid out in a reasonably readable fashion: even where author CSS has not been applied.

In Chrome, the default user agent styles for paragraphs (`<p>`) look like…

```css
p {  display: block;  margin-block-start: 1em;  margin-block-end: 1em;  margin-inline-start: 0px;  margin-inline-end: 0px;}
```

… and unordered list (`<ul>`) styles look like…

```css
ul {  display: block;  list-style-type: disc;  margin-block-start: 1em;  margin-block-end: 1em;  margin-inline-start: 0px;  margin-inline-end: 0px;  padding-inline-start: 40px;}
```

### The `display` property

In both the above examples, the element's `display` property is set to `block`. Block elements assume all of the available space in one dimension. Typically, this is the horizontal dimension, because the `writing-mode` is set to `horizontal-tb` (horizontal; with a top to bottom flow direction). In some cases, and for some languages ([like Mongolian](https://w3c.github.io/i18n-drafts/articles/vertical-text/index.en)), `vertical-lr` is the appropriate writing mode.

![The first example shows block elements laid out from top to bottom (horizontal-tb writing mode). The second shows them laid out from left to right (vertical-lr writing mode)](https://every-layout.dev/images/illustrations/boxes_writing-modes.svg)

Inline elements (with the `display` value `inline`) behave differently. They are laid out _in line_ with the current context, writing mode, and direction. They are only as wide as their content, and are placed adjacently wherever there is space to do so. Block elements follow flow direction, and inline elements follow writing direction.

![A vertical stack of block elements, with one block element containing (wrapping) inline elements. The horizontal axis is labeled writing direction and the vertical axis is labeled flow direction](https://every-layout.dev/images/illustrations/boxes_inline_and_block.svg)

Thinking typographically, it could be said that block elements are like paragraphs, and inline elements are like words.

Block elements (also called [block-level](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements) elements) afford you control over both the horizontal and vertical dimensions of the box. That is, you can apply width, height, margin, and padding to a block element and it will take effect. On the other hand, inline elements are sized _intrinsically_ (prescribed `width` and `height` values do not take effect) and only _horizontal_ margin and padding values are permitted. Inline elements are designed to conform to the flow of horizontal placement among other inline elements.

A relatively new display property, `inline-block`, is a hybrid of `block` and `inline`. You _can_ set vertical properties on `inline-block` elements, although this is not always desirable—as the proceeding illustration demonstrates.

![On the left, an inline element’s vertical margins are ignored, meaning line height of rows is undisrupted. On the right, an inline-block element’s margins have prised the line height open.](https://every-layout.dev/images/illustrations/boxes_inline_and_inline-block.svg)

Of the basic `display` types, only `none` remains. This value removes the element from the layout entirely. It has no visual presence, and no impact on the layout of surrounding elements. It is as if the element itself has been removed from the HTML. Accordingly, browsers do not communicate the presence or content of `display: none` elements to assistive technologies like [screen reader software](https://en.wikipedia.org/wiki/Screen_reader).

## Logical properties

What are [logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties) and does their existence imply the existence of _illogical_ properties? English speakers accustomed to reading left to right (`direction: ltr`) and top to bottom (`writing-mode: horizontal-tb`) find it logical to use properties that include the words “left”, “right”, “top”, and “bottom” when applying styles like margin and padding.

```css
.icon {  margin-right: 0.5em;}
```

It’s when the direction or writing mode changes that this becomes illogical, because left and right (and/or top and bottom) are flipped. Now the margin you put on the right you really need on the left.

![On the left of the image, for left to right writing direction, the margin is correctly between the icon and text. On the right of the image, for right to left writing direction, the margin is incorrectly on the right hand side. There is no margin between the icon and text.](https://every-layout.dev/images/illustrations/boxes_icon-wrong.svg)

Logical properties eschew terminology like “left” and “right” because we know they can be reversed, making the terms a nonsense. Instead, we apply styles like margin, padding, and border according to the block and inline direction.

```css
.icon {  margin-inline-end: 0.5em;}
```

In a `ltr` direction, `margin-inline-end` applies margin to the right. In a `rtl` direction, `margin-inline-end` applies margin to the left. In both cases, it is applied where it is needed: at the end of the inline dimension.

![On the left, for left to right writing direction, the margin is correctly between the icon and text. The same is true for right to left direction, as seen on the right of the image.](https://every-layout.dev/images/illustrations/boxes_icon-right.svg)

## Formatting contexts

When you apply `display: flex` or `display: grid` to a `<div>`, it continues to behave like a block element, using `display: block`. However, it changes the way its _child_ elements behave. For example, with just `display: flex` (and no other Flexbox-related properties) applied to the parent, its children will distribute themselves horizontally. Or, to put it another way, the _flow direction_ is switched from vertical to horizontal.

Formatting contexts are the basis of many of the layouts documented in this project. They turn elements into layout components. In [**Composition**](https://every-layout.dev/rudiments/composition), we'll explore how different formatting contexts can be nested, to create _composite_ layouts.

## Content in boxes

The web is a conduit for primarily textual information supplemented by media such as images and videos, often referred to collectively as _content_. Browsers incorporate line wrapping and scrolling algorithms to make sure content is transmitted to the user in its entirety, irrespective of their screen sizes and dimensions, and settings such as zoom level. The web is [_responsive_](https://alistapart.com/article/responsive-web-design/) largely by default.

Without intervention, it is the contents of an element that determines its size and shape. Content makes `inline` elements grow horizontally, and `block` elements grow vertically. Left to its own devices, the _area_ of a box is determined by the area of the content it contains. Because web content is _dynamic_ (subject to change), static representations of web layouts are extremely misleading. Working directly with CSS and its flexibility from the outset, as we are here, is highly recommended.

![On the left is a wide box containing some text content. On the right is the same box but narrowed. It is taller to compensate for having the same amount of content inside it.](https://every-layout.dev/images/illustrations/boxes_n_2n.svg)

Image caption: If you halve the width of an element, it will have to be twice as tall to contain the same amount of content

### The `box-sizing` property

By default, the dimensions of a box are the dimensions of the box’s content _plus_ its padding and border values (implicitly: `box-sizing: content-box`). That is, if you set an element to be `10rem` wide, then add padding on both sides of `1rem`, it will be `12rem` wide: `10rem` plus `1rem` of left padding and `1rem` of right padding. If you opt for `box-sizing: border-box`, the content area is reduced to accommodate the padding and the total width equals the prescribed `width` of `10rem`.

![Two boxes, both with padding on all sides. The left one is taller and wider with box-sizing content-box. The right one has box-sizing border-box.](https://every-layout.dev/images/illustrations/boxes_border_box.svg)

Generally, it is considered preferable to use the `border-box` model for all boxes. It makes calculating/anticipating box dimensions easier.

Any styles, like `box-sizing: border-box`, that are applicable to all elements are best applied using the `*` (“universal” or “wildcard”) selector. As covered in detail in [**Global and local styling**](https://every-layout.dev/rudiments/global-and-local-styling), being able to affect the layout of multiple elements (in this case, _all_ elements) simultaneously is how CSS brings efficiency to layout design.

```css
* {  box-sizing: border-box;}
```

Only where the height or width of a box is constrained does the difference between `content-box` and `border-box` come into play. For illustration, consider a block element placed inside another block element. Using the `content-box` model and a padding of `1rem`, the child element will overflow by `2rem` when `inline-size: 100%` (equivalent to `width: 100%` in a `horizontal-tb` writing mode) is applied.

![The child element is boxing out over the parent element’s right edge](https://every-layout.dev/images/illustrations/boxes_100pc.svg)

Why? Because `inline-size: 100%` means _“make the width of this element the same as the parent element”_. Since we are using the `content-box` model, the _content_ is made `100%` wide, then the padding is added on to this value.

But if we use `inline-size: auto` (we can just remove `inline-size: 100%`, since `auto` is the default value) the child box fits within the parent box perfectly. And that’s _regardless_ of the `box-sizing` value.

![The child element fits exactly within the parent element’s width](https://every-layout.dev/images/illustrations/boxes_auto.svg)

Implicitly, the `height` is also set to `auto`, meaning it is derived from the content. Again, `box-sizing` has no effect.

The lesson here is the dimensions of our elements should be largely _derived_ from their inner content and outer context. When we try to _prescribe_ dimensions, things tend to go amiss. All we should be doing as visual designers is making _suggestions_ as to how the layout should take shape. We might, for instance, apply a `min-height` (as in the [**Cover** layout](https://every-layout.dev/layouts/cover)) or proffer a `flex-basis` (as in the [**Sidebar**](https://every-layout.dev/layouts/sidebar)).

The CSS of suggestion is at the heart of algorithmic layout design. Instead of telling browsers what to do, we allow browsers to make their own calculations, and draw their own conclusions, to best suit the user, their screen, and device. Nobody should experience obscured content under any circumstances.