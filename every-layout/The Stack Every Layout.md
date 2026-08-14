---
title: "The Stack: Every Layout"
description: "A composable CSS layout primitive."
---


-   [The problem](https://every-layout.dev/layouts/stack/#the-problem)
-   [The solution](https://every-layout.dev/layouts/stack/#the-solution)
-   [Use cases](https://every-layout.dev/layouts/stack/#use-cases)
-   [The generator](https://every-layout.dev/layouts/stack/#the-generator)
-   [The component](https://every-layout.dev/layouts/stack/#the-component)

Flow elements require space (sometimes referred to as _white space_) to physically and conceptually separate them from the elements that come before and after them. This is the purpose of the `margin` property.

However, design systems conceive elements and components in isolation. At the time of conception, it is not settled whether there will be surrounding content or what the nature of that content will be. One element or component is likely to appear in different contexts, and the requirement for spacing will differ.

We are in the habit of styling elements, or classes of elements, directly: we make style declarations _belong_ to elements. Typically, this does not produce any issues, but `margin` is really a property of the _relationship_ between two proximate elements. The following code is therefore problematic:

```css
p {  margin-bottom: 1.5rem;}
```

Since the declaration is not context sensitive, any correct application of the margin is a matter of luck. If the paragraph is proceeded by another element, the effect is desirable. But a `:last-child` paragraph produces a redundant margin. Inside a padded parent element, this redundant margin combines with the parent’s padding to produce double the intended space. This is just one problem this approach produces.

![The left example shows an expected space between two paragraphs. The right example shows an undesired double space between the bottom paragraph and the bottom edge/border of the containing box](https://every-layout.dev/images/illustrations/stack_padding_issue.svg)

The trick is to style the context, not the individual element(s). The **Stack** layout primitive injects margin between elements via their common parent:

```css
.stack > * + * {  margin-block-start: 1.5rem;}
```

Using the adjacent sibling combinator (`+`), `margin-block-start` is only applied where the element is preceded by another element: no “left over” margin. The universal (or _wildcard_) selector (`*`) ensures any and all elements are affected. The key `* + *` construct is known as the [owl](https://alistapart.com/article/axiomatic-css-and-lobotomized-owls).

### Recursion

In the previous example, the child combinator (`>`) ensures the margins only apply to children of the `.stack` element. However, it’s possible to inject margins recursively by removing this combinator from the selector.

```css
.stack * + * {  margin-block-start: 1.5rem;}
```

This can be useful where you want to affect elements at any nesting level, while retaining white space regularity.

![Two nested boxes with borders do not exhibit doubled spacing. The space is equal between each element](https://every-layout.dev/images/illustrations/stack_nesting.svg)

In the following demonstration (using the [Stack component](https://every-layout.dev/layouts/stack/#the-component) to follow) there are a set of box-shaped elements. Two of these are nested within another. Because recursion is applied, each box is evenly spaced using just one parent **Stack**.

You’re likely to find the recursive mode affects unwanted elements. For example, generic list items that are typically not separated by margins will become unexpectedly _spread out_.

### Nested variants

Recursion applies the same margin no matter the nesting depth. A more deliberate approach would be to set up alternative non-recursive **Stacks** with different margin values, and nest them where suitable. Consider the following.

```css
[class^='stack'] > * {  /* top and bottom margins in horizontal-tb writing mode */  margin-block: 0;}.stack-large > * + * {  margin-block-start: 3rem;}.stack-small > * + * {  margin-block-start: 0.5rem;}
```

The first declaration block’s selector resets the vertical margin for all **Stack**\-like elements (by matching class values that _begin_ with `stack`). Importantly, only the vertical margins are reset, because the stack only _affects_ vertical margin, and we don't want it to reach outside its remit. You may not need this reset if a universal reset for `margin` is already in place (see [**Global and local styling**](https://every-layout.dev/rudiments/global-and-local-styling)).

The following two blocks set up alternative **Stacks**, with different margin values. These can be nested to produce—for example—the illustrated form layout. Be aware that the `<label>` elements would need to have `display: block` applied to appear above the inputs, and for their margins to actually produce spaces (the vertical margin of inline elements has no effect; see [**The display property**](https://every-layout.dev/rudiments/boxes#the-display-property)).

![A form uses the large Stack spacing to separate whole fields, and a nested small Stack spacing to separate field labels from their inputs and errors](https://every-layout.dev/images/illustrations/stack_form.svg)

In **Every Layout**, custom elements are used to implement layout components/primitives like the **Stack**. In [the **Stack** component](https://every-layout.dev/layouts/stack/#the-component), the `space` prop (property; attribute) is used to define the spacing value. The modified classes example above is just for illustration. See the [nested example](https://every-layout.dev/layouts/stack/#nested).

### Exceptions

CSS works best as an exception-based language. You write far-reaching rules, then use the cascade to override these rules in special cases. As written in [Managing Flow and Rhythm with CSS Custom Properties](https://24ways.org/2018/managing-flow-and-rhythm-with-css-custom-properties/), you can create per-element exceptions within a single **Stack** context (i.e. at the same nesting level).

```css
.stack > * + * {  margin-block-start: var(--space, 1.5em);}.stack-exception,.stack-exception + * {  --space: 3rem;}
```

Note that we are applying the increased spacing above _and_ below the `.exception` element, where applicable. If you only wanted to increase the space above, you would remove `.exception + *`.

This works because `*` has _zero_ specificity, so `.stack > * + *` and `.stack-exception` are the same specificity and `.stack-exception` overrides `.stack > * + *` in the cascade (by appearing further down in the stylesheet).

### Splitting the stack

By making the **Stack** a Flexbox context, we can give it one final power: the ability to add an `auto` margin to a chosen element. This way, we can group elements to the top and bottom of the vertical space. Useful for card-like components.

In the following example, we've chosen to group elements _after_ the second element towards the bottom of the space.

```css
.stack {  display: flex;  flex-direction: column;  justify-content: flex-start;}.stack > * + * {  margin-block-start: var(--space, 1.5rem);}.stack > :nth-child(2) {  margin-block-end: auto;}
```

This can be seen working in context in the following demo depicting a presentation/slides editor. The [**Cover**](https://every-layout.dev/layouts/cover) element on the right has a minimum height of `66.666vh`, forcing the left sidebar's height to be taller than its content. This is what produces the gap between the slide images and the _"Add slide"_ button.

## Title of slide

pretium in et ultrices cubilia sed tristique commodo neque lacus ut semper ac orci ante blandit nec eget ornare pellentesque auctor pretium orci vulputate porttitor efficitur sapien duis dolor laoreet id in urna ac ac pretium blandit ornare eu iaculis arcu ligula sapien euismod lacus quam quam pretium ipsum sapien

Where the **Stack** is the only child of its parent, nothing forces it to _stretch_ as in the last example/demo. A height of `100%` ensures the **Stack's** height _matches_ the parent's and the split can occur.

```css
.stack:only-child {  /* ↓ `height` in horizontal-tb writing mode */  block-size: 100%;}
```

The potential remit of the **Stack** layout can hardly be overestimated. Anywhere elements are stacked one atop another, it is likely a **Stack** should be in effect. Only adjacent elements (such as grid cells) should not be subject to a **Stack**. The grid cells _are_ likely to be **Stacks**, however, and the grid itself a member of a **Stack**.

![A 3 by 2 grid. One of the cells is marked as a Stack, and contains evenly spaced child elements](https://every-layout.dev/images/illustrations/stack_grid.svg)

Use this tool to help you generate basic **Stack** CSS and HTML.

CSS HTML

```

.stack {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.stack > * {
  margin-block: 0;
} 

.stack > * + * {
  margin-block-start: var(--space, 1.5rem);
}


  
```

A custom element implementation of the **Stack** is provided for download. Consult the API and examples to follow for more information.

[Download Stack.zip](https://every-layout.dev/downloads/Stack.zip)

### Props API

The following props (attributes) will cause the **Stack** component to re-render when altered. They can be altered by hand—in browser developer tools—or as the subjects of inherited application state.

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| space | `string` | `"var(--s1)"` | A CSS `margin` value |
| recursive | `boolean` | `false` | Whether the spaces apply recursively (i.e. regardless of nesting level) |
| splitAfter | `number` |  | The element after which to _split_ the stack with an auto margin |

### Examples

#### Basic

```html
<stack-l>  <h2><!-- some text --></h2>  <img src="path/to/some/image.svg" />  <p><!-- more text --></p></stack-l>
```

#### Nested

```html
<stack-l space="3rem">  <h2><!-- heading label --></h2>  <stack-l space="1.5rem">    <p><!-- body text --></p>    <p><!-- body text --></p>    <p><!-- body text --></p>  </stack-l>  <h2><!-- heading label --></h2>  <stack-l space="1.5rem">    <p><!-- body text --></p>    <p><!-- body text --></p>    <p><!-- body text --></p>  </stack-l></stack-l>
```

#### Recursive

```html
<stack-l recursive>  <div><!-- first level child --></div>  <div><!-- first level sibling --></div>  <div>    <div><!-- second level child --></div>    <div><!-- second level sibling --></div>  </div></stack-l>
```

#### List semantics

In some cases, browsers should interpret the **Stack** as a list for screen reader software. You can use the following ARIA attribution to achieve this.

```html
<stack-l role="list">  <div role="listitem"><!-- item 1 content --></div>  <div role="listitem"><!-- item 2 content --></div>  <div role="listitem"><!-- item 3 content --></div></stack-l>
```
