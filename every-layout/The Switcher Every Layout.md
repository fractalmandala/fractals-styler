-   [The solution](https://every-layout.dev/layouts/switcher/#the-solution)
-   [Use cases](https://every-layout.dev/layouts/switcher/#use-cases)
-   [The Generator](https://every-layout.dev/layouts/switcher/#the-generator)
-   [The Component](https://every-layout.dev/layouts/switcher/#the-component)

As we set out in [**Boxes**](https://every-layout.dev/rudiments/boxes), it’s better to provide _suggestions_ rather than diktats about the way the visual design is laid out. An overuse of `@media` breakpoints can easily come about when we try to _fix_ designs to different contexts and devices. By only suggesting to the browser how it should arrange our layout boxes, we move from creating multiple layouts to single _quantum_ layouts existing simultaneously in different states.

The `flex-basis` property is an especially useful tool when adopting such an approach. A declaration of `width: 20rem` means just that: make it `20rem` wide — regardless of circumstance. But `flex-basis: 20rem` is more nuanced. It tells the browser to consider `20rem` as an ideal or “target” width. It is then free to calculate just how closely the `20rem` target can be resembled given the content and available space. You empower the browser to make the right decision for the content, and the user, reading that content, given their circumstances.

Consider the following code.

```css
.grid {  display: flex;  flex-wrap: wrap;}.grid > * {  width: 33.333%;}@media (max-width: 60rem) {  .grid > * {    width: 50%;  }}@media (max-width: 30rem) {  .grid > * {    width: 100%;  }}
```

The mistake here (aside from not using the logical property `inline-size` in place of `width`) is to adopt an _extrinsic_ approach to the layout: we are thinking about the viewport first, then adapting our boxes to it. It’s verbose, unreliable, and doesn’t make the most of Flexbox’s capabilities.

With `flex-basis`, it's easy to make a responsive Grid-like layout which is in no need of `@media` breakpoint intervention. Consider this alternative code:

```css
.grid {  display: flex;  flex-wrap: wrap;}.grid > * {  flex: 1 1 20rem;}
```

Now I'm thinking _intrinsically_ — in terms of the subject elements’ own dimensions. That [`flex` shorthand property](https://css-tricks.com/almanac/properties/f/flex/) translates to _"let each element grow and shrink to fill the space, but try to make it about `20rem` wide"_. Instead of manually pairing the column count to the viewport width, I’m telling the browser to _generate_ the columns based on my desired column width. I’ve automated my layout.

As [Zoe Mickley Gillenwater](https://zomigi.com/) has pointed out, `flex-basis`, in combination with `flex-grow` and `flex-shrink`, achieves something similar to an [element/container query](https://www.smashingmagazine.com/2016/07/how-i-ended-up-with-element-queries-and-how-you-can-use-them-today/) in that “breaks” occur, implicitly, according to the available space rather than the viewport width. My Flexbox “grid” will automatically adopt a different layout depending on the size of the container in which it is placed. Hence: _quantum layout_.

### Issues with two-dimensional symmetry

While this is a serviceable layout mechanism, it only produces two layouts wherein each element is the same width:

-   The single-column layout (given the narrowest of containers)
-   The regular multi-column layout (where each row has an equal number of columns)

In other cases, the number of elements and the available space conspire to make layouts like these:

![On the left is a layout of two rows of elements. The first row has three items and the second row has just two. On the right there is a similar layout, except the final row is just one row-long item](https://every-layout.dev/images/illustrations/switcher_asymmetric.svg)

This is not _necessarily_ a problem that needs to be solved, depending on the brief. So long as the content configures itself to remain in the space, unobscured, the most important battle has been won. However, for smaller numbers of subject elements, there may be cases where you wish to switch _directly_ from a horizontal (one row) to a vertical (one column) layout and bypass the intermediary states.

Any element that has wrapped and grown to adopt a different width could be perceived by the user as being “picked out”; made to deliberately look different, or more important. We should want to avoid this confusion.

![Diagram shows a horizontal line of three elements bypassing an intermediate layout (of two items and the third item on its own row) to form a single-column layout](https://every-layout.dev/images/illustrations/switcher_bypass.svg)

The **Switcher** element (based on the bizarrely named [Flexbox Holy Albatross](http://www.heydonworks.com/article/the-flexbox-holy-albatross)) switches a Flexbox context between a horizontal and a vertical layout at a given, _container_\-based breakpoint. That is, if the breakpoint is `30rem`, the layout will switch to a vertical configuration when the parent element is less than `30rem` wide.

In order to achieve this switch, first a basic horizontal layout is instated, with wrapping and `flex-grow` enabled:

```css
.switcher > * {  display: flex;  flex-wrap: wrap;}.switcher > * > * {  flex-grow: 1;}
```

The `flex-basis` value enters the (current) width of the container, expressed as `100%`, into a calculation with the designated `30rem` breakpoint.

```
30rem - 100%
```

Depending on the parsed value of `100%`, this will return either a _positive_ or _negative_ value: positive if the container is narrower than `30rem`, or negative if it is wider. This number is then multiplied by `999` to produce either a _very large_ positive number or a _very large_ negative number:

```
(30rem - 100%) * 999
```

Here is the `flex-basis` declaration in situ:

```css
.switcher > * {  display: flex;  flex-wrap: wrap;}.switcher > * > * {  flex-grow: 1;  flex-basis: calc((30rem - 100%) * 999);}
```

A negative `flex-basis` value is invalid, and dropped. Thanks to CSS’s resilient error handling this means just the `flex-basis` line is ignored, and the rest of the CSS is still applied. The erroneous negative `flex-basis` value is corrected to `0` and—because `flex-grow` is present—each element grows to take up an equal proportion of horizontal space.

If, on the other hand, the calculated `flex-basis` value is a large positive number, each element _maxes out_ to take up a whole row. This results in the vertical configuration. Intermediary configurations are successfully bypassed.

![Diagram shows that flex-basis negative n times 999 results in the horizontal configuration and positive n times 999 results in the vertical configuration](https://every-layout.dev/images/illustrations/switcher_flex-basis_calc.svg)

### Gutters

To support margins ('gutters'; 'gaps') between the subject elements, we could adapt the [negative margin technique covered in the **Cluster** documentation](https://every-layout.dev/layouts/cluster). However, the `flex-basis` calculation would need to be adapted to compensate for the increased width produced by _stretching_ the parent element. That is, by applying negative margins on all sides, the parent becomes wider than _its_ container and their `100%` values no longer match.

```css
.switcher {  --threshold: 30rem;  --space: 1rem;}.switcher > * {  display: flex;  flex-wrap: wrap;  /* ↓ Multiply by -1 to make negative */  margin: calc(var(--space) / 2 * -1);}.switcher > * > * {  flex-grow: 1;  flex-basis: calc((var(--threshold) - (100% - var(--space))) * 999);  /* ↓ Half the value to each element, combining to make the whole */  margin: calc(var(--space) / 2);}
```

Instead, since `gap` is now supported in all major browsers, we don’t have to worry about such calculations any more. The `gap` property represents the browser making such calculations for us. And it allows us to cut both the HTML and CSS code down quite a bit.

```css
.switcher {  display: flex;  flex-wrap: wrap;  gap: 1rem;  --threshold: 30rem;}.switcher > * {  flex-grow: 1;  flex-basis: calc((var(--threshold) - 100%) * 999);}
```

### Quantity threshold

In the horizontal configuration, the amount of space alloted each element is determined by two things:

-   The total space available (the width of the container)
-   The number of sibling elements

So far, my **Switcher** _switches_ according to the available space. But we can add as many elements as we like, and they will lay out together horizontally above the breakpoint (or _threshold_). The more elements we add, the less space each gets alloted, and things can easily start to get squashed up.

This is something that could be addressed in documentation, or by providing warning or error messages in the developer's console. But that isn't very efficient or robust. Better to _teach_ the layout to handle this problem itself. The aim for each of the layouts in this project is to make them as self-governing as possible.

It is quite possible to style each of a group of sibling elements based on how many siblings there are in total. The technique is something called a [quantity query](https://alistapart.com/article/quantity-queries-for-css/). Consider the following code.

```css
.switcher > :nth-last-child(n+5),.switcher > :nth-last-child(n+5) ~ * {  flex-basis: 100%;}
```

Here, we are applying a `flex-basis` of `100%` to each element, only where there are **five or more elements in total**. The `nth-last-child(n+5)` selector targets any elements that are more than 4 from the _end_ of the set. Then, the general sibling combinator (`~`) applies the same rule to the rest of the elements (it matches anything after `:nth-last-child(n+5)`). If there are fewer that 5 items, no `:nth-last-child(n+5)` elements and the style is not applied.

![Counting from the right back to the start, n + 5 matches any element starting at the 5th last element. If these elements are matched, you can use them to select all of the rest of the elements with the general sibling (~) combinator.](https://every-layout.dev/images/illustrations/switcher_quantities.svg)

Now the layout has two kinds of threshold that it can handle, and is twice as robust as a result.

There are any number of situations in which you might want to switch directly between a horizontal and vertical layout. But it is especially useful where each element should be considered equal, or part of a continuum. Card components advertising products should share the same width no matter the orientation, otherwise one or more cards could be perceived as highlighted or featured in some way.

A set of numbered steps is also easier on cognition if those steps are laid out along one horizontal or vertical line.

![Numbered steps going from either left to right or top to bottom, but not both at the same time](https://every-layout.dev/images/illustrations/switcher_steps.svg)

Use this tool to generate basic **Switcher** CSS and HTML.

CSS HTML

```

.switcher {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s1);
}

.switcher > * {
  flex-grow: 1;
  flex-basis: calc(( 30rem - 100%) * 999);
}

.switcher > :nth-last-child(n+ 5),
.switcher > :nth-last-child(n+ 5) ~ * {
  flex-basis: 100%;
}
  
```

A custom element implementation of the **Switcher** is provided for download. Consult the API and examples to follow for more information.

[Download Switcher.zip](https://every-layout.dev/downloads/Switcher.zip)

### Props API

The following props (attributes) will cause the **Switcher** component to re-render when altered. They can be altered by hand—in browser developer tools—or as the subjects of inherited application state.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| threshold | `string` | `"var(--measure)"` | A CSS `width` value (representing the 'container breakpoint') |
| space | `string` | `"var(--s1)"` | A CSS `margin` value |
| limit | `integer` | `4` | A number representing the maximum number of items permitted for a horizontal layout |