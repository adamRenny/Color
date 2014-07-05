/**
 * The MIT License
 *
 * Copyright (c) 2014 Adam Ranfelt
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */
// Using UMD from https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
    /*globals define,module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.Color = factory();
    }
}(this, function factory() {
    'use strict';

    /**
     * List of possible color space types
     * Used to reference the type after parsing
     *  For pushing into toString for convenience
     *
     *  Possible list of types:
     *    HSL - Hue Saturation Lightness Colorspace name for hsl(h, s%, l%)
     *    HSLA - Hue Saturation Lightness Alpha Colorspace name for hsla(h, s%, l%, a)
     *    RGB - Red Green Blue Colorspace name for rgb(r, g, b)
     *    RGBA - Red Green Blue Alpha Colorspace name for rgba(r, g, b, a)
     *    HEX - Hexadecimal Single-Char Colorspace name for #RGB, #ARGB
     *    HEX2 - Hexadecimal Single-Char Colorspace name for #RRGGBB, #AARRGGBB
     *    LUT - Lookup Colorspace name for single-term colors
     *    UNKNOWN - Non-colorspace
     *
     * @private
     * @static
     * @for Color
     * @property TYPES
     * @types {object}
     * @final
     */
    var TYPES = {
        HSL: 'hsl',
        HSLA: 'hsla',
        RGB: 'rgb',
        RGBA: 'rgba',
        HEX2: 'hexadecimal-tuple',
        HEX: 'hexadecimal',
        LUT: 'lookup',
        UNKNOWN: 'unknown'
    };

    /**
     * Regex Calculation
     *
     * Dynamically generate all calculations
     * reusing components
     *
     * @TODO: Needs to be refactored to reduce the number of objects and references
     **/

    /**
     * Regex snippet to match a number or a number with floating point
     *
     * @private
     * @for Color
     * @property FLOAT_NUMBER
     * @type {string}
     * @final
     */
    var FLOAT_NUMBER = '\\d+(?:\\.\\d+)?';

    /**
     * Regex snippet to match any number of spaces
     *
     * @private
     * @for Color
     * @property SPACES
     * @type {string}
     * @final
     */
    var SPACES = '\\s*';

    /**
     * Regex snippet to match a hex character
     *
     * @private
     * @for Color
     * @property HEX_CHAR
     * @type {string}
     * @final
     */ 
    var HEX_CHAR = '[0-9A-Fa-f]';

    /**
     * Regex Phrases used to parse out the CSS3 colors
     * Contains reusable strings for referencing specific types of regex snippets
     *
     * @private
     * @for Color
     * @namespace PHRASES
     * @final
     */
    var PHRASES = {

        /**
         * Regex phrase for a decimal value with any number of spaces around it
         * Captures the value
         *
         * @private
         * @for PHRASES
         * @property DECIMAL
         * @type {string}
         * @final
         */
        DECIMAL: SPACES + '(' + FLOAT_NUMBER + ')' + SPACES,

        /**
         * Regex phrase for a percentage value with any number of spaces around it
         * Captures the value
         *
         * @private
         * @for PHRASES
         * @property PERCENTAGE
         * @type {string}
         * @final
         */
        PERCENTAGE: SPACES + '(' + FLOAT_NUMBER + ')\\%' + SPACES,

        /**
         * Regex phrase for a 2-character hexadecimal value with any number of spaces around it
         * Captures the value
         *
         * @private
         * @for PHRASES
         * @property HEX_TUPLE
         * @type {string}
         * @final
         */
        HEX_TUPLE: '(' + HEX_CHAR + '{2})',

        /**
         * Regex phrase for a 2-character hexadecimal value with any number of spaces around it
         * Captures the value
         *
         * @private
         * @for PHRASES
         * @property HEX_TUPLE
         * @type {string}
         * @final
         */
        HEX: '(' + HEX_CHAR + ')'
    };

    /**
     * Collection of CSS specific regex
     * Used to parse out each of the namespaces
     * Captures the values for each
     * Regex used are more forgiving than CSS (permits spaces and decimals)
     *
     * @private
     * @for Color
     * @property PARSER
     * @type {object}
     * @final
     */
    var PARSER = {
        HSL: new RegExp('^hsl\\(' + PHRASES.DECIMAL + ',' + PHRASES.PERCENTAGE + ',' + PHRASES.PERCENTAGE + '\\)$'),
        HSLA: new RegExp('^hsla\\(' + PHRASES.DECIMAL + ',' + PHRASES.PERCENTAGE + ',' + PHRASES.PERCENTAGE + ',' + PHRASES.DECIMAL + '\\)$'),
        RGB: new RegExp('^rgb\\(' + PHRASES.DECIMAL + ',' + PHRASES.DECIMAL + ',' + PHRASES.DECIMAL + '\\)$'),
        RGBA: new RegExp('^rgba\\(' + PHRASES.DECIMAL + ',' + PHRASES.DECIMAL + ',' + PHRASES.DECIMAL + ',' + PHRASES.DECIMAL + '\\)$'),
        HEX2: new RegExp('^\\#' + PHRASES.HEX_TUPLE + PHRASES.HEX_TUPLE + PHRASES.HEX_TUPLE + PHRASES.HEX_TUPLE + '?$'),
        HEX: new RegExp('^\\#' + PHRASES.HEX + PHRASES.HEX + PHRASES.HEX + PHRASES.HEX + '?$'),
        LUT: new RegExp('^([a-zA-Z]+)$')
    };

    // Create color type maps to dynamically reference the parsers
    /**
     * Map of parsers
     * Unifies the TYPE content to the regex used to parse its language
     *
     * @private
     * @for Color
     * @property PARSER_MAP
     * @type {object}
     * @final
     */
    var PARSER_MAP = {};
    PARSER_MAP[TYPES.HSL] = PARSER.HSL;
    PARSER_MAP[TYPES.HSLA] = PARSER.HSLA;
    PARSER_MAP[TYPES.RGB] = PARSER.RGB;
    PARSER_MAP[TYPES.RGBA] = PARSER.RGBA;
    PARSER_MAP[TYPES.HEX] = PARSER.HEX;
    PARSER_MAP[TYPES.HEX2] = PARSER.HEX2;
    PARSER_MAP[TYPES.LUT] = PARSER.LUT;

    /**
     * Map of toString functions
     * Unifies the TYPE content to the respective toString method
     * Used to render out the CSS string
     *
     * @private
     * @for Color
     * @property STRING_MAP
     * @type {object}
     * @final
     */
    var STRING_MAP = {};
    STRING_MAP[TYPES.HSL] = toHSLString;
    STRING_MAP[TYPES.HSLA] = toHSLAString;
    STRING_MAP[TYPES.RGB] = toRGBString;
    STRING_MAP[TYPES.RGBA] = toRGBAString;
    STRING_MAP[TYPES.HEX] = toHexString;
    STRING_MAP[TYPES.HEX2] = toHexString;

    /**
     * Ordered list of REGEX and TYPE Pairs
     * Used to designate the parse order when a string is hydrated
     *
     * Parse objects come with a REGEX and TYPE
     *
     * Order is:
     *  HSL
     *  HSLA
     *  RGB
     *  RGBA
     *  HEX-Tuple
     *  HEX
     *  Color
     *
     * @private
     * @for Color
     * @property PARSER_LIST
     * @type {object[]}
     * @final
     */
    var PARSER_LIST = [
        {
            REGEX: PARSER.HSL,
            TYPE: TYPES.HSL
        },
        {
            REGEX: PARSER.HSLA,
            TYPE: TYPES.HSLA
        },
        {
            REGEX: PARSER.RGB,
            TYPE: TYPES.RGB
        },
        {
            REGEX: PARSER.RGBA,
            TYPE: TYPES.RGBA
        },
        {
            REGEX: PARSER.HEX2,
            TYPE: TYPES.HEX2
        },
        {
            REGEX: PARSER.HEX,
            TYPE: TYPES.HEX
        },
        {
            REGEX: PARSER.LUT,
            TYPE: TYPES.LUT
        }
    ];

    /**
     * List of color strings from the CSS list
     * Used to verify whether a color is available
     * @see Extended Color Keywords http://www.w3.org/TR/css3-color/#html4
     *
     * @TODO: Refactor to merge with the COLOR_MAP
     *
     * @private
     * @for Color
     * @property COLOR_LIST
     * @type {string[]}
     * @final
     */
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

    /**
     * Map of color strings from the CSS list to rgb values
     * Used to translate a color to an rgb value
     *
     * @TODO: Refactor to merge with the COLOR_LIST
     *
     * @private
     * @for Color
     * @property COLOR_MAP
     * @type {object}
     * @final
     */
    var COLOR_MAP = {
        aliceblue: 'rgb(240, 248, 255)',
        antiquewhite: 'rgb(250, 235, 215)',
        aqua: 'rgb(0, 255, 255)',
        aquamarine: 'rgb(127, 255, 212)',
        azure: 'rgb(240, 255, 255)',
        beige: 'rgb(245, 245, 220)',
        bisque: 'rgb(255, 228, 196)',
        black: 'rgb(0, 0, 0)',
        blanchedalmond: 'rgb(255, 235, 205)',
        blue: 'rgb(0, 0, 255)',
        blueviolet: 'rgb(138, 43, 226)',
        brown: 'rgb(165, 42, 42)',
        burlywood: 'rgb(222, 184, 135)',
        cadetblue: 'rgb(95, 158, 160)',
        chartreuse: 'rgb(127, 255, 0)',
        chocolate: 'rgb(210, 105, 30)',
        coral: 'rgb(255, 127, 80)',
        cornflowerblue: 'rgb(100, 149, 237)',
        cornsilk: 'rgb(255, 248, 220)',
        crimson: 'rgb(220, 20, 60)',
        cyan: 'rgb(0, 255, 255)',
        darkblue: 'rgb(0, 0, 139)',
        darkcyan: 'rgb(0, 139, 139)',
        darkgoldenrod: 'rgb(184, 134, 11)',
        darkgray: 'rgb(169, 169, 169)',
        darkgreen: 'rgb(0, 100, 0)',
        darkkhaki: 'rgb(189, 183, 107)',
        darkmagenta: 'rgb(139, 0, 139)',
        darkolivegreen: 'rgb(85, 107, 47)',
        darkorange: 'rgb(255, 140, 0)',
        darkorchid: 'rgb(153, 50, 204)',
        darkred: 'rgb(139, 0, 0)',
        darksalmon: 'rgb(233, 150, 122)',
        darkseagreen: 'rgb(143, 188, 143)',
        darkslateblue: 'rgb(72, 61, 139)',
        darkslategray: 'rgb(47, 79, 79)',
        darkturquoise: 'rgb(0, 206, 209)',
        darkviolet: 'rgb(148, 0, 211)',
        deeppink: 'rgb(255, 20, 147)',
        deepskyblue: 'rgb(0, 191, 255)',
        dimgray: 'rgb(105, 105, 105)',
        dodgerblue: 'rgb(30, 144, 255)',
        firebrick: 'rgb(178, 34, 34)',
        floralwhite: 'rgb(255, 250, 240)',
        forestgreen: 'rgb(34, 139, 34)',
        fuchsia: 'rgb(255, 0, 255)',
        gainsboro: 'rgb(220, 220, 220)',
        ghostwhite: 'rgb(248, 248, 255)',
        gold: 'rgb(255, 215, 0)',
        goldenrod: 'rgb(218, 165, 32)',
        gray: 'rgb(128, 128, 128)',
        green: 'rgb(0, 128, 0)',
        greenyellow: 'rgb(173, 255, 47)',
        honeydew: 'rgb(240, 255, 240)',
        hotpink: 'rgb(255, 105, 180)',
        indianred: 'rgb(205, 92, 92)',
        indigo: 'rgb(75, 0, 130)',
        ivory: 'rgb(255, 255, 240)',
        khaki: 'rgb(240, 230, 140)',
        lavender: 'rgb(230, 230, 250)',
        lavenderblush: 'rgb(255, 240, 245)',
        lawngreen: 'rgb(124, 252, 0)',
        lemonchiffon: 'rgb(255, 250, 205)',
        lightblue: 'rgb(173, 216, 230)',
        lightcoral: 'rgb(240, 128, 128)',
        lightcyan: 'rgb(224, 255, 255)',
        lightgoldenrodyellow: 'rgb(250, 250, 210)',
        lightgray: 'rgb(211, 211, 211)',
        lightgreen: 'rgb(144, 238, 144)',
        lightpink: 'rgb(255, 182, 193)',
        lightsalmon: 'rgb(255, 160, 122)',
        lightseagreen: 'rgb(32, 178, 170)',
        lightskyblue: 'rgb(135, 206, 250)',
        lightslategray: 'rgb(119, 136, 153)',
        lightsteelblue: 'rgb(176, 196, 222)',
        lightyellow: 'rgb(255, 255, 224)',
        lime: 'rgb(0, 255, 0)',
        limegreen: 'rgb(50, 205, 50)',
        linen: 'rgb(250, 240, 230)',
        magenta: 'rgb(255, 0, 255)',
        maroon: 'rgb(128, 0, 0)',
        mediumaquamarine: 'rgb(102, 205, 170)',
        mediumblue: 'rgb(0, 0, 205)',
        mediumorchid: 'rgb(186, 85, 211)',
        mediumpurple: 'rgb(147, 112, 219)',
        mediumseagreen: 'rgb(60, 179, 113)',
        mediumslateblue: 'rgb(123, 104, 238)',
        mediumspringgreen: 'rgb(0, 250, 154)',
        mediumturquoise: 'rgb(72, 209, 204)',
        mediumvioletred: 'rgb(199, 21, 133)',
        midnightblue: 'rgb(25, 25, 112)',
        mintcream: 'rgb(245, 255, 250)',
        mistyrose: 'rgb(255, 228, 225)',
        moccasin: 'rgb(255, 228, 181)',
        navajowhite: 'rgb(255, 222, 173)',
        navy: 'rgb(0, 0, 128)',
        oldlace: 'rgb(253, 245, 230)',
        olive: 'rgb(128, 128, 0)',
        olivedrab: 'rgb(107, 142, 35)',
        orange: 'rgb(255, 165, 0)',
        orangered: 'rgb(255, 69, 0)',
        orchid: 'rgb(218, 112, 214)',
        palegoldenrod: 'rgb(238, 232, 170)',
        palegreen: 'rgb(152, 251, 152)',
        paleturquoise: 'rgb(175, 238, 238)',
        palevioletred: 'rgb(219, 112, 147)',
        papayawhip: 'rgb(255, 239, 213)',
        peachpuff: 'rgb(255, 218, 185)',
        peru: 'rgb(205, 133, 63)',
        pink: 'rgb(255, 192, 203)',
        plum: 'rgb(221, 160, 221)',
        powderblue: 'rgb(176, 224, 230)',
        purple: 'rgb(128, 0, 128)',
        red: 'rgb(255, 0, 0)',
        rosybrown: 'rgb(188, 143, 143)',
        royalblue: 'rgb(65, 105, 225)',
        saddlebrown: 'rgb(139, 69, 19)',
        salmon: 'rgb(250, 128, 114)',
        sandybrown: 'rgb(244, 164, 96)',
        seagreen: 'rgb(46, 139, 87)',
        seashell: 'rgb(255, 245, 238)',
        sienna: 'rgb(160, 82, 45)',
        silver: 'rgb(192, 192, 192)',
        skyblue: 'rgb(135, 206, 235)',
        slateblue: 'rgb(106, 90, 205)',
        slategray: 'rgb(112, 128, 144)',
        snow: 'rgb(255, 250, 250)',
        springgreen: 'rgb(0, 255, 127)',
        steelblue: 'rgb(70, 130, 180)',
        tan: 'rgb(210, 180, 140)',
        teal: 'rgb(0, 128, 128)',
        thistle: 'rgb(216, 191, 216)',
        tomato: 'rgb(255, 99, 71)',
        turquoise: 'rgb(64, 224, 208)',
        violet: 'rgb(238, 130, 238)',
        wheat: 'rgb(245, 222, 179)',
        white: 'rgb(255, 255, 255)',
        whitesmoke: 'rgb(245, 245, 245)',
        yellow: 'rgb(255, 255, 0)',
        yellowgreen: 'rgb(154, 205, 50)'
    };

    /**
     * Local private read method
     * Maps a colorspace type to a regex-match reading function
     *
     * @private
     * @for Color
     * @property READ_MAP
     * @type {object}
     * @final
     */
    var READ_MAP = {};
    READ_MAP[TYPES.HSL] = readFromHSL;
    READ_MAP[TYPES.HSLA] = readFromHSL;
    READ_MAP[TYPES.RGB] = readFromRGB;
    READ_MAP[TYPES.RGBA] = readFromRGB;
    READ_MAP[TYPES.HEX] = readFromHex;
    READ_MAP[TYPES.HEX2] = readFromHex;
    READ_MAP[TYPES.LUT] = readFromColor;

    /**
     * Clamp method similar to HLSL clamp method
     * Confines a value to be within the minimum and maximum
     * Does not handle values outside of the min/max
     *
     * @private
     * @for Color
     * @method clamp
     * @param {number} value Value to clamp
     * @param {number} min Minimum value to clamp to
     * @param {number} max Maximum value to clamp to
     * @return {number}
     */
    function clamp(value, min, max) {
        if (value < min) {
            value = min;
        }

        if (value > max) {
            value = max;
        }

        return value;
    }

    /**
     * Check for a variable to determine whether it is a valid number
     * Will return true if the value is a number, and not NaN
     *
     * @private
     * @for Color
     * @method isValidNumber
     * @param {*} value Value to check whether it is a number
     * @return {boolean}
     */
    function isValidNumber(value) {
        return !isNaN(value) && typeof value !== 'boolean';
    }

    /**
     * Hydration method
     * Used to direct the parsing logic into the proper reading method
     * Uses the READ_MAP, and REGEX to transfer the match to the appropriate match method
     *
     * @throws TypeError if the color string is identified as valid, but not aactually valid color string
     * Should never occur
     *
     * @for Color
     * @method hydrate
     * @param {string} str Color string to hydrate with
     */
    function hydrate(str) {
        var type = parseType(str);
        if (type === TYPES.UNKNOWN) {
            return;
        }

        var match = str.match(PARSER_MAP[type]);
        if (match === null) {
            throw new TypeError('Color string unable to be parsed: ' + str);
        }

        /*jshint validthis:true */
        READ_MAP[type].call(this, match);
        /*jshint validthis:false */
    }

    /**
     * Validation method to clamp and push content of the rgb and hsl properties
     * Called only after read to make sure that all content is properly processed
     *
     * @private
     * @for Color
     * @method validate
     */
    function validate() {
        /*jshint validthis:true */
        this._red = clamp(this._red, 0, 255);
        this._green = clamp(this._green, 0, 255);
        this._blue = clamp(this._blue, 0, 255);
        this._alpha = clamp(this._alpha, 0, 1);

        if (this._hue < 0) {
            this._hue = 0;
        }

        this._hue = this._hue % 360;
        this._saturation = clamp(this._saturation, 0, 1);
        this._lightness = clamp(this._lightness, 0, 1);
        /*jshint validthis:false */
    }

    /**
     * Reads the values from a rgb or rgba string
     * Parses out a match with 3 or 4 items in it
     *
     * @private
     * @for Color
     * @method readFromRGB
     * @param {string[]} match RegExp matched from rgb or rgba
     */
    function readFromRGB(match) {
        var red = match[1];
        var green = match[2];
        var blue = match[3];
        var alpha = match[4];

        if (typeof alpha === 'undefined') {
            alpha = 1;
        }

        red = parseFloat(red);
        green = parseFloat(green);
        blue = parseFloat(blue);
        alpha = parseFloat(alpha);

        /*jshint validthis:true */
        this._red = red;
        this._green = green;
        this._blue = blue;
        this._alpha = alpha;
        validate.call(this);
        this.calcHSLFromRGB();
        /*jshint validthis:false */
    }

    /**
     * Reads the values from a hsl or hsla string
     * Parses out a match with 3 or 4 items in it
     *
     * @private
     * @for Color
     * @method readFromHSL
     * @param {string[]} match RegExp matched from hsl or hsla
     */
    function readFromHSL(match) {
        var hue = match[1];
        var saturation = match[2];
        var lightness = match[3];
        var alpha = match[4];

        if (typeof alpha === 'undefined') {
            alpha = 1;
        }

        hue = parseFloat(hue);
        saturation = parseFloat(saturation) / 100;
        lightness = parseFloat(lightness) / 100;
        alpha = parseFloat(alpha);

        /*jshint validthis:true */
        this._hue = hue;
        this._saturation = saturation;
        this._lightness = lightness;
        this._alpha = alpha;

        // Validate the content
        validate.call(this);

        // Calculate the HSL
        this.calcRGBFromHSL();
        /*jshint validthis:false */
    }

    /**
     * Reads the values from a hex string
     * Parses out a match with 3 or 4 items in it
     * Uses the same method for both tuples and non-tuples
     *
     * @private
     * @for Color
     * @method readFromHex
     * @param {string[]} match RegExp matched from a hex string
     */
    function readFromHex(match) {
        // Double up any singular hex values
        function prepareTuple(tuple) {
            if (tuple.length === 1) {
                return tuple + tuple;
            }

            return tuple;
        }

        // RGBx for most cases, if 4, then ARGB
        var red = match[1];
        var green = match[2];
        var blue = match[3];
        var alpha = match[4];

        // If alpha is available, it is the first entry
        if (typeof alpha !== 'undefined') {
            alpha = match[1];
            red = match[2];
            green = match[3];
            blue = match[4];
        } else {
            alpha = 'ff';
        }

        // Double up any singular values
        red = prepareTuple(red);
        green = prepareTuple(green);
        blue = prepareTuple(blue);
        alpha = prepareTuple(alpha);

        /*jshint validthis:true */
        // Convert over
        this._red = parseInt(red, 16);
        this._green = parseInt(green, 16);
        this._blue = parseInt(blue, 16);
        this._alpha = parseInt(alpha, 16) / 255;

        // Make sure all values are valid
        validate.call(this);

        // Calculate the HSL value
        this.calcHSLFromRGB();
        /*jshint validthis:false */
    }

    /**
     * Reads out a color from the color list and redirects to rgb parser
     *
     * @private
     * @for Color
     * @method readFromColor
     * @param {string[]} match RegExp matched from a color
     */
    function readFromColor(match) {
        var rgbCode = COLOR_MAP[match[1]];

        /*jshint validthis:true */
        readFromRGB.call(this, rgbCode.match(PARSER.RGB));
        /*jshint validthis:false */
    }

    /**
     * Conversion logic to translate the RGB values to HSL values
     * Performed whenever red, green, or blue is change, or when hydrated
     *
     * @for Color
     * @method calcHSLFromRGB
     */
    function convertRGBToHSL() {
        /*jshint validthis:true */
        var red = this._red / 255;
        var green = this._green / 255;
        var blue = this._blue / 255;
        /*jshint validthis:false */

        var min = Math.min(red, green, blue);
        var max = Math.max(red, green, blue);

        var dist = max - min;
        var lightness = (min + max) / 2;

        var saturation = 0;
        var hue = 0;

        // Check for if all rgb are the same
        // Which would mean saturation is 0
        if (min !== max) {
            if (lightness < 0.5) {
                saturation = dist / (max + min);
            } else {
                saturation = dist / (2 - max - min);
            }

            // Calculate the distance between the red and the max
            var distRed = (((max - red) / 6) + (dist / 2)) / dist;
            var distGreen = (((max - green) / 6) + (dist / 2)) / dist;
            var distBlue = (((max - blue) / 6) + (dist / 2)) / dist;

            // Calculate the hue from the max
            if (max === red) {
                hue = distBlue - distGreen;
            } else if (max === green) {
                hue = (1/3) + distRed - distBlue;
            } else if (max === blue) {
                hue = (2/3) + distGreen - distRed;
            }

            if (hue < 0) {
                hue = hue + 1;
            }

            if (hue > 1) {
                hue = hue - 1;
            }

            // Transfer the hue to the 0-360 space
            hue = hue * 360;
        }

        /*jshint validthis:true */
        this._hue = hue;
        this._saturation = saturation;
        this._lightness = lightness;
        /*jshint validthis:false */
    }

    /**
     * Conversion logic to translate the HSL values to RGB values
     * Performed whenever hue, saturation, or lightness is change, or when hydrated
     *
     * @for Color
     * @method calcRGBFromHSL
     */
    function convertHSLToRGB() {
        /*jshint validthis:true */
        var hue = this._hue / 360;
        var saturation = this._saturation;
        var lightness = this._lightness;
        /*jshint validthis:false */

        var red = 0;
        var green = 0;
        var blue = 0;

        // If there's no saturation, its completely based off of lightness
        if (saturation === 0) {
            red = lightness;
            green = lightness;
            blue = lightness;
        } else {
            var val1;
            var val2;

            if (lightness < 0.5) {
                val2 = lightness * (1 + saturation);
            } else {
                val2 = (lightness + saturation) - (saturation * lightness);
            }

            val1 = 2 * lightness - val2;

            red = transformHueIntoColor(val1, val2, hue + (1/3));
            green = transformHueIntoColor(val1, val2, hue);
            blue = transformHueIntoColor(val1, val2, hue - (1/3));
        }

        /*jshint validthis:true */
        this._red = Math.round(red * 255);
        this._green = Math.round(green * 255);
        this._blue = Math.round(blue * 255);
        /*jshint validthis:false */
    }

    /**
     * Helper Method for transforming hue
     *
     * @private
     * @for Color
     * @method transformHueIntoColor
     * @param {number} val1 SL calculation value
     * @param {number} val2 SL calclation value
     * @param {number} hueVal Hue based value to calculation against
     * @return {number} transformed color value
     */
    function transformHueIntoColor(val1, val2, hueVal) {
        if (hueVal < 0) {
            hueVal = hueVal + 1;
        }

        if (hueVal > 1) {
            hueVal = hueVal - 1;
        }

        if ((6 * hueVal) < 1) {
            return val1 + (val2 - val1) * 6 * hueVal;
        }

        if ((2 * hueVal) < 1) {
            return val2;
        }

        if ((3 * hueVal) < 2) {
            return val1 + (val2 - val1) * ((2/3) - hueVal) * 6;
        }

        return val1;
    }

    /**
     * Representative color object
     * CSS3 Color object to pull in a color string, and provides an API
     * to transform that value into its RGB and HSL forms
     *
     * Supports:
     *  rgb
     *  rgba
     *  hsl
     *  hsla
     *  #RGB
     *  #ARGB
     *  #RRGGBB
     *  #AARRGGBB
     *  colorstring
     *
     * Provides an API to be able to transfer readily across different colorspaces
     *
     * @class Color
     * @constructor
     * @param {string} str CSS3 Color String
     */
    function Color(str) {
        if (typeof str !== 'string') {
            this.calcHSLFromRGB();
            return;
        }

        /*jshint validthis:true */
        this.hydrate(str);
    }

    /**
     * Parses a type from the provided string
     * Determines the type from the provided TYPES list
     *
     * Provides the type based on the string
     * Performs the parse using regex, via sequential regex
     *
     * @for Color
     * @method parseType
     * @static
     * @param {string} str String to parse and determine type
     * @return {string}
     */
    function parseType(str) {
        str = str.trim();
        var i = 0;
        var length = PARSER_LIST.length;
        var type = TYPES.UNKNOWN;
        for (i = 0; i < length; i++) {
            if (PARSER_LIST[i].REGEX.test(str)) {
                type = PARSER_LIST[i].TYPE;
                break;
            }
        }

        // Confirm that the value provided exists within the lookup library
        if (type === TYPES.LUT && COLOR_LIST.indexOf(str) === -1) {
            type = TYPES.UNKNOWN;
        }

        return type;
    }

    /**
     * Convenience method to transform a color back into a color string
     * Will default to hex if no type is given
     *
     * Doesn't sustain the whitespace or formatting of the string
     *
     * Uses the list of types to map to the STRING_MAP methods
     *
     * @for Color
     * @method toString
     * @param {string} type toString
     * @return {string}
     */
    function toString(type) {
        /*jshint validthis:true */
        if (typeof type !== 'string') {
            return this.toHexString();
        }

        var mappedStringMethod = STRING_MAP[type];
        if (typeof mappedStringMethod === 'undefined') {
            mappedStringMethod = toHexString;
        }

        return mappedStringMethod.call(this);
        /*jshint validthis:false */
    }

    /**
     * Conversion function to translate a color value in 255
     * to a string value, will always pad that number to 2 digits
     *
     * @for Color
     * @method toHexTuple
     * @param {number} value Value to translate into hexadecimal
     * @return {string}
     */
    function toHexTuple(value) {
        var str = value.toString(16);
        while (str.length < 2) {
            str = '0' + str;
        }

        return str;
    }

    /**
     * Converts the color object into a hex string
     * Will use an 8 digit string if told not to premultiply alpha
     * If told to premultiply alpha, will use a 6 digit string
     *
     * Does not premultiply alpha by default
     *
     * @for Color
     * @method toHexString
     * @param {boolean} shouldPremultiplyAlpha Flag to determine if it should premultiply alpha
     * @return {string}
     */
    function toHexString(shouldPremultiplyAlpha) {
        /*jshint validthis:true */
        var red = this._red;
        var green = this._green;
        var blue = this._blue;
        var alpha = this._alpha;
        /*jshint validthis:false */

        var str;

        if (shouldPremultiplyAlpha) {
            red = Math.round(red * alpha);
            green = Math.round(green * alpha);
            blue = Math.round(blue * alpha);

            str = toHexTuple(red) + toHexTuple(green) + toHexTuple(blue);
        } else {
            str = toHexTuple(Math.round(alpha * 255)) + toHexTuple(Math.round(red)) + toHexTuple(Math.round(green)) + toHexTuple(Math.round(blue));
        }

        return '#' + str.toUpperCase();
    }

    /**
     * Converts the color object into a rgb string
     * Defaults to rounding instead of allowing a floating point
     * Premultiplies the rgb when alpha is provided
     *
     * @for Color
     * @method toRGBString
     * @param {boolean} shouldAllowFloatingPoint Flag to determine whether to allow the floating point
     * @return {string}
     */
    function toRGBString(shouldAllowFloatingPoint) {
        /*jshint validthis:true */
        var alpha = this._alpha;
        var red = this._red * alpha;
        var green = this._green * alpha;
        var blue = this._blue * alpha;
        /*jshint validthis:false */

        if (!shouldAllowFloatingPoint) {
            red = Math.round(red);
            green = Math.round(green);
            blue = Math.round(blue);
        }

        return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    }

    /**
     * Converts the color object into a rgba string
     * Defaults to rounding instead of allowing a floating point
     *
     * @for Color
     * @method toRGBAString
     * @param {boolean} shouldAllowFloatingPoint Flag to determine whether to allow the floating point
     * @return {string}
     */
    function toRGBAString(shouldAllowFloatingPoint) {
        /*jshint validthis:true */
        var alpha = this._alpha;
        var red = this._red;
        var green = this._green;
        var blue = this._blue;
        /*jshint validthis:false */

        if (!shouldAllowFloatingPoint) {
            red = Math.round(red);
            green = Math.round(green);
            blue = Math.round(blue);
        }

        return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
    }

    /**
     * Converts the color object into a hsl string
     * Defaults to rounding instead of allowing a floating point
     * Does not premultiply the alpha
     *
     * @for Color
     * @method toHSLString
     * @param {boolean} shouldAllowFloatingPoint Flag to determine whether to allow the floating point
     * @return {string}
     */
    function toHSLString(shouldAllowFloatingPoint) {
        /*jshint validthis:true */
        var hue = this._hue;
        var saturation = this._saturation * 100;
        var lightness = this._lightness * 100;
        /*jshint validthis:false */

        if (!shouldAllowFloatingPoint) {
            hue = Math.round(hue);
            saturation = Math.round(saturation);
            lightness = Math.round(lightness);
        }

        return 'hsl(' + hue + ', ' + saturation + '%, ' + lightness + '%)';
    }

    /**
     * Converts the color object into a hsla string
     * Defaults to rounding instead of allowing a floating point
     * Does not premultiply the alpha
     *
     * @for Color
     * @method toHSLAString
     * @param {boolean} shouldAllowFloatingPoint Flag to determine whether to allow the floating point
     * @return {string}
     */
    function toHSLAString(shouldAllowFloatingPoint) {
        /*jshint validthis:true */
        var alpha = this._alpha;
        var hue = this._hue;
        var saturation = this._saturation * 100;
        var lightness = this._lightness * 100;
        /*jshint validthis:false */

        if (!shouldAllowFloatingPoint) {
            hue = Math.round(hue);
            saturation = Math.round(saturation);
            lightness = Math.round(lightness);
        }

        return 'hsla(' + hue + ', ' + saturation + '%, ' + lightness + '%, ' + alpha + ')';
    }

    Color.prototype = {
        constructor: Color,

        _red: 0,
        _green: 0,
        _blue: 0,
        _alpha: 1,

        _hue: 0,
        _saturation: 0,
        _lightness: 0,

        /**
         * Alpha property that is constrained to 0-1 range
         *
         * @for Color
         * @property alpha
         * @type {number}
         */
        get alpha() {
            return this._alpha;
        },

        set alpha(value) {
            if (!isValidNumber(value)) {
                value = 0;
            }

            value = clamp(parseFloat(value), 0, 1);

            this._alpha = value;
        },

        /**
         * Red property that is constrained to 0-255 range
         * Recalculates HSL after change
         *
         * @for Color
         * @property red
         * @type {number}
         */
        get red() {
            return this._red;
        },

        set red(value) {
            if (!isValidNumber(value)) {
                value = 0;
            }

            value = clamp(parseFloat(value), 0, 255);

            this._red = value;
            this.calcHSLFromRGB();
        },

        /**
         * Green property that is constrained to 0-255 range
         * Recalculates HSL after change
         *
         * @for Color
         * @property green
         * @type {number}
         */
        get green() {
            return this._green;
        },

        set green(value) {
            if (!isValidNumber(value)) {
                value = 0;
            }

            value = clamp(parseFloat(value), 0, 255);

            this._green = value;
            this.calcHSLFromRGB();
        },

        /**
         * Blue property that is constrained to 0-255 range
         * Recalculates HSL after change
         *
         * @for Color
         * @property blue
         * @type {number}
         */
        get blue() {
            return this._blue;
        },

        set blue(value) {
            if (!isValidNumber(value)) {
                value = 0;
            }

            value = clamp(parseFloat(value), 0, 255);

            this._blue = value;
            this.calcHSLFromRGB();
        },

        /**
         * Hue property that is constrained to 0-360 range
         * Loops around after the 360
         * Recalculates RGB after change
         *
         * @for Color
         * @property hue
         * @type {number}
         */
        get hue() {
            return this._hue;
        },

        set hue(value) {
            if (!isValidNumber(value)) {
                value = 0;
            }

            if (value < 0) {
                value = 0;
            }

            value = parseFloat(value) % 360;

            this._hue = value;
            this.calcRGBFromHSL();
        },

        /**
         * Saturation property that is constrained to 0-1 range
         * Recalculates RGB after change
         *
         * @for Color
         * @property saturation
         * @type {number}
         */
        get saturation() {
            return this._saturation;
        },

        set saturation(value) {
            if (!isValidNumber(value)) {
                value = 0;
            }

            value = clamp(parseFloat(value), 0, 1);

            this._saturation = value;
            this.calcRGBFromHSL();
        },

        /**
         * Lightness property that is constrained to 0-1 range
         * Recalculates RGB after change
         *
         * @for Color
         * @property lightness
         * @type {number}
         */
        get lightness() {
            return this._lightness;
        },

        set lightness(value) {
            if (!isValidNumber(value)) {
                value = 0;
            }

            value = clamp(parseFloat(value), 0, 1);

            this._lightness = value;
            this.calcRGBFromHSL();
        },

        hydrate: hydrate,

        calcHSLFromRGB: convertRGBToHSL,
        calcRGBFromHSL: convertHSLToRGB,

        toHexString: toHexString,
        toRGBString: toRGBString,
        toRGBAString: toRGBAString,
        toHSLString: toHSLString,
        toHSLAString: toHSLAString,
        toString: toString
    };

    Color.parseType = parseType;
    Color.TYPES = TYPES;

    return Color;
}));