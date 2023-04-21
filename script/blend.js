/*	  _,  _, __, _ __, ___   __,  _,
	 (_  / ` |_) | |_)  |   , |  (_
	 ,_) \_, | \ | |    | , (_|  ,_)
	 ///////////////////////////////
*/

document.addEventListener("DOMContentLoaded", function(event) {
    
// Generate random
// hexadecimal value
function hex_rand() {
	let hex = "";
	const hex_values = [ 
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
		"A", "B", "C", "D", "E", "F" 
    ];

	for ( let i = 0; i < 6; i++ ) {
		let rand = Math.floor( Math.random() * 16 );
        
		hex += hex_values[ rand ];
	}

	return hex;
}
    
const hex_to_rgb = ( hex ) => {
    ( hex.length == 3 ) && ( hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] );
    
    return {
        r : parseInt( hex.substring( 0, 2 ), 16 ),
        g : parseInt( hex.substring( 2, 4 ), 16 ),
        b : parseInt( hex.substring( 4, 6 ), 16 )
    };
}

function rgb_to_hex(red, green, blue) {
    red = parseInt(red).toString(16);
    green = parseInt(green).toString(16);
    blue = parseInt(blue).toString(16);
    
    red.length == 1 && (red = "0" + red); 
    green.length == 1 && (green = "0" + green); 
    blue.length == 1 && (blue = "0" + blue); 

    return red + green + blue;
}

// // // // // // // // // //

const triadic_one = ( red, green, blue ) => ( { r : green, g : blue, b : red } );
const triadic_two = ( red, green, blue ) => ( { r : blue, g : red, b : green } );

function complement( red, green, blue ) {
	let r = 0, g = 0, b = 0;

    ( red > blue ) && (
        ( red > green ) ? (
            green > blue && ( r = blue, g = ( red - green ) + blue, b = red ),
            blue > green && ( r = green, g = red, b = ( red - blue ) + green ),
            green == blue && ( r = green, g = red, b = red )
        ) : ( red == green ) && (
            ( r = green, g = green, b = red )
        )
    );
    ( green > red ) && (
        ( green > blue ) ? (
            red > blue && ( r = ( green - red ) + blue, g = blue, b = green ),
            blue > red && ( r = green, g = red, b = ( green - blue ) + red ),
            blue == red && ( r = green, g = red, b = green )
        ) : ( green == blue ) && ( 
            (r = green, g = red, b = red )
        )
    );
    ( blue > red ) && (
        ( blue > green ) ? (
            red > green && ( r = (green - red) + blue, g = blue, b = green ),
            green > red && ( r = blue, g = (blue - green) + red, b = red ),
            green == red && ( r = blue, g = blue, b = red )
        ) : ( blue == green ) && (
            ( r = green, g = red, b = red )
        )
    );
	( red == blue && red == green ) && ( r = 255 - red, g = 255 - green, b = 255 - blue );

	return {
        r : r,
        g : g,
        b : b
    };
}
    
function get_cmyk( red, green, blue ) {
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

const scroll = () => {
    const header = document.querySelector("section#blend_page");
    const search_container = document.querySelector("section#blend_section");
    const scroll_y = header.offsetHeight + search_container.offsetHeight;
    
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
    
function create_labels(color) {
    const hex_label = "HEX: ";
    const rgb_label = "RGB: ";
    const cmyk_label = "CMYK: ";
    
    //    Select info box for exact clicked element
    const color_about = color.parentNode.parentNode.querySelector("div.about");
    
    const info_active_color = color_about.querySelector("div.active_color");
    const info_table = color_about.querySelector("table.info");
    
    info_table.querySelector("td.hex_label").innerHTML = hex_label;
    info_table.querySelector("td.rgb_label").innerHTML = rgb_label;
    info_table.querySelector("td.cmyk_label").innerHTML = cmyk_label;
    
    info_table.querySelector("td.hex_value").innerHTML = `#${color.hex}`;
    info_table.querySelector("td.rgb_value").innerHTML = color.info_rgb;
    info_table.querySelector("td.cmyk_value").innerHTML = color.info_cmyk;
    
    info_active_color.style.backgroundColor = color.style.backgroundColor;
}
    
class Palette {
	constructor( palette, r1, g1, b1, r2, g2, b2 ) {
		let colors = palette.children;

        if ( palette.parentElement.classList.contains("color_container") ) {
            shades_tints(colors, r1, g1, b1);
        } else {
            gradient_shades(colors, r1, g1, b1, r2, g2, b2)
            
            const gradient = palette.parentElement.querySelector("div.gradient");

            const first_color = `rgb(${r1}, ${g1}, ${b1})`;
            const last_color = `rgb(${r2}, ${g2}, ${b2})`;

            gradient.setAttribute("style",
                `background:-webkit-linear-gradient( left, ${first_color}, ${last_color} )`,
                `background:-moz-linear-gradient( left, ${first_color}, ${last_color} )`,
                `background:linear-gradient( left, ${first_color}, ${last_color} )`
            );
        }
        
        let active_color = colors[4];

        Array.from(colors).forEach(color => {
            color.hex = rgb_to_hex(color.red, color.green, color.blue);
            color.info_rgb = `${color.red}, ${color.green}, ${color.blue}`;
            color.info_cmyk = get_cmyk(color.red, color.green, color.blue);
            color.info_cmyk = `${color.info_cmyk.c}, ${color.info_cmyk.m}, ${color.info_cmyk.y}, ${color.info_cmyk.k}`;
            color.style.backgroundColor = `rgb(${color.red}, ${color.green}, ${color.blue})`;
            color.classList.remove("clicked");
            
            color.addEventListener("click", function() {
                active_color.classList.remove("clicked");
                active_color = color;
                active_color.classList.add("clicked");
                create_labels(active_color);
            });
        });
        
        create_labels(active_color);
        active_color.classList.add("clicked");
	};
}
    
function color_palette(red, green, blue) {
    const main = document.getElementById("main_color_palette");
    const triad_one = document.getElementById("triadic_palette_one");
    const triad_two = document.getElementById("triadic_palette_two");
    const complement_palette = document.getElementById("complement_palette");
    
    const triad_one_value = triadic_one(red, green, blue);
    const triad_two_value = triadic_two(red, green, blue);
    const comp = complement(red, green, blue);
    
    new Palette(main, red, green, blue);
    new Palette(triad_one, triad_one_value.r, triad_one_value.g, triad_one_value.b);
    new Palette(triad_two, triad_two_value.r, triad_two_value.g, triad_two_value.b);
    new Palette(complement_palette, comp.r, comp.g, comp.b);
}

const show_hide_sections = ( containers_show, containers_hide ) => {
    document.querySelector("section#colors_section").classList.remove("section-hidden");
    containers_show.forEach(container => {
        container.classList.remove("section-hidden");
    });
    
    containers_hide.forEach(container => {
        container.classList.add("section-hidden");
    });
}

const input_to_colors = ( input, color_type ) => {
    let rgb = { r : null, g : null, b : null };

    if ( color_type == "hex" ) {
        input = input.replace( /[^a-z0-9]/gi, '' );
        rgb = hex_to_rgb( input );
    }
    else {
        input = input.match( /\d+/g ).map( Number );
        Object.keys( rgb ).forEach( function ( key, index ) {
            rgb[key] = input[index];
        });
    }

    return rgb;
}
    
function begin( input_type, button ) {
    const color_containers = document.querySelectorAll(".color_container");
    const gradient_palette = document.getElementById("gradient_palette");
    const gradient_container = document.querySelectorAll(".gradient_container");
    const inputs = document.getElementById(input_type).querySelectorAll(".color_input");

    const hex_re = /^#?([0-9A-F]{3}){1,2}$/i;
    const rgb_re = /^(rgb)?\(?([01]?\d\d?|2[0-4]\d|25[0-5])((\,)|(\ )|(\,( )))([01]?\d\d?|2[0-4]\d|25[0-5])((\,)|(\ )|(\,( )))(([01]?\d\d?|2[0-4]\d|25[0-5])\)?)$/;
    const validate_input = ( input, hex_re, rgb_re ) => ( input.match( hex_re ) || input.match( rgb_re ) );

    let color_type;
    let colors = {};
    let blend;
    let invalid_code = "";

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
        if ( button.getAttribute("id") == "random_button" ) {
            blend = false;
            colors[0] = hex_to_rgb( hex_rand() );
        } else {
            blend = true;
            colors[0] = hex_to_rgb( hex_rand() );
            colors[1] = hex_to_rgb( hex_rand() );
        }
    }

    if ( invalid_code == "" ) {
        if ( blend ) {
            new Palette( gradient_palette, colors[0].r, colors[0].g, colors[0].b, 
            colors[1].r, colors[1].g, colors[1].b );
            show_hide_sections( gradient_container, color_containers );
            scroll();
        } else {
            color_palette( colors[0].r, colors[0].g, colors[0].b );
            show_hide_sections( color_containers, gradient_container );
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
    const color_palettes = document.querySelectorAll("div.palette_container");
    const buttons = [
        document.getElementById("search_button"),
        document.getElementById("blend_button"),
        document.getElementById("random_button"),
        document.getElementById("random_gradient")
    ];

    //  Hide all palettes
    //  Hide the section that shows the palettes
    color_palettes.forEach(palette => {
        palette.classList.add("section-hidden");
    });
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
