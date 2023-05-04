/*	  _,  _, __, _ __, ___   __,  _,
	 (_  / ` |_) | |_)  |   , |  (_
	 ,_) \_, | \ | |    | , (_|  ,_)
	 ///////////////////////////////
*/

document.addEventListener("DOMContentLoaded", function() {

// // // // // // // // // //

const triadic_one = ( red, green, blue ) => ( { r : green, g : blue, b : red } );
const triadic_two = ( red, green, blue ) => ( { r : blue, g : red, b : green } );

const complement = ( red, green, blue ) => {
	return {
        r : Math.max( red, blue, green ) + Math.min( red, blue, green ) - red,
        g : Math.max( red, blue, green ) + Math.min( red, blue, green ) - green,
        b : Math.max( red, blue, green ) + Math.min( red, blue, green ) - blue
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

const tetrad = ( red, green, blue, index ) => {
    let hsl = get_hsl( red, green, blue );
    let h = hsl.h, s = hsl.s, l = hsl.l;

    ( index == 1 ) ? h += 120.00 : h -= 60;
    ( h < 0 ) && ( h += 360 );

    let tet_rgb = hsl_to_rgb( h, s, l );

    return {
        r : tet_rgb.r,
        g : tet_rgb.g,
        b : tet_rgb.b
    };
}

const get_hsl = ( red, green, blue ) => {

    let r_perc = red / 255;
    let g_perc = green / 255;
    let b_perc = blue / 255;

    let rgb_max = Math.max( Math.max( r_perc, g_perc ), b_perc );
    let rgb_min = Math.min( Math.min( r_perc, g_perc ), b_perc );

    let h, s, l;

    switch( rgb_max ) {
        case r_perc: 
            h = ( g_perc - b_perc ) / ( rgb_max - rgb_min ) + ( g_perc < b_perc ? 6 : 0 ); 
            break;
        case g_perc: 
            h = ( b_perc - r_perc ) / ( rgb_max - rgb_min ) + 2; 
            break;
        case b_perc: 
            h = ( r_perc - g_perc ) / ( rgb_max - rgb_min ) + 4; 
            break;
    }

    h /= 6;

    l = ( rgb_max + rgb_min ) / 2;

    ( l < 1 ) ? ( s = ( rgb_max - rgb_min ) /  ( 1 - Math.abs( ( l * 2 ) - 1 ) ) ) : ( l == 1 ) && ( s = 0 );

    h *= 360;

    //  Black / White
    ( red == green && green == blue ) && ( 
        h = 0, s = 0,
        ( red == 0 ) && ( l = 0 ),
        ( red == 1 ) && ( l = 1 ) 
    );

    return {
        h : fixed_round(h, 4),
        s : fixed_round(s, 4),
        l : fixed_round(l, 4)
    };
}
    
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
            let cyan = 0, magenta = 0, yellow = 0;
            let cmy = { cyan, magenta, yellow };
            let rgb = [ red, green, blue ];
            let black = 100;
            let minimum = 0;
            
            if ( ! (red == 0 && green == 0 & blue == 0 ) ) {
                Object.keys(cmy).forEach(function (color_type, index) {
                    ( rgb[ index ] == 0 ) ? cmy[ color_type ] = 100 : cmy[ color_type ] = ( 1 - ( rgb[ index ] / 255 ) );
                });
                
                minimum = Math.min(cmy.cyan, cmy.magenta, cmy.yellow);
                
                Object.keys(cmy).forEach(function (color_type, index) {
                    ( rgb[ index ] == 0 ) ? cmy[ color_type ] = 100 : cmy[ color_type ] = Math.round( ( cmy[ color_type ] - minimum ) / ( 1 - minimum ) * 100 );
                });

                black = Math.round(minimum * 100);
            }

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

const fadeIn = (el, ms, callback) => {
    ms = ms || 400;
    const finishFadeIn = () => {
        el.removeEventListener('transitionend', finishFadeIn);
        callback && callback();
    };
    el.style.transition = 'opacity 0s';
    el.style.display = '';
    el.style.opacity = 0;
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
        el.addEventListener('transitionend', finishFadeIn);
        el.style.transition = `opacity ${ms/1000}s`;
        el.style.opacity = 1
        });
    });
};

