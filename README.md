# sky-reveal
> Simple js module that collapses content

## Dependencies
- [animeJs](https://github.com/juliangarnier/anime)
- [Sky-window](https://github.com/skybrud/sky-window)

## Usage
There are two ways to use `sky-reveal`. The first one is as a stand-alone module where you provide a toggle button (`sky-reveal-trigger`) for the content to be revealed.
Here you need to to use the attribute `reveal-id` with the same value on both `sky-reveal` and `sky-reveal-trigger`
``` html
 <sky-reveal reveal-id="asd">
    <p>
    Ullamco enim eiusmod nisi exercitation occaecat do culpa. Elit dolore nulla aliqua sunt. Ex id eu ea et quis ex pariatur veniam mollit amet laborum. Magna elit aute non est. Ullamco enim eiusmod nisi exercitation occaecat do culpa. Elit dolore nulla aliqua sunt. Ex id eu ea et quis ex pariatur veniam mollit amet laborum. Magna elit aute non est.
    </p>
</sky-reveal>

<sky-reveal-trigger reveal-id="asd">
	<svg slot="svg-prepend | svg | svg-append"></svg> (optional)
    <span slot="open">Show more</span>
    <span slot="closed">Show less</span>
</sky-reveal-trigger>
```

The other way to use `sky-reveal` is as a sub component which are provided with a bool in the `open` attribute like this. This will open / close `sky-reveal`
``` html
<sky-reveal :open="true | false">
    <p>
    Ullamco enim eiusmod nisi exercitation occaecat do culpa. Elit dolore nulla aliqua sunt. Ex id eu ea et quis ex pariatur veniam mollit amet laborum. Magna elit aute non est. Ullamco enim eiusmod nisi exercitation occaecat do culpa. Elit dolore nulla aliqua sunt. Ex id eu ea et quis ex pariatur veniam mollit amet laborum. Magna elit aute non est.
    </p>
</sky-reveal>
```

By default `sky-reveal` animates with a duration om 500ms. You can change this via the `duration` attribute.
``` html
<sky-reveal :open="true | false" :duration="750">
    ...
</sky-reveal>
```

## How it works
`Sky-reveal` uses animeJs as animation engine which handles initial state and animations from and to height. If the animation is to open `sky-reveal` it calculate auto height in pixel and animate towards this value and on completion set `height: auto` which will make the container responsive.
if closing it will use the computed property `min-height` on `.sky-reveal`.
`Sky-window` handles resize listening by using RxJS and will on resize end update and recalculate animeJs instances.


# Credits
This module is made by the Frontenders at [skybrud.dk](http://www.skybrud.dk/). Feel free to use it in any way you want. Feedback, questions and bugreports should be posted as issues. Pull-requests appreciated!
