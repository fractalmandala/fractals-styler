---
title: "Composition: Every Layout"
description: "Relearn CSS layout"
---


If you are a programmer, you may have heard of the [composition over inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance) principle. The idea is that combining simple independent parts (objects; classes; functions) gives you more flexibility, and leads to more efficiency, than connecting everything—through inheritance—to a shared origin.

_Composition over inheritance_ does not have to apply to “business logic”. It is also beneficial to favor composition in front-end architecture and visual design ([the React documentation even has a dedicated page about it](https://reactjs.org/docs/composition-vs-inheritance.html)).

## Composition and layout

To understand how composition benefits a _layout system_, let’s consider an example component. Let’s say that this component is a dialog box, because the interface (for reasons we won’t get into right now) _requires_ a dialog box. Here is what it looks like:

![A dialog element with a close button, a message in the center, and two buttons: okay and cancel](https://every-layout.dev/images/illustrations/composition_dialog.svg)

But how does it get to look like that? One way is to write some dedicated dialog CSS. You might give the dialog box a “block” identifier (`.dialog` in CSS, and `class="dialog"` in HTML) and use this as your namespace to attach style declarations.

```css
.dialog {  /* ... */}.dialog__header {  /* ... */}.dialog__body {  /* ... */}.dialog__foot {  /* ... */}
```

Alternatively, these dialog styles might be imported from a third-party CSS library/framework. In either case, a lot of the CSS used to make the dialog _look_ like a dialog, could be used to make other, similar layouts. But since everything here is namespaced under `.dialog`, when we come to make the next component, we’ll end up duplicating would-be shared styles. This is where most CSS bloat comes from.

The `namespacing` part is key here. The inheritance mindset encourages us to think about what finalized parts of UI should be called before we’ve even decided what they _do_, or what other, smaller parts can _do for them_. That’s where composition comes in.

## Layout primitives

The mistake in the last example was to think of everything about the dialog’s form as isolated and unique when, really, it's just a composition of simpler layouts. The purpose of **Every Layout** is to identify and document what each of these smaller layouts are. Together, we call them _primitives_.

The term primitive has linguistic, mathematical, and computing connotations. In each case, a primitive is something without its own meaning or purpose as such, but which can be used _in composition_ to make something meaningful, or _lexical_. In language it might be a word or phrase, in mathematics an equation, in design a pattern, or in development a component.

In JavaScript, the Boolean data type is a primitive. Just looking at the value `true` (or `false`) out of context tells you very little about the larger JavaScript application. The object data type, on the other hand, is _not_ primitive. You cannot write an object without designating your own properties. Objects are therefore meaningful; they necessarily tell you something of the author’s intent.

The dialog is meaningful, as a piece of UI, but its constituent parts are not. Here’s how we might compose the dialog box using [**Every Layout’s** layout primitives](https://every-layout.dev/layouts):

![The dialog is divided into its constituent layouts, made possible with the Cluster, Stack, Box, and Center layout primitives](https://every-layout.dev/images/illustrations/composition_dialog_primitives.svg)

Using many of the same primitives, we can create a registration form…

![A form with three fields and a submit button created from Cluster, Stack, Box, and Center layout primitives, including a nested Stack for label and input pairs](https://every-layout.dev/images/illustrations/composition_form.svg)

… or a slide layout for a conference talk:

![A slide with centered text and previous and next buttons aligned to the bottom. Made from Cover, Box, Stack, and Sidebar primitives](https://every-layout.dev/images/illustrations/composition_slide.svg)

Without primitive data types, you would have to be constantly teaching your programming language how to do basic operations. You would quickly lose sight of the specific, _meaningful_ task you set out to accomplish with the language in the first place. A design system that does not leverage primitives is similarly problematic. If every component in your pattern library follows its own rules for layout, inefficiencies and inconsistencies will abound.

The primitives each have a simple responsibility: _"space elements vertically"_, _"pad elements evenly"_, _"separate elements horizontally"_, etc. They are designed to be used in composition, as parents, children, or siblings of one another.

You probably cannot create _literally_ every layout using **Every Layout's** [primitives](https://every-layout.dev/layouts) alone. But you can certainly make most, if not all, common web layouts, and achieve many of your own unique conceptions.

In any case, you should walk away with an understanding and appreciation for the benefits of composition, and the power to create all sorts of interfaces with just a little reusable code. The English alphabet is only 26 bytes, and think of all the great works created with that!
