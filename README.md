# Chat Notes

Plugin for building chat artboards inside fimga

Built with [Figma Plugin DS Svelte](https://github.com/thomas-lowry/figma-plugin-ds-svelte)

## Development
During development, watch your project for changes with the following command.

```bash
npm run dev
```
Start building your plugin UI in `'src/Plugin.svelte'`.


## Build
When ready to package up your final Figma Plugin:
```bash
npm run build
```


## Useful info
To include an external CSS file:
```javascript
import styles from './styles.css';
```

To include an SVG:
```javascript
import SvgName from './image.svg';

//use in your markup
{@html SvgName}
```
_For more info on using the Icon component system with SVGs from [Figma Plugin DS Svelte](https://github.com/thomas-lowry/figma-plugin-ds-svelte), refer to the repo._
