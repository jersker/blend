/*	  _,  _, __, _ __, ___   __,  _,
	 (_  / ` |_) | |_)  |   , |  (_
	 ,_) \_, | \ | |    | , (_|  ,_)
	 ///////////////////////////////
*/

document.addEventListener("DOMContentLoaded", function() {

// // // // // // // // // //

const triadic_one = ( color ) => ( { r : color.g, g : color.b, b : color.r } );
const triadic_two = ( color ) => ( { r : color.b, g : color.r, b : color.g } );

const complement = ( color ) => {

	return {
        r : Math.max( color.r, color.g, color.b ) + Math.min( color.r, color.g, color.b ) - color.r,
        g : Math.max( color.r, color.g, color.b ) + Math.min( color.r, color.g, color.b ) - color.g,
        b : Math.max( color.r, color.g, color.b ) + Math.min( color.r, color.g, color.b ) - color.b
    };
}

const scroll = () => {
    const header = document.querySelector("section#blend_page");
    const scroll_y = header.offsetHeight;
    
    window.scroll({
        top: scroll_y,
        behavior: 'smooth'
    });
}

function shades_tints( colors, red, green, blue ) {
    //  Shades are array items 0 - 4
    //  Tints are array items 5 - 9
    const shade_min = 0, shade_max = Math.floor( colors.length / 2 );
    const tint_min = (colors.length - shade_max), tint_max = colors.length;
    const shades = Array.from( colors ).slice( shade_min, shade_max );
    const tints = Array.from( colors ).slice( tint_min, tint_max );
    //  How much the color number should increment
    const shade = ( value ) => Math.floor( (value / shade_max) / 1.5 );
    const tint = ( value ) => Math.floor( ( 255 - value ) / tint_min );
    const red_shade = shade( red ), green_shade = shade( green ), blue_shade = shade( blue );  
    const red_tint = tint( red ), green_tint = tint( green ), blue_tint = tint( blue );
    //  Unfixed versions of _shade and _tint
    let red_s = red_shade, green_s = green_shade, blue_s = blue_shade;
    let red_t = red + red_tint, green_t = green + green_tint, blue_t = blue + blue_tint;
    //  Each shade / tint array item will be assigned a unique
    //  red, green, and blue value to be colored later
    shades.forEach(s => {
        s.red = red_s;
        s.green = green_s;
        s.blue = blue_s;
        
        red_s += red_shade;
        green_s += green_shade;
        blue_s += blue_shade;
    });
    tints.forEach(t => {
        t.red = red_t;
        t.green = green_t;
        t.blue = blue_t;
        
        red_t += red_tint;
        green_t += green_tint;
        blue_t += blue_tint;
    });
    //  Manually color the median array item with original values
    colors[ shade_max ].red = red;
    colors[ shade_max ].green = green;
    colors[ shade_max ].blue = blue;
}

const gradient_shades = ( colors, r1, g1, b1, r2, g2, b2 ) => {
    const max = ( colors.length - 1 );
    const shades = Array.from( colors ).slice( 1, max );
    //  Absolute value of how much the r, g, and b 
    //  values change from r1 to r2
    const step = ( value_a, value_b, max ) => Math.abs( value_a - Math.floor( ( ( value_a * max ) + value_b ) / ( max + 1 ) ) );
    const r_step = step( r1, r2, max );
    const g_step = step( g1, g2, max );
    const b_step = step( b1, b2, max );
    
    colors[ 0 ].red = r1;
    colors[ 0 ].green = g1;
    colors[ 0 ].blue = b1;
    
    colors[ max ].red = r2;
    colors[ max ].green = g2;
    colors[ max ].blue = b2;
    
    shades.forEach(s => {
        ( r1 > r2 ) ? r1 -= r_step : r1 += r_step;
        ( g1 > g2 ) ? g1 -= g_step : g1 += g_step;
        ( b1 > b2 ) ? b1 -= b_step : b1 += b_step;
        
        s.red = r1;
        s.green = g1;
        s.blue = b1;
    });
}

const hsl_to_rgb = ( h, s, l ) => {

    let r, g, b;
    h /= 360;

    if ( s == 0 ) {
        r = g = b = l;
    } else {
        const hue_to_rgb = ( p, q, h ) => {
            ( h < 0 ) && ( h += 1 );
            ( h > 1 ) && ( h -= 1 );
            if ( h < 1/6 ) return p + ( q - p ) * 6 * h;
            if ( h < 1/2 ) return q;
            if ( h < 2/3 ) return p + ( q - p ) * ( ( 2 / 3 ) - h ) * 6;

            return p;
        }

        let q = l < 0.5 ? l * ( 1 + s ) : l + s - l * s;
        let p = 2 * l - q;

        r = hue_to_rgb( p, q, ( h + 1/3 ) );
        g = hue_to_rgb( p, q, h );
        b = hue_to_rgb( p, q, ( h - 1/3 ) );
    }

    return {
        r : Math.round( r * 255 ), 
        g : Math.round( g * 255 ), 
        b : Math.round( b * 255 )
    };
}

const fixed_round = ( value, decimals ) => {
    return Number( Math.round( value + 'e' + decimals ) + 'e-' + decimals );
} 

const tetrad = ( color, index ) => {
    const { h, s, l } = get_hsl( color.r, color.g, color.b );
    const hueShift = ( index === 1 ) ? +120 : -60;
    const newHue = ( h + hueShift + 360 ) % 360;
    const { r, g, b } = hsl_to_rgb( newHue, s, l );

    return { r, g, b };
};

const get_hsl = ( red, green, blue ) => {

    const r_perc = red / 255;
    const g_perc = green / 255;
    const b_perc = blue / 255;

    const rgb_max = Math.max( r_perc, g_perc, b_perc );
    const rgb_min = Math.min( r_perc, g_perc, b_perc );
    
    let h, s, l;

    if ( rgb_max === rgb_min ) {
        h = 0;
        s = 0;
        l = rgb_max;
    } else {
        const d = rgb_max - rgb_min;

        switch ( rgb_max ) {
        case r_perc:
            h = ( ( g_perc - b_perc ) / d + ( g_perc < b_perc ? 6 : 0 ) ) / 6;
            break;
        case g_perc:
            h = ( ( b_perc - r_perc ) / d + 2 ) / 6;
            break;
        case b_perc:
            h = ( ( r_perc - g_perc ) / d + 4 ) / 6;
            break;
        }

        l = ( rgb_max + rgb_min ) / 2;
        s = d / ( 1 - Math.abs( 2 * l - 1 ) );
    }

    h *= 360;

    return {
        h: fixed_round( h, 4 ),
        s: fixed_round( s, 4 ),
        l: fixed_round( l, 4 )
    };
};
    
function create_labels(active_color, color) {
    const hex_label = "HEX: ";
    const rgb_label = "RGB: ";
    const cmyk_label = "CMYK: ";
    const hsl_label = "HSL: ";

    const color_about = active_color.parentElement.parentElement.querySelector("div.about");

    const info_active_color = color_about.querySelector("div.active_color");
    const info_table = color_about.querySelector("table.info");

    const hsl_format = { 
        h : fixed_round( color.hsl.h, 0 ), 
        s : fixed_round( ( color.hsl.s * 100 ), 0 ), 
        l : fixed_round( ( color.hsl.l * 100 ), 0 ) 
    };
    
    info_table.querySelector("td.hex_label").innerHTML = hex_label;
    info_table.querySelector("td.rgb_label").innerHTML = rgb_label;
    info_table.querySelector("td.cmyk_label").innerHTML = cmyk_label;
    info_table.querySelector("td.hsl_label").innerHTML = hsl_label;
    
    info_table.querySelector("td.hex_value").innerHTML = `#${color.hex}`;
    info_table.querySelector("td.rgb_value").innerHTML = `${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}`;
    info_table.querySelector("td.cmyk_value").innerHTML = `${color.cmyk.c}, ${color.cmyk.m}, ${color.cmyk.y}, ${color.cmyk.k}`;
    info_table.querySelector("td.hsl_value").innerHTML = `${hsl_format.h}°, ${hsl_format.s}%, ${hsl_format.l}%`;
    
    info_active_color.style.backgroundColor = active_color.style.backgroundColor;
}

class Palette {
    constructor( p, index, color1, color2, class_type, reset ) {

        let container;
        let about;
        let palette;
        let active_color_div;

        const title_h2 = document.createElement("h2");
        title_h2.innerHTML = `${p.title}`;

        if ( reset == false ) {
            container = document.createElement("div");
            container.setAttribute("class", "container");

            about = document.createElement("div");
            about.setAttribute("class", "about");
            about.innerHTML = `
                <table class="info">
                    <tr><td class="hex_label"></td><td class="hex_value"></td></tr>
                    <tr><td class="rgb_label"></td><td class="rgb_value"></td></tr>
                    <tr><td class="cmyk_label"></td><td class="cmyk_value"></td></tr>
                    <tr><td class="hsl_label"></td><td class="hsl_value"></td></tr>
                </table>
            `;

            active_color_div = document.createElement( "div" );
            active_color_div.setAttribute( "class", "active_color" );
            about.insertBefore( active_color_div, about.firstChild );

            const show_palette_button = document.createElement( "div" );
            show_palette_button.classList.add( "show_palette_button" );

            const show_palette_arrow = document.createElement( "span" );
            show_palette_arrow.classList.add( "show_palette_arrow" );
            show_palette_arrow.textContent = "▼";

            show_palette_button.append( show_palette_arrow, "Palette" );

            palette = document.createElement("div");
            palette.classList.add(class_type);
            palette.classList.add("palette");
            
            palette.innerHTML = Array.from( { length: 9 } ).map( () => '<div class="color"></div>' ).join( '' );

            show_palette_button.addEventListener( "click", function() {
                const is_hidden = !palette.style.height || palette.style.height === '0px';
                const height = is_hidden ? 'calc(74px + 1rem)' : '0px';
                const paddingTop = is_hidden ? '1rem' : '0';
                const rotation = is_hidden ? '0deg' : '-180deg';
                
                palette.style.height = height;
                palette.style.paddingTop = paddingTop;
                show_palette_arrow.style.transform = `rotate(${ rotation })`;
            });

            ( p.title || false ) && container.appendChild(title_h2);
            ( p.title == "Color" || class_type == "gradient_palette" ) && (
                palette.style.height = "calc( 74px + 1rem )",
                palette.style.paddingTop = "1rem"
            ) || active_color_div.appendChild(  show_palette_button );

            //( class_type == "gradient_palette" ) && ( container.appendChild( gradient ) );

            container.appendChild(about);
            container.appendChild(palette);
            colors_section.appendChild(container);

            } else {
                container = document.querySelectorAll(".container")[ index ];
                about = container.querySelector(".about");
                palette = container.querySelector(".palette");
            }

            const colors_dom = Array.from( palette.querySelectorAll( "div.color" ) );

            let gradient;
            if ( class_type == "color_palette" ) {
                shades_tints( colors_dom, color1.rgb.r, color1.rgb.g, color1.rgb.b );
            } else {
                gradient_shades( colors_dom, color1.rgb.r, color1.rgb.g, color1.rgb.b, color2.rgb.r, color2.rgb.g, color2.rgb.b );

                const first_color = `rgb(${color1.rgb.r}, ${color1.rgb.g}, ${color1.rgb.b})`;
                const last_color = `rgb(${color2.rgb.r}, ${color2.rgb.g}, ${color2.rgb.b})`;
                
                gradient = document.createElement("div");
                gradient.setAttribute("class", "gradient"); 
                gradient.setAttribute("style",
                    `background:-webkit-linear-gradient( left, ${first_color}, ${last_color} )`,
                    `background:-moz-linear-gradient( left, ${first_color}, ${last_color} )`,
                    `background:linear-gradient( left, ${first_color}, ${last_color} )`
                );
            }

            let active_color = colors_dom[4];

            colors_dom.forEach( color_el => {
                const { red, green, blue } = color_el;
                const shade_tint_color = new Color( { r : red, g : green, b : blue } );

                color_el.style.backgroundColor = `rgb(${ shade_tint_color.rgb.r }, ${ shade_tint_color.rgb.g }, ${ shade_tint_color.rgb.b })`;
                color_el.classList.remove( "clicked" );

                color_el.addEventListener( "click", () => {
                    active_color.classList.remove( "clicked" );
                    active_color = color_el;
                    active_color.classList.add( "clicked" );
                    create_labels(active_color, shade_tint_color);
                });
            });


            const grad_middle = new Color( { r : colors_dom[4].red, g : colors_dom[4].green, b : colors_dom[4].blue } );
            
            create_labels( active_color, grad_middle );
            active_color.classList.add( "clicked" ); 

            palette.classList.remove("section-hidden");
        

        return container;
    }
}

class Color {
    constructor( rgb ) {

        const rgb_to_hex = ( red, green, blue ) => {
            red = parseInt( red ).toString( 16 );
            green = parseInt( green ).toString( 16 );
            blue = parseInt( blue ).toString( 16 );
            
            red.length == 1 && ( red = "0" + red ); 
            green.length == 1 && ( green = "0" + green ); 
            blue.length == 1 && ( blue = "0" + blue ); 

            return red + green + blue;
        }

        const get_cmyk = ( red, green, blue ) => {
            const cmy = {
                cyan: ( red === 0 ) ? 100 : ( 1 - ( red / 255 ) ),
                magenta: ( green === 0 ) ? 100 : ( 1 - ( green / 255 ) ),
                yellow: ( blue === 0 ) ? 100 : ( 1 - ( blue / 255 ) )
            };

            const minimum = Math.min( cmy.cyan, cmy.magenta, cmy.yellow );
            const black = ( red === 0 && green === 0 && blue === 0 ) ? 100 : Math.round( minimum * 100 );

            Object.keys( cmy ).forEach( function( color_type ) {
                cmy[ color_type ] = ( red === 0 && green === 0 && blue === 0 ) ? 0 : Math.round( ( cmy[ color_type ] - minimum ) / ( 1 - minimum ) * 100 );
            });


            return {
                c : cmy.cyan,
                m : cmy.magenta,
                y : cmy.yellow,
                k : black
            };
        }

        const hsl = get_hsl( rgb.r, rgb.g, rgb.b );

        return {
            hex : rgb_to_hex( rgb.r, rgb.g, rgb.b ),
            hsl : hsl,
            cmyk : get_cmyk(rgb.r, rgb.g, rgb.b),
            rgb : rgb
        };
    }
}

function color_palette( colors ) {

    const colors_section = document.querySelector( "section#colors_section" );
    const color1 = new Color( colors[0] );
    const color2 = new Color( colors[1] );

    const comp1 = new Color( complement( color1.rgb ) );  
    const comp2 = new Color( complement( color2.rgb ) );

    const triad1 = new Color( triadic_one( color1.rgb ) );
    const triad2 = new Color( triadic_two( color1.rgb ) );

    const tetrad1 = new Color( tetrad( color1.rgb, 1 ) );
    const tetrad2 = new Color( tetrad( color1.rgb, 2 ) );

    const cp = "color_palette";
    const gp = "gradient_palette";

    const palette_type = colors[1].r == null && cp || gp;

    colors_section.classList.remove("section-hidden");

    const palettes_dom = [
        { color1 : color1, color2 : null, type: cp, section : cp, title : "Color" },
        { color1 : comp1, color2 : null, type: cp, section : cp, title : "Complement" },

        { color1 : triad1, color2 : null, type: cp, section : cp, title : "Triadic" },
        { color1 : triad2, color2 : null, type: cp, section : cp, title : null },

        { color1 : tetrad1, color2 : null, type: cp, section : cp, title : "Tetradic" },
        { color1 : tetrad2, color2 : null, type: cp, section : cp, title : null },
        { color1 : comp1, color2 : null, type: cp, section : cp, title : null },
    
        { color1 : color1, color2 : color2, type: gp, section : gp, title : "Gradient" },
        { color1 : color1, color2 : null, type: cp, section : gp, title : null },
        { color1 : color2, color2 : null, type: cp, section : gp, title : null },

        { color1 : comp1, color2 : comp2, type: gp, section : gp, title : "Complement" },
        { color1 : comp1, color2 : null, type: cp, section : gp, title : null },
        { color1 : comp2, color2 : null, type: cp, section : gp, title : null }
    ].filter( ( p ) => p.section === palette_type );
    
    let reset = (document.querySelector("div.container") !== null);

    if ( reset && palette_type !== document.querySelector( ".palette" ).classList[ 0 ] ) {
        reset = false;
        colors_section.innerHTML = "";
    }

    palettes_dom.forEach( (p, index) => {
        new Palette( p, index, p.color1, p.color2, p.type, reset );
    });
}

const take_input = ( input_type ) => {
    const input_fields = document.getElementById( input_type ).querySelectorAll(".color_input");
    const inputs = [];

    input_fields.forEach( ( field ) => {
        inputs.push( field.value );
    });

    return inputs;
}

const input_to_colors = ( inputs ) => {
    const inputs_array = inputs.inputs;
    const colors = [];

    inputs_array.forEach( input => {
        const hex = input.hex;
        const rgb = input.rgb;
        input = input.input;
        if ( hex ) {
            // Remove hash symbol, if present
            const hex = input.startsWith('#') ? input.slice(1) : input;
            
            // If input is 3 characters, duplicate each character to get 6-character hex
            const fullHex = hex.length === 3 ? hex.split('').map(char => char + char).join('') : hex;
            
            // Convert hex to decimal values
            const red = parseInt(fullHex.slice(0, 2), 16);
            const green = parseInt(fullHex.slice(2, 4), 16);
            const blue = parseInt(fullHex.slice(4, 6), 16);
            
            // Return RGB values as an object
            colors.push( { r: red, g: green, b: blue } );
        } else {
            const numbers = input.match(/\d+/g);
            const r = parseInt(numbers[0]);
            const g = parseInt(numbers[1]);
            const b = parseInt(numbers[2]);

            colors.push( { r, g, b } );
        }
    });
    
    ( !colors[1] ) && ( colors.push( { r : null, g : null, b : null } ) );

    return colors;
}

const validate_inputs = ( input_array, slide ) => {
    const hex_re = /^#?([0-9A-F]{3}){1,2}$/i;
    const rgb_re = /^(rgb)?\(?([01]?\d\d?|2[0-4]\d|25[0-5])((\,)|(\ )|(\,( )))([01]?\d\d?|2[0-4]\d|25[0-5])((\,)|(\ )|(\,( )))(([01]?\d\d?|2[0-4]\d|25[0-5])\)?)$/;

    const valid = input_array
        .map( input => {
            const hex = hex_re.test( input );
            const rgb = rgb_re.test( input );
            return { input, hex, rgb };
        })
        .filter( ( { hex, rgb } ) => !( hex || rgb ) )
        .reduce( ( acc, { input }, index ) => {
            return acc + ( index > 0 ? ', ' : '' ) + input;
        }, '' );

    const expected_length = { "search_slide": 1, "blend_slide": 2 }[ slide ];
    const valid_length = input_array.length === expected_length;

    return {
        valid : valid === '' && valid_length,

        inputs : input_array.map( input => ( { 
            input, hex: hex_re.test( input ), rgb : rgb_re.test( input ) 
        }))
    };
};

const reset_fields = () => {
    const search_inputs = document.querySelectorAll("div#search_slide input");
    const blend_inputs = document.querySelectorAll("div#blend_slide input");

    //  Reset input fields when user begins typing 
    //  on a different slide
    search_inputs.forEach( s_input => {
        s_input.addEventListener("change", function () {
            blend_inputs.forEach( b_input => {
                b_input.value = "";
            });
        });
    });
    blend_inputs.forEach( b_input => {
        b_input.addEventListener("change", function () {
            search_inputs.forEach( s_input => {
                s_input.value = "";
            });
        });
    });
}

const error_message = ( code, slide ) => {
    const error_dom = document.getElementById("error_message");

    switch ( code ) {
        case "search_invalid":
            error_dom.style.opacity = 1;
            error_dom.innerHTML = "Please enter a valid color code.";
            break;
        case "search_empty":
            error_dom.style.opacity = 1;
            error_dom.innerHTML = "Please enter a color code.";
            break;
        case "blend_invalid":
            error_dom.style.opacity = 1;
            error_dom.innerHTML = "Please enter two valid color codes.";
            break;
        case "blend_empty":
            error_dom.style.opacity = 1;
            error_dom.innerHTML = "Please enter two color codes.";
            break;
        default:
            error_dom.style.opacity = 0;
    }
}

const handle_input = ( field ) => {
    const colors = [];

    if ( field.type === "search") {

        const slide = field.slide;

        if ( field.value ) {   
            const input_array = take_input( slide );
            const valid = validate_inputs( input_array, slide );

            if ( valid.valid ) {
                colors.push(...input_to_colors( valid ));
                color_palette( colors );
                scroll();
            } else {
                console.log("error: input invalid");
            }
        } else {
            console.log(slide);
            console.log("error: nothing there");
        }


    } else {
        colors.push({
            r: ~~( Math.random() * 255 ),
            g: ~~( Math.random() * 255 ),
            b: ~~( Math.random() * 255 ),
        });

        if (field.number === 2) {
            colors.push({
                r: ~~( Math.random() * 255 ),
                g: ~~( Math.random() * 255 ),
                b: ~~( Math.random() * 255 ),
            });
        } else {
            colors.push( { r : null, g : null, b : null } );
        }

        color_palette( colors );
        scroll();
    }
};
    
function init() {
    const input_fields = document.querySelectorAll("input.color_input");

    document.querySelector("section#colors_section").classList.add("section-hidden");

    const slide_name = ( field ) => {
        const slide = field.closest( ".slide" );
        return slide ? slide.id : field.parentNode.id;
    };

    const buttons = [
        {   dom : document.getElementById("search_button"), 
            type : "search", number : 1 },
        {   dom : document.getElementById("blend_button"), 
            type : "search", number : 2 },
        {   dom : document.getElementById("random_button"), 
            type : "random", number : 1 },
        {   dom : document.getElementById("random_gradient"), 
            type : "random", number : 2 }
    ];

    buttons.forEach( ( button ) => {
        button.dom.addEventListener("click", function() {

            button.slide = slide_name( button.dom );
            handle_input( button );
            input_fields.forEach( field => { field.value = "" } );

        });
    });

    input_fields.forEach(field => {
        field.addEventListener("keydown", event => {
            let key = event.charCode || event.keyCode;
            if (key === 13) {

                field.slide = slide_name( field );
                field.type = "search";

                handle_input( field );
                field.value = "";
            }
        });
    });

    reset_fields();
    error_message( "hide" );
}

init();

});
