# sky-reveal
> Simple js module for collapsing content as stand-alone or used by sky-accordion.

## Dependencies
- [TweenLite](https://github.com/greensock/GreenSock-JS)

## Usage
Import sky-reveal
``` html
// Stand-alone configuration
<sky-reveal
	v-bind:button="{
	    // Label when content is collapsed
		show: 'Vis mere',
		// Label when content is expanded
		hide: 'Vis mindre',
	}">
    ** Content to be collapsed **
</sky-reveal>

// Externally triggered configuration
<sky-reveal
	v-bind:open-reveal="open"
	v-bind:external-id="id">
    // 'open' is a dynamic Boolean changed by parent (required)
    // 'id' is a unique Number OR String set by parent (optional)

    ** Content to be collapsed **
</sky-reveal>
```

## Misc
If a small preview is need for the collapsed content, then set a `min-height` which correllates with the desired preview size. If sky-reveal is used as stand-alone AND externally trigger module - remember to override `min-height` preview is wanted in the stand-alone module and not the externally triggerede version.
##### Example
``` css
.skyReveal-content {
    min-height: 20px;
}

// Adjust preview gradient
.skyReveal-content:after {
    /* Other desired styling changes */
    background: linear-gradient(to top, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%);
}

// Avoid preview in externally triggered sky-reveal
.some-parent .skyReveal-content {
    min-height: auto;
}
```

# Credits
This module is made by the Frontenders at [skybrud.dk](http://www.skybrud.dk/). Feel free to use it in any way you want. Feedback, questions and bugreports should be posted as issues. Pull-requests appreciated!