const fadeOut = (el, ms, callback) => {
    ms = ms || 400;
    const finishFadeOut = () => {
        el.style.display = 'none';
        el.removeEventListener('transitionend', finishFadeOut);
        callback && callback();
    };
    el.style.transition = 'opacity 0s';
    el.style.opacity = 1;
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
        el.style.transition = `opacity ${ms/1000}s`;
        el.addEventListener('transitionend', finishFadeOut);
        el.style.opacity = 0;
        });
    });
};
/*

class Palette {
	constructor( palette, color1, color2, title, class_type ) {

        let container;

        function reset() {
            console.log(document.querySelectorAll("div.container"));
        }

            container = document.createElement("div");
            container.setAttribute("class", "container");

            const title_h2 = document.createElement("h2");
            title_h2.innerHTML = `${title}`;

            const about = document.createElement("div");
            about.setAttribute("class", "about");
            about.innerHTML = `
                <table class="info">
                    <tr><td class="hex_label"></td><td class="hex_value"></td></tr>
                    <tr><td class="rgb_label"></td><td class="rgb_value"></td></tr>
                    <tr><td class="cmyk_label"></td><td class="cmyk_value"></td></tr>
                    <tr><td class="hsl_label"></td><td class="hsl_value"></td></tr>
                </table>
            `;
            const active_color_div = document.createElement("div");
            active_color_div.setAttribute("class", "active_color");
            about.insertBefore(active_color_div, about.firstChild);

            const show_palette_button = document.createElement("div");
            show_palette_button.setAttribute("class", "show_palette_button");
            const show_palette_arrow = document.createElement("span");
            show_palette_arrow.setAttribute( "class", "show_palette_arrow" );
            show_palette_arrow.innerHTML = `▼`;
            show_palette_button.appendChild( show_palette_arrow );
            show_palette_button.appendChild( document.createTextNode( "Palette" ) );

            palette.setAttribute("class", "color_palette");
            palette.innerHTML = `
                <div class="color"></div>
                <div class="color"></div>
                <div class="color"></div>
                <div class="color"></div>

                <div class="color"></div>

                <div class="color"></div>
                <div class="color"></div>
                <div class="color"></div>
                <div class="color"></div>
            `;

            const colors_dom = palette.querySelectorAll("div.color");

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

            show_palette_button.addEventListener("click", function() {
                if (!palette.style.height || palette.style.height == '0px') { 
                    palette.style.height = "calc(74px + 1rem)";
                    palette.style.paddingTop = "1rem";
                    show_palette_arrow.style.transform = "rotate(0deg)";
                } else {
                    palette.style.height = "0px";
                    palette.style.paddingTop = "0";
                    show_palette_arrow.style.transform = "rotate(-180deg)";
                }
            });

            let active_color = colors_dom[4];
            
            Array.from( colors_dom ).forEach( color_el => {
                const shade_tint_color = new Color( {r : color_el.red, g : color_el.green, b : color_el.blue} );

                color_el.style.backgroundColor = `rgb( ${shade_tint_color.rgb.r}, ${shade_tint_color.rgb.g}, ${shade_tint_color.rgb.b} )`;
                color_el.classList.remove( "clicked" );
                
                color_el.addEventListener( "click", function() {
                    active_color.classList.remove( "clicked" );
                    active_color = color_el;
                    active_color.classList.add( "clicked" );
                    create_labels( active_color, shade_tint_color );
                });
            });

            const grad_middle = new Color( { r : colors_dom[4].red, g : colors_dom[4].green, b : colors_dom[4].blue } );

            ( title !== null && title !== undefined ) && ( container.appendChild( title_h2 ) );
            ( title == "Color" || class_type == "gradient_palette" ) ? (palette.style.height = "calc(74px + 1rem)", palette.style.paddingTop = "1rem") : active_color_div.appendChild( show_palette_button );
            ( class_type == "gradient_palette" ) && ( container.appendChild( gradient ) );

            container.appendChild( about );
            container.appendChild( palette );    

            create_labels( active_color, grad_middle );
            active_color.classList.add( "clicked" ); 

        return container;
	};
}

*/


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

            active_color_div = document.createElement("div");
            active_color_div.setAttribute("class", "active_color");
            about.insertBefore(active_color_div, about.firstChild);

            const show_palette_button = document.createElement("div");
            show_palette_button.setAttribute("class", "show_palette_button");
            const show_palette_arrow = document.createElement("span");
            show_palette_arrow.setAttribute( "class", "show_palette_arrow" );
            show_palette_arrow.innerHTML = `▼`;
            show_palette_button.appendChild( show_palette_arrow );
            show_palette_button.appendChild( document.createTextNode( "Palette" ) );

            palette = document.createElement("div");
            palette.classList.add(class_type);
            palette.classList.add("palette");
            
            palette.innerHTML = `
                <div class="color"></div>
                <div class="color"></div>
                <div class="color"></div>
                <div class="color"></div>

                <div class="color"></div>

                <div class="color"></div>
                <div class="color"></div>
                <div class="color"></div>
                <div class="color"></div>
            `;

            show_palette_button.addEventListener("click", function() {
                if (!palette.style.height || palette.style.height == '0px') { 
                    palette.style.height = "calc(74px + 1rem)";
                    palette.style.paddingTop = "1rem";
                    show_palette_arrow.style.transform = "rotate(0deg)";
                } else {
                    palette.style.height = "0px";
                    palette.style.paddingTop = "0";
                    show_palette_arrow.style.transform = "rotate(-180deg)";
                }
            });

            ( p.title !== null && p.title !== undefined ) && ( container.appendChild(title_h2) );
            ( p.title == "Color" || class_type == "gradient_palette" ) ? (palette.style.height = "calc(74px + 1rem)", palette.style.paddingTop = "1rem") : active_color_div.appendChild( show_palette_button );
            //( class_type == "gradient_palette" ) && ( container.appendChild( gradient ) );

            container.appendChild(about);
            container.appendChild(palette);
            colors_section.appendChild(container);

            } else {
                container = document.querySelectorAll(".container")[ index ];
                about = container.querySelector(".about");
                palette = container.querySelector(".palette");
            }

            const colors_dom = palette.querySelectorAll("div.color");

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
            
            Array.from( colors_dom ).forEach( color_el => {
                const shade_tint_color = new Color( {r : color_el.red, g : color_el.green, b : color_el.blue} );

                color_el.style.backgroundColor = `rgb( ${shade_tint_color.rgb.r}, ${shade_tint_color.rgb.g}, ${shade_tint_color.rgb.b} )`;
                color_el.classList.remove( "clicked" );
                
                color_el.addEventListener( "click", function() {
                    active_color.classList.remove( "clicked" );
                    active_color = color_el;
                    active_color.classList.add( "clicked" );
                    create_labels( active_color, shade_tint_color );
                });
            });

            const grad_middle = new Color( { r : colors_dom[4].red, g : colors_dom[4].green, b : colors_dom[4].blue } );
            
            create_labels( active_color, grad_middle );
            active_color.classList.add( "clicked" ); 

            palette.classList.remove("section-hidden");
        

        return container;
    }
}

