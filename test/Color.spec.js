describe('Color', function() {

    var Color;
    beforeEach(function() {
        Color = window.Color;
    });

    function generateHydrationTests(setup, shouldInitializeColor) {
        return function() {
            var color;
            beforeEach(function() {
                if (shouldInitializeColor) {
                    color = new Color();
                }
            });

            describe('-hydrateUnknown', function() {
                if (!shouldInitializeColor) {
                    it('should provide a black color when given a non-string value', function() {
                        color = setup.call(color);
                        expect(color.red).toBe(0);
                        expect(color.green).toBe(0);
                        expect(color.blue).toBe(0);
                        expect(color.alpha).toBe(1);

                        color = setup.call(color, 1234);
                        expect(color.red).toBe(0);
                        expect(color.green).toBe(0);
                        expect(color.blue).toBe(0);
                        expect(color.alpha).toBe(1);

                        color = setup.call(color, {});
                        expect(color.red).toBe(0);
                        expect(color.green).toBe(0);
                        expect(color.blue).toBe(0);
                        expect(color.alpha).toBe(1);

                        color = setup.call(color, true);
                        expect(color.red).toBe(0);
                        expect(color.green).toBe(0);
                        expect(color.blue).toBe(0);
                        expect(color.alpha).toBe(1);

                        color = setup.call(color, false);
                        expect(color.red).toBe(0);
                        expect(color.green).toBe(0);
                        expect(color.blue).toBe(0);
                        expect(color.alpha).toBe(1);

                        color = setup.call(color, function() {});
                        expect(color.red).toBe(0);
                        expect(color.green).toBe(0);
                        expect(color.blue).toBe(0);
                        expect(color.alpha).toBe(1);
                    });
                }

                it('should provide a black color when given an invalid string', function() {
                    color = setup.call(color, '');
                    expect(color.red).toBe(0);
                    expect(color.green).toBe(0);
                    expect(color.blue).toBe(0);
                    expect(color.alpha).toBe(1);

                    color = setup.call(color, 'hsl(almost,there,but,not)');
                    expect(color.red).toBe(0);
                    expect(color.green).toBe(0);
                    expect(color.blue).toBe(0);
                    expect(color.alpha).toBe(1);

                    color = setup.call(color, 'rgba(1,2,3)');
                    expect(color.red).toBe(0);
                    expect(color.green).toBe(0);
                    expect(color.blue).toBe(0);
                    expect(color.alpha).toBe(1);

                    color = setup.call(color, 'rbg(#ff0022)');
                    expect(color.red).toBe(0);
                    expect(color.green).toBe(0);
                    expect(color.blue).toBe(0);
                    expect(color.alpha).toBe(1);

                    color = setup.call(color, '#a');
                    expect(color.red).toBe(0);
                    expect(color.green).toBe(0);
                    expect(color.blue).toBe(0);
                    expect(color.alpha).toBe(1);

                    color = setup.call(color, '#NOPE');
                    expect(color.red).toBe(0);
                    expect(color.green).toBe(0);
                    expect(color.blue).toBe(0);
                    expect(color.alpha).toBe(1);

                    color = setup.call(color, '-134');
                    expect(color.red).toBe(0);
                    expect(color.green).toBe(0);
                    expect(color.blue).toBe(0);
                    expect(color.alpha).toBe(1);
                });
            })

            describe('-hydrateHex', function() {
                it('should hydrate a color from a 3 digit hex string', function() {
                    color = setup.call(color, '#012');

                    expect(color.red).toBe(0);
                    expect(color.alpha).toBe(1);
                    expect(
                        color.green
                    ).toBe(
                        parseInt('11', 16)
                    );
                    expect(
                        color.blue
                    ).toBe(
                        parseInt('22', 16)
                    );
                });

                it('should hydrate a color from a 4 digit hex string', function() {
                    color = setup.call(color, '#C012');

                    expect(
                        color.alpha
                    ).toBe(
                        parseInt('CC', 16) / 255
                    );
                    expect(color.red).toBe(0);
                    expect(
                        color.green
                    ).toBe(
                        parseInt('11', 16)
                    );
                    expect(
                        color.blue
                    ).toBe(
                        parseInt('22', 16)
                    );
                });

                it('should hydrate a color from a 6 digit hex string', function() {
                    color = setup.call(color, '#123412');
                    
                    expect(color.alpha).toBe(1);

                    expect(
                        color.red
                    ).toBe(
                        parseInt('12', 16)
                    );

                    expect(
                        color.green
                    ).toBe(
                        parseInt('34', 16)
                    );

                    expect(
                        color.blue
                    ).toBe(
                        parseInt('12', 16)
                    );
                });

                it('should hydrate a color from a 6 digit hex string', function() {
                    color = setup.call(color, '#11aaBB');

                    expect(color.alpha).toBe(1);

                    expect(
                        color.red
                    ).toBe(
                        parseInt('11', 16)
                    );

                    expect(
                        color.green
                    ).toBe(
                        parseInt('aa', 16)
                    );

                    expect(
                        color.blue
                    ).toBe(
                        parseInt('BB', 16)
                    );
                });

                it('should hydrate a color from an 8 digit hex string', function() {
                    color = setup.call(color, '#AABBCCDD');
                    
                     expect(
                        color.alpha
                    ).toBe(
                        parseInt('AA', 16) / 255
                    );

                    expect(
                        color.red
                    ).toBe(
                        parseInt('BB', 16)
                    );

                    expect(
                        color.green
                    ).toBe(
                        parseInt('CC', 16)
                    );

                    expect(
                        color.blue
                    ).toBe(
                        parseInt('DD', 16)
                    );
                });

                it('should calculate the HSL value', function() {
                    var calcMethod = Color.prototype.calcHSLFromRGB;
                    spyOn(Color.prototype, 'calcHSLFromRGB');

                    color = setup.call(color, '#AABBCCDD');
                    expect(color.calcHSLFromRGB).toHaveBeenCalled();

                    Color.prototype.calcHSLFromRGB = calcMethod;
                });
            });

            describe('-hydrateRGB', function() {
                it('should pull the rgb from the color code string', function() {
                    color = setup.call(color, 'rgb(100, 100, 20)');

                    expect(
                        color.red
                    ).toBe(
                        100
                    );

                    expect(
                        color.green
                    ).toBe(
                        100
                    );

                    expect(
                        color.blue
                    ).toBe(
                        20
                    );

                    expect(
                        color.alpha
                    ).toBe(
                        1
                    );
                });

                it('should pull the rgba from the color code string', function() {
                    color = setup.call(color, 'rgba(56, 38.2, 12, 0.354)');

                    expect(
                        color.red
                    ).toBe(
                        56
                    );

                    expect(
                        color.green
                    ).toBe(
                        38.2
                    );

                    expect(
                        color.blue
                    ).toBe(
                        12
                    );

                    expect(
                        color.alpha
                    ).toBe(
                        0.354
                    );
                });

                it('should calculate the HSL value', function() {
                    var calcMethod = Color.prototype.calcHSLFromRGB;
                    spyOn(Color.prototype, 'calcHSLFromRGB');

                    color = setup.call(color, 'rgba(56, 38.2, 12, 0.354)');
                    expect(color.calcHSLFromRGB).toHaveBeenCalled();

                    Color.prototype.calcHSLFromRGB = calcMethod;
                });
            });

            describe('-hydrateHSL', function() {
                it('should pull the hsl from the color code string', function() {
                    color = setup.call(color, 'hsl(323, 100%, 50%)');

                    expect(
                        color.hue
                    ).toBe(
                        323
                    );

                    expect(
                        color.saturation
                    ).toBe(
                        1
                    );

                    expect(
                        color.lightness
                    ).toBe(
                        0.5
                    );

                    expect(
                        color.alpha
                    ).toBe(
                        1
                    );
                });

                it('should pull the hsla from the color code string', function() {
                    color = setup.call(color, 'hsla(45, 0.234%, 12%, 0.65)');

                    expect(
                        color.hue
                    ).toBe(
                        45
                    );

                    expect(
                        color.saturation
                    ).toBe(
                        0.00234
                    );

                    expect(
                        color.lightness
                    ).toBe(
                        0.12
                    );

                    expect(
                        color.alpha
                    ).toBe(
                        0.65
                    );
                });

                it('should calculate the RGB value', function() {
                    var calcMethod = Color.prototype.calcRGBFromHSL;
                    spyOn(Color.prototype, 'calcRGBFromHSL');

                    color = setup.call(color, 'hsla(45, 0.234%, 12%, 0.65)');
                    expect(color.calcRGBFromHSL).toHaveBeenCalled();

                    Color.prototype.calcRGBFromHSL = calcMethod;
                });
            });

            describe('-hydrateColors', function() {
                it('should pull the RGB from the color lookup', function() {
                    color = setup.call(color, 'chocolate');

                    expect(
                        color.red
                    ).toBe(
                        210
                    );

                    expect(
                        color.green
                    ).toBe(
                        105
                    );

                    expect(
                        color.blue
                    ).toBe(
                        30
                    );

                    expect(
                        color.alpha
                    ).toBe(
                        1
                    );

                    color = setup.call(color, 'floralwhite');

                    expect(
                        color.red
                    ).toBe(
                        255
                    );

                    expect(
                        color.green
                    ).toBe(
                        250
                    );

                    expect(
                        color.blue
                    ).toBe(
                        240
                    );

                    expect(
                        color.alpha
                    ).toBe(
                        1
                    );
                });
            });
        };
    }

    describe('#constructor', generateHydrationTests(
        function setup(param) {
            return new Color(param);
        }, false
    ));

    describe('#hydrate', generateHydrationTests(
        function setup(param) {
            this.hydrate(param);
            return this;
        }, true
    ));

    describe('#calcHSLFromRGB', function() {
        // HSL calculation has a heavy precision loss in JS
        var precision = 0.1;
        it('should calculate the HSL value from an RGB value with a saturation', function() {
            color = new Color();
            color._red = 255;
            color._green = 245;
            color._blue = 255;
            color.calcHSLFromRGB();

            expect(
                color.hue
            ).toBeCloseTo(
                300,
                precision
            );

            expect(
                color.saturation
            ).toBeCloseTo(
                1,
                precision
            );

            expect(
                color.lightness
            ).toBeCloseTo(
                0.98,
                precision
            );

            color = new Color();
            color._red = 200;
            color._green = 100;
            color._blue = 35;
            color.calcHSLFromRGB();

            expect(
                color.hue
            ).toBeCloseTo(
                24,
                precision
            );

            expect(
                color.saturation
            ).toBeCloseTo(
                0.7,
                precision
            );

            expect(
                color.lightness
            ).toBeCloseTo(
                0.46,
                precision
            );

            color = new Color();
            color._red = 23;
            color._green = 0;
            color._blue = 216;
            color.calcHSLFromRGB();

            expect(
                color.hue
            ).toBeCloseTo(
                246,
                precision
            );

            expect(
                color.saturation
            ).toBeCloseTo(
                1,
                precision
            );

            expect(
                color.lightness
            ).toBeCloseTo(
                0.42,
                precision
            );
        });

        it('should calculate the HSL value from an RGB value with no saturation', function() {
            color = new Color();
            color._red = 255;
            color._green = 255;
            color._blue = 255;
            color.calcHSLFromRGB();

            expect(
                color.hue
            ).toBeCloseTo(
                0,
                precision
            );

            expect(
                color.saturation
            ).toBeCloseTo(
                0,
                precision
            );

            expect(
                color.lightness
            ).toBeCloseTo(
                1,
                precision
            );

            color = new Color();
            color._red = 100;
            color._green = 100;
            color._blue = 100;
            color.calcHSLFromRGB();

            expect(
                color.hue
            ).toBeCloseTo(
                0,
                precision
            );

            expect(
                color.saturation
            ).toBeCloseTo(
                0,
                precision
            );

            expect(
                color.lightness
            ).toBeCloseTo(
                0.39,
                precision
            );

            color = new Color();
            color._red = 35;
            color._green = 35;
            color._blue = 35;
            color.calcHSLFromRGB();

            expect(
                color.hue
            ).toBeCloseTo(
                0,
                precision
            );

            expect(
                color.saturation
            ).toBeCloseTo(
                0,
                precision
            );

            expect(
                color.lightness
            ).toBeCloseTo(
                0.14,
                precision
            );
        });
    });

    describe('#calcRGBFromHSL', function() {
        var precision = 0.1;
        it('should calculate the RGB value from an HSL value with a saturation', function() {
            color = new Color();
            color._hue = 300;
            color._saturation = 1;
            color._lightness = 0.98;
            color.calcRGBFromHSL();

            expect(
                color.red
            ).toBeCloseTo(
                255,
                precision
            );

            expect(
                color.green
            ).toBeCloseTo(
                245,
                precision
            );

            expect(
                color.blue
            ).toBeCloseTo(
                255,
                precision
            );

            color = new Color();
            color._hue = 24;
            color._saturation = 0.7;
            color._lightness = 0.46;
            color.calcRGBFromHSL();

            expect(
                color.red
            ).toBeCloseTo(
                199,
                precision
            );

            expect(
                color.green
            ).toBeCloseTo(
                101,
                precision
            );

            expect(
                color.blue
            ).toBeCloseTo(
                35,
                precision
            );

            color = new Color();
            color._hue = 246;
            color._saturation = 1;
            color._lightness = 0.42;
            color.calcRGBFromHSL();

            expect(
                color.red
            ).toBeCloseTo(
                21,
                precision
            );

            expect(
                color.green
            ).toBeCloseTo(
                0,
                precision
            );

            expect(
                color.blue
            ).toBeCloseTo(
                214,
                precision
            );
        });

        it('should calculate the RGB value from an HSL value with no saturation', function() {
            color = new Color();
            color._hue = 0;
            color._saturation = 0;
            color._lightness = 1;
            color.calcRGBFromHSL();

            expect(
                color.red
            ).toBeCloseTo(
                255,
                precision
            );

            expect(
                color.green
            ).toBeCloseTo(
                255,
                precision
            );

            expect(
                color.blue
            ).toBeCloseTo(
                255,
                precision
            );

            color = new Color();
            color._hue = 0;
            color._saturation = 0;
            color._lightness = 0.39;
            color.calcRGBFromHSL();

            expect(
                color.red
            ).toBeCloseTo(
                99,
                precision
            );

            expect(
                color.green
            ).toBeCloseTo(
                99,
                precision
            );

            expect(
                color.blue
            ).toBeCloseTo(
                99,
                precision
            );

            color = new Color();
            color._hue = 0;
            color._saturation = 0;
            color._lightness = 0.14;
            color.calcRGBFromHSL();

            expect(
                color.red
            ).toBeCloseTo(
                36,
                precision
            );

            expect(
                color.green
            ).toBeCloseTo(
                36,
                precision
            );

            expect(
                color.blue
            ).toBeCloseTo(
                36,
                precision
            );
        });
    });

    describe('#parseType', function() {
        it('should recognize an HSL color', function() {
            // Normal
            expect(
                Color.parseType('hsl(2,2%,2%)')
            ).toBe(
                Color.TYPES.HSL
            );

            // With spaces
            expect(
                Color.parseType('     hsl( 2    ,   2%   ,\t2%   )  ')
            ).toBe(
                Color.TYPES.HSL
            );

            // With decimals
            expect(
                Color.parseType('hsl( 0.2, 0.123% , 0.12% )')
            ).toBe(
                Color.TYPES.HSL
            );

            // With max values
            expect(
                Color.parseType('hsl(360,100%,100%)')
            ).toBe(
                Color.TYPES.HSL
            );
        });

        it('should not recognize an HSL color without percentage marks', function() {
            expect(
                Color.parseType('hsl(2,2,2%)')
            ).toBe(
                Color.TYPES.UNKNOWN
            );

            expect(
                Color.parseType('hsl(2,2%,2)')
            ).toBe(
                Color.TYPES.UNKNOWN
            );

            expect(
                Color.parseType('hsl(2,2,2)')
            ).toBe(
                Color.TYPES.UNKNOWN
            );
        });

        it('should recognize an HSLA color', function() {
            // Basic Case
            expect(
                Color.parseType('hsla(2,2%,2%,1)')
            ).toBe(
                Color.TYPES.HSLA
            );

            // With Spaces
            expect(
                Color.parseType(' hsla(   2\t\t\t,    2%   , 2%  , 1  )')
            ).toBe(
                Color.TYPES.HSLA
            );

            // With Decimals
            expect(
                Color.parseType('hsla(0.24,2.0230%,0.213%,0.23)')
            ).toBe(
                Color.TYPES.HSLA
            );

            // With max values
            expect(
                Color.parseType('hsla(360,100%,100%,1.0)')
            ).toBe(
                Color.TYPES.HSLA
            );
        });

        it('should not recognize an HSLA color without percentage marks', function() {
            expect(
                Color.parseType('hsla(2,2,2%,1)')
            ).toBe(
                Color.TYPES.UNKNOWN
            );

            expect(
                Color.parseType('hsla(2,2%,2,1)')
            ).toBe(
                Color.TYPES.UNKNOWN
            );

            expect(
                Color.parseType('hsla(2,2,2,1)')
            ).toBe(
                Color.TYPES.UNKNOWN
            );
        });

        it('should recognize an RGB color', function() {
            expect(
                Color.parseType('rgb(2,2,2)')
            ).toBe(
                Color.TYPES.RGB
            );

            expect(
                Color.parseType('rgb(   2  ,   2  ,  2  )   ')
            ).toBe(
                Color.TYPES.RGB
            );

            expect(
                Color.parseType('\t\t\trgb(   111.0  ,   234.24  ,  100  )   ')
            ).toBe(
                Color.TYPES.RGB
            );

            expect(
                Color.parseType('rgb(255,255,255)   ')
            ).toBe(
                Color.TYPES.RGB
            );
        });

        it('should recognize an RGBA color', function() {
            expect(
                Color.parseType('rgba(2,2,2,1)')
            ).toBe(
                Color.TYPES.RGBA
            );

            expect(
                Color.parseType('rgba(   2  ,   2  ,  2  , 0.1)   ')
            ).toBe(
                Color.TYPES.RGBA
            );

            expect(
                Color.parseType('\t\t\trgba(   111.0  ,   234.24  ,  100, 0.24   )   ')
            ).toBe(
                Color.TYPES.RGBA
            );

            expect(
                Color.parseType('rgba(255,255,255,1)   ')
            ).toBe(
                Color.TYPES.RGBA
            );
        });

        it('should recognize a Hex color with 3 digits', function() {
            expect(
                Color.parseType('#fff')
            ).toBe(
                Color.TYPES.HEX
            );

            expect(
                Color.parseType('#123')
            ).toBe(
                Color.TYPES.HEX
            );

            expect(
                Color.parseType('#456')
            ).toBe(
                Color.TYPES.HEX
            );

            expect(
                Color.parseType('#789')
            ).toBe(
                Color.TYPES.HEX
            );

            expect(
                Color.parseType('#abc')
            ).toBe(
                Color.TYPES.HEX
            );

            expect(
                Color.parseType('#def')
            ).toBe(
                Color.TYPES.HEX
            );

            expect(
                Color.parseType('#ABC')
            ).toBe(
                Color.TYPES.HEX
            );

            expect(
                Color.parseType('#DEF')
            ).toBe(
                Color.TYPES.HEX
            );
        });

        it('should recognize a Hex color with 4 digits', function() {
            expect(
                Color.parseType('#0fff')
            ).toBe(
                Color.TYPES.HEX
            );

            expect(
                Color.parseType('#1123')
            ).toBe(
                Color.TYPES.HEX
            );

            expect(
                Color.parseType('#2456')
            ).toBe(
                Color.TYPES.HEX
            );

            expect(
                Color.parseType('#3789')
            ).toBe(
                Color.TYPES.HEX
            );

            expect(
                Color.parseType('#Aabc')
            ).toBe(
                Color.TYPES.HEX
            );

            expect(
                Color.parseType('#fdef')
            ).toBe(
                Color.TYPES.HEX
            );

            expect(
                Color.parseType('#DABC')
            ).toBe(
                Color.TYPES.HEX
            );

            expect(
                Color.parseType('#bDEF')
            ).toBe(
                Color.TYPES.HEX
            );
        });

        it('should recognize a Hex color with 6 digits', function() {
            expect(
                Color.parseType('#ffffff')
            ).toBe(
                Color.TYPES.HEX2
            );

            expect(
                Color.parseType('#123456')
            ).toBe(
                Color.TYPES.HEX2
            );

            expect(
                Color.parseType('#789abc')
            ).toBe(
                Color.TYPES.HEX2
            );

            expect(
                Color.parseType('#defFDE')
            ).toBe(
                Color.TYPES.HEX2
            );

            expect(
                Color.parseType('#CBA000')
            ).toBe(
                Color.TYPES.HEX2
            );
        });

        it('should recognize a Hex color with 8 digits', function() {
            expect(
                Color.parseType('#01234567')
            ).toBe(
                Color.TYPES.HEX2
            );

            expect(
                Color.parseType('#89abcdef')
            ).toBe(
                Color.TYPES.HEX2
            );

            expect(
                Color.parseType('#ABCDEF01')
            ).toBe(
                Color.TYPES.HEX2
            );
        });

        it('should recognize a string color', function() {
            expect(
                Color.parseType('red')
            ).toBe(
                Color.TYPES.LUT
            );

            expect(
                Color.parseType('aliceblue')
            ).toBe(
                Color.TYPES.LUT
            );

            expect(
                Color.parseType('darkgoldenrod')
            ).toBe(
                Color.TYPES.LUT
            );

            expect(
                Color.parseType('yellowgreen')
            ).toBe(
                Color.TYPES.LUT
            );
        });

        it('should not recognize a string color with an invalid color', function() {
            expect(
                Color.parseType('happy')
            ).toBe(
                Color.TYPES.UNKNOWN
            );

            expect(
                Color.parseType('aliceblue2')
            ).toBe(
                Color.TYPES.UNKNOWN
            );

            expect(
                Color.parseType('none')
            ).toBe(
                Color.TYPES.UNKNOWN
            );

            expect(
                Color.parseType('fakecolor')
            ).toBe(
                Color.TYPES.UNKNOWN
            );

            expect(
                Color.parseType('alice blue')
            ).toBe(
                Color.TYPES.UNKNOWN
            );
        });

        it('should not recognize a hex color without the proper digit space', function() {
            expect(
                Color.parseType('#f')
            ).toBe(
                Color.TYPES.UNKNOWN
            );
        });
    });

    // RGB
    var RGB = [
        'red',
        'green',
        'blue'
    ];

    for (var i = 0; i < RGB.length; i++) {
        (function(type) {
            describe('.' + type, function() {
                beforeEach(function() {
                    color = new Color();
                });

                it('should set the value from a number', function() {
                    color[type] = 2;
                    expect(color[type]).toBe(2);

                    color[type] = 0.245;
                    expect(color[type]).toBe(0.245);
                });

                it('should pull the number from a string', function() {
                    color[type] = '245';
                    expect(color[type]).toBe(245);
                });

                it('should set the value to 0 if provided an invalid type', function() {
                    color[type] = function() {};
                    expect(color[type]).toBe(0);

                    color[type] = true;
                    expect(color[type]).toBe(0);

                    color[type] = false;
                    expect(color[type]).toBe(0);

                    color[type] = 'happy';
                    expect(color[type]).toBe(0);

                    color[type] = {};
                    expect(color[type]).toBe(0);
                });

                it('should clamp to be within 0', function() {
                    color[type] = -24;

                    expect(color[type]).toBe(0);

                    color[type] = -0.0002345;

                    expect(color[type]).toBe(0);

                    color[type] = -2031947189247;

                    expect(color[type]).toBe(0);
                });

                it('should clamp to be within 255', function() {
                    color[type] = 255;

                    expect(color[type]).toBe(255);

                    color[type] = 3666;

                    expect(color[type]).toBe(255);

                    color[type] = 255.57;

                    expect(color[type]).toBe(255);
                });

                it('should calculate the HSL value', function() {
                    spyOn(color, 'calcHSLFromRGB');
                    expect(color.calcHSLFromRGB).not.toHaveBeenCalled();

                    color[type] = 24;
                    expect(color.calcHSLFromRGB).toHaveBeenCalled();
                });
            });
        }(RGB[i]));
    }

    describe('.hue', function() {
        beforeEach(function() {
            color = new Color();
        });

        it('should set the value from a number', function() {
            color.hue = 2;
            expect(color.hue).toBe(2);

            color.hue = 0.245;
            expect(color.hue).toBe(0.245);

            color.hue = 355;
            expect(color.hue).toBe(355);
        });

        it('should pull the number from a string', function() {
            color.hue = '245';
            expect(color.hue).toBe(245);
        });

        it('should set the value to 0 if provided an invalid type', function() {
            color.hue = function() {};
            expect(color.hue).toBe(0);

            color.hue = true;
            expect(color.hue).toBe(0);

            color.hue = false;
            expect(color.hue).toBe(0);

            color.hue = 'happy';
            expect(color.hue).toBe(0);

            color.hue = {};
            expect(color.hue).toBe(0);
        });

        it('should clamp to be within 0', function() {
            color.hue = -24;

            expect(color.hue).toBe(0);

            color.hue = -0.0002345;

            expect(color.hue).toBe(0);

            color.hue = -2031947189247;

            expect(color.hue).toBe(0);
        });

        it('should modulo at 360', function() {
            color.hue = 360;
            expect(color.hue).toBe(0);

            color.hue = 359.983;
            expect(color.hue).toBe(359.983);

            color.hue = 423;
            expect(color.hue).toBe(423 % 360);

            color.hue = 720;
            expect(color.hue).toBe(0);
        });

        it('should calculate the RGB value', function() {
            spyOn(color, 'calcRGBFromHSL');
            expect(color.calcRGBFromHSL).not.toHaveBeenCalled();

            color.hue = 24;
            expect(color.calcRGBFromHSL).toHaveBeenCalled();
        });
    });

    var PERCENTS = [
        'alpha',
        'saturation',
        'lightness'
    ];

    for (var i = 0; i < PERCENTS.length; i++) {
        (function(type) {
            describe('.' + type, function() {
                beforeEach(function() {
                    color = new Color();
                });

                it('should set the value from a number', function() {
                    color[type] = 0.5;
                    expect(color[type]).toBe(0.5);

                    color[type] = 0.245;
                    expect(color[type]).toBe(0.245);
                });

                it('should pull the number from a string', function() {
                    color[type] = '0.2';
                    expect(color[type]).toBe(0.2);
                });

                it('should set the value to 0 if provided an invalid type', function() {
                    color[type] = function() {};
                    expect(color[type]).toBe(0);

                    color[type] = true;
                    expect(color[type]).toBe(0);

                    color[type] = false;
                    expect(color[type]).toBe(0);

                    color[type] = 'happy';
                    expect(color[type]).toBe(0);

                    color[type] = {};
                    expect(color[type]).toBe(0);
                });

                it('should clamp to be within 0', function() {
                    color[type] = -24;

                    expect(color[type]).toBe(0);

                    color[type] = -0.0002345;

                    expect(color[type]).toBe(0);

                    color[type] = -2031947189247;

                    expect(color[type]).toBe(0);
                });

                it('should clamp to be within 1', function() {
                    color[type] = 1;

                    expect(color[type]).toBe(1);

                    color[type] = 0.999;

                    expect(color[type]).toBe(0.999);

                    color[type] = 1.23;

                    expect(color[type]).toBe(1);
                });

                if (type !== 'alpha') {
                    it('should calculate the RGB value', function() {
                        spyOn(color, 'calcRGBFromHSL');
                        expect(color.calcRGBFromHSL).not.toHaveBeenCalled();

                        color[type] = 0.8;
                        expect(color.calcRGBFromHSL).toHaveBeenCalled();
                    });
                }
            });
        }(PERCENTS[i]));
    }

    describe('#toHexString', function() {
        var str;
        beforeEach(function() {
            color = new Color();
        });

        it('should transform with an alpha value', function() {
            color.red = 255;
            color.green = 24;
            color.blue = 23;

            str = color.toHexString();
            expect(str.toLowerCase()).toBe('#ffff1817');
        });

        it('should transform without an alpha value when provided a truthy parameter', function() {
            color.red = 100;
            color.green = 45;
            color.blue = 200;

            str = color.toHexString(true);
            expect(str.toLowerCase()).toBe('#642dc8');

            str = color.toHexString(23);
            expect(str.toLowerCase()).toBe('#642dc8');

            str = color.toHexString({});
            expect(str.toLowerCase()).toBe('#642dc8');

            str = color.toHexString(function() {});
            expect(str.toLowerCase()).toBe('#642dc8');
        });

        it('should premultiply alpha when alpha is not 1', function() {
            color.red = 255;
            color.green = 255;
            color.blue = 255;
            color.alpha = 0.5;

            str = color.toHexString(true);
            expect(str.toLowerCase()).toBe('#808080');
        });

        it('should transform the string without floating point decimals', function() {
            color.red = 240.234;
            color.green = 23.123654;
            color.blue = 83.79746;
            color.alpha = 0.745;

            str = color.toHexString(true);
            expect(str.toLowerCase()).toBe('#b3113e');

            str = color.toHexString();
            expect(str.toLowerCase()).toBe('#bef01754');
        });

        it('should pipe through #toString', function() {
            color.red = 255;
            color.green = 24;
            color.blue = 23;

            str = color.toString(Color.TYPES.HEX);
            expect(str.toLowerCase()).toBe('#ffff1817');

            str = color.toString(Color.TYPES.HEX2);
            expect(str.toLowerCase()).toBe('#ffff1817');
        });
    });

    describe('#toRGBString', function() {
        var str;
        beforeEach(function() {
            color = new Color();
        });

        it('should transform into a rgb string', function() {
            color.red = 100;
            color.green = 125;
            color.blue = 150;

            str = color.toRGBString();
            expect(str).toBe('rgb(100, 125, 150)');
        });

        it('should premultiply the alpha', function() {
            color.red = 255;
            color.green = 2;
            color.blue = 24;
            color.alpha = 0.1;

            str = color.toRGBString();
            expect(str).toBe('rgb(26, 0, 2)');
        });

        it('should allow floating point values when requested to', function() {
            color.red = 200.245;
            color.green = 2.234;
            color.blue = 24.623;

            str = color.toRGBString(true);
            expect(str).toBe('rgb(200.245, 2.234, 24.623)');
        });

        it('should disallow floating point values when by default', function() {
            color.red = 200.245;
            color.green = 2.234;
            color.blue = 24.623;

            str = color.toRGBString();
            expect(str).toBe('rgb(200, 2, 25)');
        });

        it('should pipe through #toString', function() {
            color.red = 100;
            color.green = 125;
            color.blue = 150;

            str = color.toString(Color.TYPES.RGB);
            expect(str).toBe('rgb(100, 125, 150)');

            color.red = 255;
            color.green = 2;
            color.blue = 24;
            color.alpha = 0.1;

            str = color.toString(Color.TYPES.RGB);
            expect(str).toBe('rgb(26, 0, 2)');
        });
    });

    describe('#toRGBAString', function() {
        var str;
        beforeEach(function() {
            color = new Color();
        });

        it('should transform into a rgba string', function() {
            color.red = 100;
            color.green = 125;
            color.blue = 150;

            str = color.toRGBAString();
            expect(str).toBe('rgba(100, 125, 150, 1)');

            color.red = 255;
            color.green = 2;
            color.blue = 24;
            color.alpha = 0.1;

            str = color.toRGBAString();
            expect(str).toBe('rgba(255, 2, 24, 0.1)');
        });

        it('should allow floating point values when requested to', function() {
            color.red = 200.245;
            color.green = 2.234;
            color.blue = 24.623;

            str = color.toRGBAString(true);
            expect(str).toBe('rgba(200.245, 2.234, 24.623, 1)');
        });

        it('should disallow floating point values when by default', function() {
            color.red = 200.245;
            color.green = 2.234;
            color.blue = 24.623;

            str = color.toRGBAString();
            expect(str).toBe('rgba(200, 2, 25, 1)');
        });

        it('should always show alpha value despite disallowing floating point', function() {
            color.red = 200.245;
            color.green = 2.234;
            color.blue = 24.623;
            color.alpha = 0.6;

            str = color.toRGBAString();
            expect(str).toBe('rgba(200, 2, 25, 0.6)');
        });

        it('should pipe through #toString', function() {
            color.red = 100;
            color.green = 125;
            color.blue = 150;

            str = color.toString(Color.TYPES.RGBA);
            expect(str).toBe('rgba(100, 125, 150, 1)');

            color.red = 255;
            color.green = 2;
            color.blue = 24;
            color.alpha = 0.1;

            str = color.toString(Color.TYPES.RGBA);
            expect(str).toBe('rgba(255, 2, 24, 0.1)');
        });
    });

    describe('#toHSLString', function() {
        var str;
        beforeEach(function() {
            color = new Color();
        });

        it('should transform into an hsl string', function() {
            color.hue = 254;
            color.saturation = 0.45;
            color.lightness = 0.34;

            str = color.toHSLString();
            expect(str).toBe('hsl(254, 45%, 34%)');

            color.hue = 212;
            color.saturation = 1;
            color.lightness = 0.65;

            str = color.toHSLString();
            expect(str).toBe('hsl(212, 100%, 65%)');
        });

        it('should show the floating point values when requested to', function() {
            color.hue = 254.123;
            color.saturation = 0.4545;
            color.lightness = 0.3412;

            str = color.toHSLString(true);
            expect(str).toBe('hsl(254.123, 45.45%, 34.12%)');

            color.hue = 212.0234;
            color.saturation = 0.987;
            color.lightness = 0.1123;

            str = color.toHSLString(true);
            expect(str).toBe('hsl(212.0234, 98.7%, 11.23%)');
        });

        it('should pipe through #toString', function() {
            color.hue = 254;
            color.saturation = 0.45;
            color.lightness = 0.34;

            str = color.toString(Color.TYPES.HSL);
            expect(str).toBe('hsl(254, 45%, 34%)');

            color.hue = 212;
            color.saturation = 1;
            color.lightness = 0.65;

            str = color.toString(Color.TYPES.HSL);
            expect(str).toBe('hsl(212, 100%, 65%)');
        });
    });

    describe('#toHSLAString', function() {
        var str;
        beforeEach(function() {
            color = new Color();
        });

        it('should transform into an hsla string', function() {
            color.hue = 254;
            color.saturation = 0.45;
            color.lightness = 0.34;
            color.alpha = 0.8;

            str = color.toHSLAString();
            expect(str).toBe('hsla(254, 45%, 34%, 0.8)');

            color.hue = 212;
            color.saturation = 1;
            color.lightness = 0.65;
            color.alpha = 0.21;

            str = color.toHSLAString();
            expect(str).toBe('hsla(212, 100%, 65%, 0.21)');
        });

        it('should show the floating point values when requested to', function() {
            color.hue = 254.123;
            color.saturation = 0.4545;
            color.lightness = 0.3412;
            color.alpha = 0.45;

            str = color.toHSLAString(true);
            expect(str).toBe('hsla(254.123, 45.45%, 34.12%, 0.45)');

            color.hue = 212.0234;
            color.saturation = 0.987;
            color.lightness = 0.1123;
            color.alpha = 1;

            str = color.toHSLAString(true);
            expect(str).toBe('hsla(212.0234, 98.7%, 11.23%, 1)');
        });

        it('should pipe through #toString', function() {
            color.hue = 254;
            color.saturation = 0.45;
            color.lightness = 0.34;
            color.alpha = 0.8;

            str = color.toHSLAString(Color.TYPES.HSLA);
            expect(str).toBe('hsla(254, 45%, 34%, 0.8)');

            color.hue = 212;
            color.saturation = 1;
            color.lightness = 0.65;
            color.alpha = 0.21;

            str = color.toHSLAString(Color.TYPES.HSLA);
            expect(str).toBe('hsla(212, 100%, 65%, 0.21)');
        });
    });

    describe('#toString', function() {
        beforeEach(function() {
            color = new Color();
            spyOn(color, 'toHexString');
            spyOn(color, 'toHSLString');
            spyOn(color, 'toHSLAString');
            spyOn(color, 'toRGBString');
            spyOn(color, 'toRGBAString');
        });

        it('should call toHexString with no parameters', function() {
            color.toString();
            expect(color.toHexString).toHaveBeenCalled();
            expect(color.toHSLString).not.toHaveBeenCalled();
            expect(color.toHSLAString).not.toHaveBeenCalled();
            expect(color.toRGBString).not.toHaveBeenCalled();
            expect(color.toRGBAString).not.toHaveBeenCalled();
        });

        it('should call toHexString with invalid parameters', function() {
            color.toString(23);
            expect(color.toHexString.calls.length).toBe(1);
            expect(color.toHSLString.calls.length).toBe(0);
            expect(color.toHSLAString.calls.length).toBe(0);
            expect(color.toRGBString.calls.length).toBe(0);
            expect(color.toRGBAString.calls.length).toBe(0);

            color.toString({});
            expect(color.toHexString.calls.length).toBe(2);
            expect(color.toHSLString.calls.length).toBe(0);
            expect(color.toHSLAString.calls.length).toBe(0);
            expect(color.toRGBString.calls.length).toBe(0);
            expect(color.toRGBAString.calls.length).toBe(0);

            color.toString(function() {});
            expect(color.toHexString.calls.length).toBe(3);
            expect(color.toHSLString.calls.length).toBe(0);
            expect(color.toHSLAString.calls.length).toBe(0);
            expect(color.toRGBString.calls.length).toBe(0);
            expect(color.toRGBAString.calls.length).toBe(0);

            color.toString(true);
            expect(color.toHexString.calls.length).toBe(4);
            expect(color.toHSLString.calls.length).toBe(0);
            expect(color.toHSLAString.calls.length).toBe(0);
            expect(color.toRGBString.calls.length).toBe(0);
            expect(color.toRGBAString.calls.length).toBe(0);

            color.toString(false);
            expect(color.toHexString.calls.length).toBe(5);
            expect(color.toHSLString.calls.length).toBe(0);
            expect(color.toHSLAString.calls.length).toBe(0);
            expect(color.toRGBString.calls.length).toBe(0);
            expect(color.toRGBAString.calls.length).toBe(0);
        });
    });
});