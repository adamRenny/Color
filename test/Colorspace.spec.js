describe('Colorspace', function() {

    var colorspace;
    beforeEach(function() {
        colorspace = window.cs;
    });

    describe('#parseType', function() {
        it('should recognize an HSL color', function() {
            // Normal
            expect(
                colorspace.parseType('hsl(2,2%,2%)')
            ).toBe(
                colorspace.TYPES.HSL
            );

            // With spaces
            expect(
                colorspace.parseType('     hsl( 2    ,   2%   ,\t2%   )  ')
            ).toBe(
                colorspace.TYPES.HSL
            );

            // With decimals
            expect(
                colorspace.parseType('hsl( 0.2, 0.123% , 0.12% )')
            ).toBe(
                colorspace.TYPES.HSL
            );

            // With max values
            expect(
                colorspace.parseType('hsl(360,100%,100%)')
            ).toBe(
                colorspace.TYPES.HSL
            );
        });

        it('should not recognize an HSL color without percentage marks', function() {
            expect(
                colorspace.parseType('hsl(2,2,2%)')
            ).toBe(
                colorspace.TYPES.UNKNOWN
            );

            expect(
                colorspace.parseType('hsl(2,2%,2)')
            ).toBe(
                colorspace.TYPES.UNKNOWN
            );

            expect(
                colorspace.parseType('hsl(2,2,2)')
            ).toBe(
                colorspace.TYPES.UNKNOWN
            );
        });

        it('should recognize an HSLA color', function() {
            // Basic Case
            expect(
                colorspace.parseType('hsla(2,2%,2%,1)')
            ).toBe(
                colorspace.TYPES.HSLA
            );

            // With Spaces
            expect(
                colorspace.parseType(' hsla(   2\t\t\t,    2%   , 2%  , 1  )')
            ).toBe(
                colorspace.TYPES.HSLA
            );

            // With Decimals
            expect(
                colorspace.parseType('hsla(0.24,2.0230%,0.213%,0.23)')
            ).toBe(
                colorspace.TYPES.HSLA
            );

            // With max values
            expect(
                colorspace.parseType('hsla(360,100%,100%,1.0)')
            ).toBe(
                colorspace.TYPES.HSLA
            );
        });

        it('should not recognize an HSLA color without percentage marks', function() {
            expect(
                colorspace.parseType('hsla(2,2,2%,1)')
            ).toBe(
                colorspace.TYPES.UNKNOWN
            );

            expect(
                colorspace.parseType('hsla(2,2%,2,1)')
            ).toBe(
                colorspace.TYPES.UNKNOWN
            );

            expect(
                colorspace.parseType('hsla(2,2,2,1)')
            ).toBe(
                colorspace.TYPES.UNKNOWN
            );
        });

        it('should recognize an RGB color', function() {
            expect(
                colorspace.parseType('rgb(2,2,2)')
            ).toBe(
                colorspace.TYPES.RGB
            );

            expect(
                colorspace.parseType('rgb(   2  ,   2  ,  2  )   ')
            ).toBe(
                colorspace.TYPES.RGB
            );

            expect(
                colorspace.parseType('\t\t\trgb(   111.0  ,   234.24  ,  100  )   ')
            ).toBe(
                colorspace.TYPES.RGB
            );

            expect(
                colorspace.parseType('rgb(255,255,255)   ')
            ).toBe(
                colorspace.TYPES.RGB
            );
        });

        it('should recognize an RGBA color', function() {
            expect(
                colorspace.parseType('rgba(2,2,2,1)')
            ).toBe(
                colorspace.TYPES.RGBA
            );

            expect(
                colorspace.parseType('rgba(   2  ,   2  ,  2  , 0.1)   ')
            ).toBe(
                colorspace.TYPES.RGBA
            );

            expect(
                colorspace.parseType('\t\t\trgba(   111.0  ,   234.24  ,  100, 0.24   )   ')
            ).toBe(
                colorspace.TYPES.RGBA
            );

            expect(
                colorspace.parseType('rgba(255,255,255,1)   ')
            ).toBe(
                colorspace.TYPES.RGBA
            );
        });

        it('should recognize a Hex color with 3 digits', function() {
            expect(
                colorspace.parseType('#fff')
            ).toBe(
                colorspace.TYPES.HEX
            );

            expect(
                colorspace.parseType('#123')
            ).toBe(
                colorspace.TYPES.HEX
            );

            expect(
                colorspace.parseType('#456')
            ).toBe(
                colorspace.TYPES.HEX
            );

            expect(
                colorspace.parseType('#789')
            ).toBe(
                colorspace.TYPES.HEX
            );

            expect(
                colorspace.parseType('#abc')
            ).toBe(
                colorspace.TYPES.HEX
            );

            expect(
                colorspace.parseType('#def')
            ).toBe(
                colorspace.TYPES.HEX
            );

            expect(
                colorspace.parseType('#ABC')
            ).toBe(
                colorspace.TYPES.HEX
            );

            expect(
                colorspace.parseType('#DEF')
            ).toBe(
                colorspace.TYPES.HEX
            );
        });

        it('should recognize a Hex color with 6 digits', function() {
            expect(
                colorspace.parseType('#ffffff')
            ).toBe(
                colorspace.TYPES.HEX
            );

            expect(
                colorspace.parseType('#123456')
            ).toBe(
                colorspace.TYPES.HEX
            );

            expect(
                colorspace.parseType('#789abc')
            ).toBe(
                colorspace.TYPES.HEX
            );

            expect(
                colorspace.parseType('#defFDE')
            ).toBe(
                colorspace.TYPES.HEX
            );

            expect(
                colorspace.parseType('#CBA000')
            ).toBe(
                colorspace.TYPES.HEX
            );
        });

        it('should recognize a Hex color with 8 digits', function() {
            expect(
                colorspace.parseType('#01234567')
            ).toBe(
                colorspace.TYPES.HEX
            );

            expect(
                colorspace.parseType('#89abcdef')
            ).toBe(
                colorspace.TYPES.HEX
            );

            expect(
                colorspace.parseType('#ABCDEF01')
            ).toBe(
                colorspace.TYPES.HEX
            );
        });

        it('should recognize a string color', function() {
            expect(
                colorspace.parseType('red')
            ).toBe(
                colorspace.TYPES.LUT
            );

            expect(
                colorspace.parseType('aliceblue')
            ).toBe(
                colorspace.TYPES.LUT
            );

            expect(
                colorspace.parseType('darkgoldenrod')
            ).toBe(
                colorspace.TYPES.LUT
            );

            expect(
                colorspace.parseType('yellowgreen')
            ).toBe(
                colorspace.TYPES.LUT
            );
        });

        it('should not recognize a string color with an invalid color', function() {
            expect(
                colorspace.parseType('happy')
            ).toBe(
                colorspace.TYPES.UNKNOWN
            );

            expect(
                colorspace.parseType('aliceblue2')
            ).toBe(
                colorspace.TYPES.UNKNOWN
            );

            expect(
                colorspace.parseType('none')
            ).toBe(
                colorspace.TYPES.UNKNOWN
            );

            expect(
                colorspace.parseType('fakecolor')
            ).toBe(
                colorspace.TYPES.UNKNOWN
            );

            expect(
                colorspace.parseType('alice blue')
            ).toBe(
                colorspace.TYPES.UNKNOWN
            );
        });

        it('should not recognize a hex color without the proper digit space', function() {
            expect(
                colorspace.parseType('#f')
            ).toBe(
                colorspace.TYPES.UNKNOWN
            );
        });
    });

});