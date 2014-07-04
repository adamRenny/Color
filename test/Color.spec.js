describe('Color', function() {

    var Color;
    beforeEach(function() {
        Color = window.Color;
    });

    describe('#constructor', function() {
        var color;
        describe('-hydrateUnknown', function() {
            it('should provide a black color when given a non-string value', function() {
                color = new Color();
                expect(color.red).toBe(0);
                expect(color.green).toBe(0);
                expect(color.blue).toBe(0);
                expect(color.alpha).toBe(1);

                color = new Color(1234);
                expect(color.red).toBe(0);
                expect(color.green).toBe(0);
                expect(color.blue).toBe(0);
                expect(color.alpha).toBe(1);

                color = new Color({});
                expect(color.red).toBe(0);
                expect(color.green).toBe(0);
                expect(color.blue).toBe(0);
                expect(color.alpha).toBe(1);

                color = new Color(true);
                expect(color.red).toBe(0);
                expect(color.green).toBe(0);
                expect(color.blue).toBe(0);
                expect(color.alpha).toBe(1);

                color = new Color(false);
                expect(color.red).toBe(0);
                expect(color.green).toBe(0);
                expect(color.blue).toBe(0);
                expect(color.alpha).toBe(1);

                color = new Color(function() {});
                expect(color.red).toBe(0);
                expect(color.green).toBe(0);
                expect(color.blue).toBe(0);
                expect(color.alpha).toBe(1);
            });

            it('should provide a black color when given an invalid string', function() {
                color = new Color('');
                expect(color.red).toBe(0);
                expect(color.green).toBe(0);
                expect(color.blue).toBe(0);
                expect(color.alpha).toBe(1);

                color = new Color('hsl(almost,there,but,not)');
                expect(color.red).toBe(0);
                expect(color.green).toBe(0);
                expect(color.blue).toBe(0);
                expect(color.alpha).toBe(1);

                color = new Color('rgba(1,2,3)');
                expect(color.red).toBe(0);
                expect(color.green).toBe(0);
                expect(color.blue).toBe(0);
                expect(color.alpha).toBe(1);

                color = new Color('rbg(#ff0022)');
                expect(color.red).toBe(0);
                expect(color.green).toBe(0);
                expect(color.blue).toBe(0);
                expect(color.alpha).toBe(1);

                color = new Color('#a');
                expect(color.red).toBe(0);
                expect(color.green).toBe(0);
                expect(color.blue).toBe(0);
                expect(color.alpha).toBe(1);

                color = new Color('#NOPE');
                expect(color.red).toBe(0);
                expect(color.green).toBe(0);
                expect(color.blue).toBe(0);
                expect(color.alpha).toBe(1);

                color = new Color('-134');
                expect(color.red).toBe(0);
                expect(color.green).toBe(0);
                expect(color.blue).toBe(0);
                expect(color.alpha).toBe(1);
            });
        })

        describe('-hydrateHex', function() {
            it('should hydrate a color from a 3 digit hex string', function() {
                color = new Color('#012');

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
                color = new Color('#C012');

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
                color = new Color('#123412');
                
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
                color = new Color('#11aaBB');

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
                color = new Color('#AABBCCDD');
                
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
                var calcMethod = Color.prototype.calcRGBToHSL;
                spyOn(Color.prototype, 'calcRGBToHSL');

                color = new Color('#AABBCCDD');
                expect(color.calcRGBToHSL).toHaveBeenCalled();

                Color.prototype.calcRGBToHSL = calcMethod;
            });
        });

        describe('-hydrateRGB', function() {
            it('should pull the rgb from the color code string', function() {
                color = new Color('rgb(100, 100, 20)');

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
                color = new Color('rgba(56, 38.2, 12, 0.354)');

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
                var calcMethod = Color.prototype.calcRGBToHSL;
                spyOn(Color.prototype, 'calcRGBToHSL');

                color = new Color('rgba(56, 38.2, 12, 0.354)');
                expect(color.calcRGBToHSL).toHaveBeenCalled();

                Color.prototype.calcRGBToHSL = calcMethod;
            });
        });

        describe('-hydrateHSL', function() {
            it('should pull the hsl from the color code string', function() {
                color = new Color('hsl(323, 100%, 50%)');

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
                color = new Color('hsla(45, 0.234%, 12%, 0.65)');

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
                var calcMethod = Color.prototype.calcHSLToRGB;
                spyOn(Color.prototype, 'calcHSLToRGB');

                color = new Color('hsla(45, 0.234%, 12%, 0.65)');
                expect(color.calcHSLToRGB).toHaveBeenCalled();

                Color.prototype.calcHSLToRGB = calcMethod;
            });
        });

        describe('-hydrateColors', function() {
            it('should pull the RGB from the color lookup', function() {
                color = new Color('chocolate');

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

                color = new Color('floralwhite');

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
    });

    describe('#calcRGBToHSL', function() {
        // HSL calculation has a heavy precision loss in JS
        var precision = 0.1;
        it('should calculate the HSL value from an RGB value with a saturation', function() {
            color = new Color();
            color._red = 255;
            color._green = 245;
            color._blue = 255;
            color.calcRGBToHSL();

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
            color.calcRGBToHSL();

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
            color.calcRGBToHSL();

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
            color.calcRGBToHSL();

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
            color.calcRGBToHSL();

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
            color.calcRGBToHSL();

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

    describe('#calcHSLToRGB', function() {
        var precision = 0.1;
        it('should calculate the RGB value from an HSL value with a saturation', function() {
            color = new Color();
            color._hue = 300;
            color._saturation = 1;
            color._lightness = 0.98;
            color.calcHSLToRGB();

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
            color.calcHSLToRGB();

            expect(
                color.red
            ).toBeCloseTo(
                200,
                precision
            );

            expect(
                color.green
            ).toBeCloseTo(
                100,
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
            color.calcHSLToRGB();

            expect(
                color.red
            ).toBeCloseTo(
                23,
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
                216,
                precision
            );
        });

        it('should calculate the RGB value from an HSL value with no saturation', function() {
            color = new Color();
            color._hue = 0;
            color._saturation = 0;
            color._lightness = 1;
            color.calcHSLToRGB();

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
            color.calcHSLToRGB();

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
            color.calcHSLToRGB();

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

});