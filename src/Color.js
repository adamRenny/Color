window.Color = (function() {
    'use strict';

    // Collection of color types
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

    // Create the REGEX phrases
    var FLOAT_NUMBER = '\\d+(?:\\.\\d+)?';
    var SPACES = '\\s*';
    var HEX_CHAR = '[0-9A-Fa-f]';

    var PHRASES = {
        DECIMAL: SPACES + '(' + FLOAT_NUMBER + ')' + SPACES,
        PERCENTAGE: SPACES + '(' + FLOAT_NUMBER + ')\\%' + SPACES,
        HEX_TUPLE: '(' + HEX_CHAR + '{2})',
        HEX: '(' + HEX_CHAR + ')'
    };

    // List of regex to parse colors with
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
    var PARSER_MAP = {};
    PARSER_MAP[TYPES.HSL] = PARSER.HSL;
    PARSER_MAP[TYPES.HSLA] = PARSER.HSLA;
    PARSER_MAP[TYPES.RGB] = PARSER.RGB;
    PARSER_MAP[TYPES.RGBA] = PARSER.RGBA;
    PARSER_MAP[TYPES.HEX] = PARSER.HEX;
    PARSER_MAP[TYPES.HEX2] = PARSER.HEX2;
    PARSER_MAP[TYPES.LUT] = PARSER.LUT;

    // Use a parser list to control order of operations
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

    // Use a color list to incorporate the colors
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

    var READ_MAP = {};
    READ_MAP[TYPES.HSL] = readFromHSL;
    READ_MAP[TYPES.HSLA] = readFromHSL;
    READ_MAP[TYPES.RGB] = readFromRGB;
    READ_MAP[TYPES.RGBA] = readFromRGB;
    READ_MAP[TYPES.HEX] = readFromHex;
    READ_MAP[TYPES.HEX2] = readFromHex;
    READ_MAP[TYPES.LUT] = readFromColor;

    function clamp(value, min, max) {
        if (value < min) {
            value = min;
        }

        if (value > max) {
            value = max;
        }

        return value;
    }

    function isValidNumber(value) {
        return !isNaN(value) && typeof value !== 'boolean';
    }

    function hydrate(str) {
        var type = parseType(str);
        if (type === TYPES.UNKNOWN) {
            return;
        }

        var match = str.match(PARSER_MAP[type]);
        if (match === null) {
            throw new TypeError('Color string unable to be parsed: ' + str);
        }

        READ_MAP[type].call(this, match);
    }

    function validate() {
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
    }

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

        this._red = red;
        this._green = green;
        this._blue = blue;
        this._alpha = alpha;
        validate.call(this);
        this.calcHSLFromRGB();
    }

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

        this._hue = hue;
        this._saturation = saturation;
        this._lightness = lightness;
        this._alpha = alpha;
        validate.call(this);
        this.calcRGBFromHSL();
    }

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

        // Convert over
        this._red = parseInt(red, 16);
        this._green = parseInt(green, 16);
        this._blue = parseInt(blue, 16);
        this._alpha = parseInt(alpha, 16) / 255;

        // Make sure all values are valid
        validate.call(this);

        // Calculate the HSL value
        this.calcHSLFromRGB();
    }

    function readFromColor(match) {
        var rgbCode = COLOR_MAP[match[1]];

        readFromRGB.call(this, rgbCode.match(PARSER.RGB));
    }

    function convertRGBToHSL() {
        var red = this._red / 255;
        var green = this._green / 255;
        var blue = this._blue / 255;

        var min = Math.min(red, green, blue);
        var max = Math.max(red, green, blue);

        var dist = max - min;
        var lightness = (min + max) / 2;

        var saturation = 0;
        var hue = 0;
        if (min !== max) {
            if (lightness < 0.5) {
                saturation = dist / (max + min);
            } else {
                saturation = dist / (2 - max - min);
            }

            var distRed = (((max - red) / 6) + (dist / 2)) / dist;
            var distGreen = (((max - green) / 6) + (dist / 2)) / dist;
            var distBlue = (((max - blue) / 6) + (dist / 2)) / dist;

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

            hue = hue * 360;
        }

        this._hue = hue;
        this._saturation = saturation;
        this._lightness = lightness;
    }

    function convertHSLToRGB() {
        var hue = this._hue / 360;
        var saturation = this._saturation;
        var lightness = this._lightness;

        var red = 0;
        var green = 0;
        var blue = 0;

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

        this._red = Math.round(red * 255);
        this._green = Math.round(green * 255);
        this._blue = Math.round(blue * 255);
    }

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

    function Color(str) {
        if (typeof str !== 'string') {
            this.calcHSLFromRGB();
            return;
        }
        hydrate.call(this, str);
    }

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

    Color.prototype = {
        constructor: Color,

        _red: 0,
        _green: 0,
        _blue: 0,
        _alpha: 1,

        _hue: 0,
        _saturation: 0,
        _lightness: 0,

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

        calcHSLFromRGB: convertRGBToHSL,
        calcRGBFromHSL: convertHSLToRGB
    };

    Color.parseType = parseType;
    Color.TYPES = TYPES;

    return Color;
}());