function color_palette( red1, green1, blue1, red2, green2, blue2 ) {

    const colors_section = document.querySelector( "section#colors_section" );
    const color1 = new Color( { r : red1, g : green1, b : blue1 } );
    const color2 = new Color( { r : red2, g : green2, b : blue2 } );
    const comp1 = new Color( complement( red1, green1, blue1 ) );  
    const comp2 = new Color( complement( red2, green2, blue2 ) );
    const triad1 = new Color( triadic_one( red1, green1, blue1 ) );
    const triad2 = new Color( triadic_two( red1, green1, blue1 ) );
    const tetrad1 = new Color( tetrad( red1, green1, blue1, 1 ) );
    const tetrad2 = new Color( tetrad( red1, green1, blue1, 2 ) );

    const cp = "color_palette";
    const gp = "gradient_palette";

    const palette_type = red2 == null && cp || gp;

    const palettes_dom = [
        { color1 : color1, color2 : null, type: cp, section : cp, title : "Color" },
        { color1 : comp1, color2 : null, type: cp, section : cp, title : "Complement" },
        { color1 : triad1, color2 : null, type: cp, section : cp, title : "Triadic" },
        { color1 : triad2, color2 : null, type: cp, section : cp, title : null },
        { color1 : tetrad1, color2 : null, type: cp, section : cp, title : "Tetradic" },
        { color1 : tetrad2, color2 : null, type: cp, section : cp, title : null },
        { color1 : color1, color2 : color2, type: gp, section : gp, title : "Gradient" },
        { color1 : color1, color2 : null, type: cp, section : gp, title : null },
        { color1 : color2, color2 : null, type: cp, section : gp, title : null },
        { color1 : comp1, color2 : comp2, type: gp, section : gp, title : "Complement" },
        { color1 : comp1, color2 : null, type: cp, section : gp, title : null },
        { color1 : comp2, color2 : null, type: cp, section : gp, title : null }
    ].filter(( p ) => p.section === palette_type);
    
    let reset = (document.querySelector("div.container") !== null);

    if ( reset && palette_type !== document.querySelector( ".palette" ).classList[ 0 ] ) {
        reset = false;
        colors_section.innerHTML = "";
    }
    
    palettes_dom.forEach( (p, index) => {
        new Palette( p, index, p.color1, p.color2, p.type, reset );
    });
}

