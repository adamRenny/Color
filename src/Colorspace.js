window.cs = (function() {
    'use strict';

    var TYPES = {
        HSL: 'hsl',
        HSLA: 'hsla',
        RGB: 'rgb',
        RGBA: 'rgba',
        HEX: 'hexadecimal',
        LUT: 'lookup',
        UNKNOWN: 'unknown'
    };

    var FLOAT_NUMBER = '\\d+(?:\\.\\d+)?';
    var SPACES = '\\s*';
    var HEX_CHAR = '[0-9A-Fa-f]';

    var PHRASES = {
        DECIMAL: SPACES + '(' + FLOAT_NUMBER + ')' + SPACES,
        PERCENTAGE: SPACES + '(' + FLOAT_NUMBER + ')\\%' + SPACES,
        HEX_TUPLE: '(' + HEX_CHAR + '{2})',
        HEX: '(' + HEX_CHAR + ')'
    };

    var PARSER = {
        HSL: new RegExp('^hsl\\(' + PHRASES.DECIMAL + ',' + PHRASES.PERCENTAGE + ',' + PHRASES.PERCENTAGE + '\\)$'),
        HSLA: new RegExp('^hsla\\(' + PHRASES.DECIMAL + ',' + PHRASES.PERCENTAGE + ',' + PHRASES.PERCENTAGE + ',' + PHRASES.DECIMAL + '\\)$'),
        RGB: new RegExp('^rgb\\(' + PHRASES.DECIMAL + ',' + PHRASES.DECIMAL + ',' + PHRASES.DECIMAL + '\\)$'),
        RGBA: new RegExp('^rgba\\(' + PHRASES.DECIMAL + ',' + PHRASES.DECIMAL + ',' + PHRASES.DECIMAL + ',' + PHRASES.DECIMAL + '\\)$'),
        HEX: new RegExp('^\\#(?:' + PHRASES.HEX_TUPLE + '{3,4}|' + PHRASES.HEX + '{3})$'),
        LUT: new RegExp('^([a-zA-Z]+)$')
    };

    var COLOR_LIST = [
        'aliceblue',
        'antiquewhite',
        'aqua',
        'aquamarine',
        'azure',
        'beige',
        'bisque',
        'black',
        'blanchedalmond',
        'blue',
        'blueviolet',
        'brown',
        'burlywood',
        'cadetblue',
        'chartreuse',
        'chocolate',
        'coral',
        'cornflowerblue',
        'cornsilk',
        'crimson',
        'cyan',
        'darkblue',
        'darkcyan',
        'darkgoldenrod',
        'darkgray',
        'darkgreen',
        'darkkhaki',
        'darkmagenta',
        'darkolivegreen',
        'darkorange',
        'darkorchid',
        'darkred',
        'darksalmon',
        'darkseagreen',
        'darkslateblue',
        'darkslategray',
        'darkturquoise',
        'darkviolet',
        'deeppink',
        'deepskyblue',
        'dimgray',
        'dodgerblue',
        'firebrick',
        'floralwhite',
        'forestgreen',
        'fuchsia',
        'gainsboro',
        'ghostwhite',
        'gold',
        'goldenrod',
        'gray',
        'green',
        'greenyellow',
        'honeydew',
        'hotpink',
        'indianred',
        'indigo',
        'ivory',
        'khaki',
        'lavender',
        'lavenderblush',
        'lawngreen',
        'lemonchiffon',
        'lightblue',
        'lightcoral',
        'lightcyan',
        'lightgoldenrodyellow',
        'lightgray',
        'lightgreen',
        'lightpink',
        'lightsalmon',
        'lightseagreen',
        'lightskyblue',
        'lightslategray',
        'lightsteelblue',
        'lightyellow',
        'lime',
        'limegreen',
        'linen',
        'magenta',
        'maroon',
        'mediumaquamarine',
        'mediumblue',
        'mediumorchid',
        'mediumpurple',
        'mediumseagreen',
        'mediumslateblue',
        'mediumspringgreen',
        'mediumturquoise',
        'mediumvioletred',
        'midnightblue',
        'mintcream',
        'mistyrose',
        'moccasin',
        'navajowhite',
        'navy',
        'oldlace',
        'olive',
        'olivedrab',
        'orange',
        'orangered',
        'orchid',
        'palegoldenrod',
        'palegreen',
        'paleturquoise',
        'palevioletred',
        'papayawhip',
        'peachpuff',
        'peru',
        'pink',
        'plum',
        'powderblue',
        'purple',
        'red',
        'rosybrown',
        'royalblue',
        'saddlebrown',
        'salmon',
        'sandybrown',
        'seagreen',
        'seashell',
        'sienna',
        'silver',
        'skyblue',
        'slateblue',
        'slategray',
        'snow',
        'springgreen',
        'steelblue',
        'tan',
        'teal',
        'thistle',
        'tomato',
        'turquoise',
        'violet',
        'wheat',
        'white',
        'whitesmoke',
        'yellow',
        'yellowgreen'
    ];

    function Colorspace() {

    }

    function hexToHSL(str) {

    }

    function parseType(str) {
        str = str.trim();
        if (PARSER.HSL.test(str)) {
            return TYPES.HSL;
        }

        if (PARSER.HSLA.test(str)) {
            return TYPES.HSLA;
        }

        if (PARSER.RGB.test(str)) {
            return TYPES.RGB;
        }

        if (PARSER.RGBA.test(str)) {
            return TYPES.RGBA;
        }

        if (PARSER.HEX.test(str)) {
            return TYPES.HEX;
        }

        if (PARSER.LUT.test(str) && COLOR_LIST.indexOf(str) !== -1) {
            return TYPES.LUT;
        }

        return TYPES.UNKNOWN;
    }

    Colorspace.prototype = {
        constructor: Colorspace,

        TYPES: TYPES,

        hexToHSL: hexToHSL,
        parseType: parseType
    };

    return new Colorspace();
}());