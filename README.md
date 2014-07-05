# Color

A Color object to manage those pesky CSS color strings.

Since CSS3 string tags becoming popular, Canvas rendering becoming viable, and SVG joining the embedded workspace, color matching has become increasingly difficult to get right when you start off with `hsl`, need to transfer to an `rgb`, but then need to display in hexadecimal in order to properly display it round circle.

## Color Class

Color is similar to the `Date` object used in JavaScript today, only tailored to CSS3 Colors.

### Featureset

 * UMD for Node, AMD, and global
 * EcmaScript 5 (getters & setters)
 * Supports translating hsl to rgb to hex
 * Automatically premultiplies alpha for RGB hex values
 * Changes when a color is updated
 * Tested on Chrome, Firefox, and Safari

## Using

Using the Color operates by creating your color, or editing an existing one.

```javascript
var myColor = new Color('red');
// 255
console.log(myColor.red);
// 0
console.log(myColor.green);
// 0
console.log(myColor.blue);
```

After creating your color, you can start changing your colors around.

```javascript
// Update the dimensions
myColor.red = 200;
myColor.green = 100;
myColor.blue = 22;
```

After adjusting your color to the right values (0-255 for rgb), you can translate it back for use with the DOM.

```javascript
// rgb(200, 100, 22)
myColor.toRGBString();
```

## Contributing

If you find yourself using Color and want to make updates:

1. Use JSHint to stay within the style
1. Add unit tests for any new features
1. Test your code before committing
1. Add or update comments to represent change

## License

This project uses an MIT license. Please refer to the LICENSE file or source code doc block for reference.