const input_to_colors = ( input, color_type ) => {
    const hex_to_rgb = ( hex ) => {
        ( hex.length == 3 ) && ( hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] );
        
        return {
            r : parseInt( hex.substring( 0, 2 ), 16 ),
            g : parseInt( hex.substring( 2, 4 ), 16 ),
            b : parseInt( hex.substring( 4, 6 ), 16 )
        };
    }

    let rgb = { r : null, g : null, b : null };

    if ( color_type == "hex" ) {
        input = input.replace( /[^a-z0-9]/gi, '' );
        rgb = hex_to_rgb( input );
    }
    else {
        input = input.match( /\d+/g ).map( Number );
        Object.keys( rgb ).forEach( function ( key, index ) {
            rgb[ key ] = input[ index ];
        });
    }

    return rgb;
}
    
function begin( input_type, button ) {
    const color_containers = document.querySelectorAll(".color_palette");
    const gradient_palette = document.querySelectorAll(".gradient_palette");
    const inputs = document.getElementById(input_type).querySelectorAll(".color_input");

    const hex_re = /^#?([0-9A-F]{3}){1,2}$/i;
    const rgb_re = /^(rgb)?\(?([01]?\d\d?|2[0-4]\d|25[0-5])((\,)|(\ )|(\,( )))([01]?\d\d?|2[0-4]\d|25[0-5])((\,)|(\ )|(\,( )))(([01]?\d\d?|2[0-4]\d|25[0-5])\)?)$/;
    const validate_input = ( input, hex_re, rgb_re ) => ( input.match( hex_re ) || input.match( rgb_re ) );

    let color_type;
    let colors = {};
    let blend;
    let invalid_code = "";
    let class_type;

    error_message( "hide" );

    if ( input_type != "random_slide" ) {

        ( input_type == "search_slide" ) ? blend = false : blend = true;
        
        inputs.forEach( ( field, index ) => {
            const input = field.value;
            
            if ( input ) {
                if ( validate_input( input, hex_re, rgb_re ) ) {
                    ( input.match( hex_re ) ) ? color_type = "hex" : color_type = "rgb";
                    colors[ index ] = input_to_colors( input, color_type );
                } else {
                    ( blend == true ) ? invalid_code = "blend_invalid" : invalid_code = "search_invalid";
                }
            } else {
                //  if not input
                ( blend == true ) ? invalid_code = "blend_empty" : invalid_code = "search_empty";
            }

        });

    } else {
        colors[0] = {
            r : ~~( Math.random() * 255 ),
            g : ~~( Math.random() * 255 ),
            b : ~~( Math.random() * 255 )
        };

        if ( button.getAttribute("id") == "random_gradient" ) {
            blend = true;
            colors[1] = {
                r : ~~( Math.random() * 255 ),
                g : ~~( Math.random() * 255 ),
                b : ~~( Math.random() * 255 )
            };
        }
    }

    if ( invalid_code == "" ) {
        if ( blend ) {
            color_palette( colors[0].r, colors[0].g, colors[0].b, colors[1].r, colors[1].g, colors[1].b );
            document.querySelector("section#colors_section").classList.remove("section-hidden");
            scroll();
        } else {
            color_palette( colors[0].r, colors[0].g, colors[0].b, null, null, null );
            document.querySelector("section#colors_section").classList.remove("section-hidden");
            scroll();
        }
    } else {
        error_message( invalid_code );
    }
}

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

const error_message = ( code ) => {
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
    
function init() {
    const input_fields = document.querySelectorAll("input.color_input");
    const color_palettes = document.querySelectorAll("div.color_palette");
    const buttons = [
        document.getElementById("search_button"),
        document.getElementById("blend_button"),
        document.getElementById("random_button"),
        document.getElementById("random_gradient")
    ];

    document.querySelector("section#colors_section").classList.add("section-hidden");

    const get_slide_name = ( field ) => {
        let slide;

        if ( field.parentNode.parentNode.getAttribute("class") == "slide" ) {
            slide = field.parentNode.parentNode.getAttribute("id");
        }
        else if ( field.parentNode.parentNode.parentNode.getAttribute("class") == "slide" ) {
            slide = field.parentNode.parentNode.parentNode.getAttribute("id");
        }
        else {
            slide = field.parentNode.getAttribute("id");
        }

        return slide;
    }
    
    //  Control input
    input_fields.forEach(field => {
        field.addEventListener("keydown", event => {
            let key = event.charCode || event.keyCode;
            //  Enter key
            if (key === 13) {
                const slide = get_slide_name( field );
                begin( slide, null );
                //  Clear all input
                input_fields.forEach(field => {
                    field.value = "";
                });
            }
        });
    });

    buttons.forEach(button => {
        let slide = button.parentNode.getAttribute("id");
        button.addEventListener("click", function() {
            begin( slide, button );
            //  Clear all input
            input_fields.forEach( field => {
                field.value = "";
            });
        });
    });

    reset_fields();

    error_message( "hide" );
}

init();

});
