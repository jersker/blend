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

const complement = ( red, green, blue ) => {
	return {
        r : Math.max( red, blue, green ) + Math.min( red, blue, green ) - red,
        g : Math.max( red, blue, green ) + Math.min( red, blue, green ) - green,
        b : Math.max( red, blue, green ) + Math.min( red, blue, green ) - blue
    };
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

    const color_about = active_color.getRootNode().querySelector("div.about");
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
        const hex = rgb_to_hex( rgb.r, rgb.g, rgb.b )
        const cmyk = get_cmyk( rgb.r, rgb.g, rgb.b );
        const hsl = get_hsl( rgb.r, rgb.g, rgb.b );

        return {
            hex : hex,
            hsl : hsl,
            cmyk : cmyk,
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

class Palette extends HTMLElement {
	constructor( palette, color1, color2, title, class_type, container ) {

        super();

        const shadow = this.attachShadow( { mode: "open" } );

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
            <div class="color"><span></span></div>
            <div class="color"><span></span></div>
            <div class="color"><span></span></div>
            <div class="color"><span></span></div>

            <div class="color"><span></span></div>

            <div class="color"><span></span></div>
            <div class="color"><span></span></div>
            <div class="color"><span></span></div>
            <div class="color"><span></span></div>
        `;

        const main_margin = "1em";
        const main_padding = "1em";
        const main_radius = "8px";

        const blend_color_one_light = "rgb(138, 235, 171)";
        const blend_color_two_light = "rgb(217, 181, 253)";

        const colors_dom = palette.querySelectorAll("div.color");

        if ( class_type == "color_palette" ) {
            shades_tints( colors_dom, color1.rgb.r, color1.rgb.g, color1.rgb.b );
        } else {
            gradient_shades( colors_dom, color1.rgb.r, color1.rgb.g, color1.rgb.b, color2.rgb.r, color2.rgb.g, color2.rgb.b );

            const first_color = `rgb(${color1.rgb.r}, ${color1.rgb.g}, ${color1.rgb.b})`;
            const last_color = `rgb(${color2.rgb.r}, ${color2.rgb.g}, ${color2.rgb.b})`;
            
            const gradient = document.createElement("div");
            gradient.setAttribute("class", "gradient"); 
            gradient.setAttribute("style",
                `background:-webkit-linear-gradient( left, ${first_color}, ${last_color} )`,
                `background:-moz-linear-gradient( left, ${first_color}, ${last_color} )`,
                `background:linear-gradient( left, ${first_color}, ${last_color} )`
            );

            title_h2.innerHTML = "Gradient";
            shadow.appendChild( gradient );
        }

        let grad_middle;

        const style_palette = ( active_color ) => {
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
                grad_middle = new Color( { r : colors_dom[4].red, g : colors_dom[4].green, b : colors_dom[4].blue } );
            });
        }

        const style = document.createElement("style");
        style.textContent = `
            h2 {
                width:auto;
                color:@blend_color_two_light;
                
                display:flex;
                align-items:center;
                justify-content:center;
            }

            h2:before {
                background:-webkit-linear-gradient(left, ${blend_color_one_light}, ${blend_color_two_light});
                background:-moz-linear-gradient(left, ${blend_color_one_light}, ${blend_color_two_light});
                background:linear-gradient(to right, ${blend_color_one_light}, ${blend_color_two_light});
                margin-right:${main_margin};
            }
            h2:after {
                background:-webkit-linear-gradient(right, ${blend_color_one_light}, ${blend_color_two_light});
                background:-moz-linear-gradient(right, ${blend_color_one_light}, ${blend_color_two_light});
                background:linear-gradient(to left, ${blend_color_one_light}, ${blend_color_two_light});
                
                margin-left:${main_margin};
            }

            h2:before,
            h2:after {
                content:"";
                height:2px;
                flex-grow:1;
            }

            div.color_palette, div.gradient_palette {
                height:0px;
                overflow:hidden;

                display:-webkit-box;
                display:-webkit-flex;
                display:-ms-flexbox;
                display:flex;

                margin:calc(${main_margin} / 2) 0;

                -webkit-transition:height 0.5s, opacity 0.5s;
                -moz-transition:height 0.5s, opacity 0.5s;
                -ms-transition:height 0.5s, opacity 0.5s;
                -o-transition:height 0.5s, opacity 0.5s;
                transition:height 0.5s, opacity 0.5s;
            }
            div.color {
                cursor:pointer;
                width:50px;
                height:70px;
                border-radius:${main_radius};
                margin:calc(${main_margin}/8);
                flex-grow:1;
                box-shadow:1px 1px 0 rgba(255, 255, 255, 0.2) inset, -1px -1px black inset, 1px 1px black;
                -webkit-transition:width 0.5s, background-color 0.5s;
                -moz-transition:width 0.5s, background-color 0.5s;
                -ms-transition:width 0.5s, background-color 0.5s;
                -o-transition:width 0.5s, background-color 0.5s;
                transition:width 0.5s, background-color 0.5s;
            }

            div.about {
                display:flex;
                align-items:center;
                justify-content:space-between;
            }
            div.active_color {
                width:28%;
                height:120px;
                border:1px solid rgba(255, 255, 255, 0.3);
                border-radius:${main_radius};
                
                display:flex;
                align-items:end;
                justify-content:center;
                margin-right:${main_margin};
                
                -webkit-transition:background-color 0.5s;
                -moz-transition:background-color 0.5s;
                -ms-transition:background-color 0.5s;
                -o-transition:background-color 0.5s;
                transition:background-color 0.5s;
            }
            table.info {
                width:70%;
                color:lightgray;
                background-color:rgba(0, 0, 0, 0.2);
                border:1px solid rgba(255, 255, 255, 0.3);
                border-radius:${main_radius};

                text-transform:uppercase;
                border-spacing:calc(${main_margin} / 2);
            }

            table.info td {
                text-align:left;
                font-weight:bold;
            }
                
            table.info td.hex_label,
            table.info td.rgb_label,
            table.info td.cmyk_label {
                width:30%;  
            }

            div.show_palette_button {
                cursor:pointer;
                width:100%;
                color:#333;
                background-color:rgba(255, 255, 255, 0.6);
                border:1px solid rgba(255, 255, 255, 0.8);
                border-radius:0 0 ${main_radius} ${main_radius};

                display:flex;
                align-items:center;
                justify-content:space-around;

                padding:calc( ${main_padding}/2 );
                font-weight:bold;
                text-align:center;
            }

            span.show_palette_arrow {
                display:inline-block;
                transform:rotate(-180deg);

                -webkit-transition:all 0.5s;
                -moz-transition:all 0.5s;
                -ms-transition:all 0.5s;
                -o-transition:all 0.5s;
                transition:all 0.5s;
            }

            div.gradient {
                width:100%;
                height:100px;
                border:1px solid #666;
                border-radius:${main_radius};
                margin-bottom:${main_margin};

                -webkit-transition:all 0.5s;
                -moz-transition:all 0.5s;
                -ms-transition:all 0.5s;
                -o-transition:all 0.5s;
                transition:all 0.5s;
            }

            .clicked {
                width:140px !important;
            }
        `;

        show_palette_button.addEventListener("click", function() {
            if (!palette.style.height || palette.style.height == '0px') { 
                palette.style.height = "74px";
                show_palette_arrow.style.transform = "rotate(0deg)";
            } else {
                palette.style.height = '0px';
                show_palette_arrow.style.transform = "rotate(-180deg)";
            }
        });

        let active_color = colors_dom[4];
        style_palette(active_color);
        shadow.appendChild( style );

        if ( title !== null ) {
            shadow.appendChild( title_h2 );
        }
        shadow.appendChild( about );

        if ( title == "Color" || title == "Gradient" ) {
            palette.style.height = "70px";
            palette.style.marginTop = main_margin;
            palette.style.marginBottom = main_margin;
        } else {
            active_color_div.appendChild( show_palette_button );
        }

        shadow.appendChild( palette );        

        create_labels( active_color, grad_middle );
        active_color.classList.add( "clicked" ); 
	};
}

function color_palette( red1, green1, blue1, red2, green2, blue2, class_type ) {

    let palettes_dom;

    palettes_dom = [
        {   title: "Color",
            color1: new Color( { r : red1, g : green1, b : blue1 } ),
            color2: new Color( { r : red2, g : green2, b : blue2 } ),
        }
    ];

    if ( class_type == "color_palette" ) {
        palettes_dom.push(
            {   title: "Complement",
                color1: new Color( complement( red1, green1, blue1 ) ),
                color2: null
            }, 
            {   title: "Triadic",
                color1: new Color( triadic_one( red1, green1, blue1 ) ),
                color2: null
            }, 
            {   title: null,
                color1: new Color( triadic_two( red1, green1, blue1 ) ),
                color2: null
            }, 
            {   title: "Tetradic",
                color1: new Color( tetrad( red1, green1, blue1, 1 ) ),
                color2: null
            }, 
            {   title: null,
                color1: new Color( tetrad( red1, green1, blue1, 2 ) ),
                color2: null
            }
        );
    }

    const do_colors = ( class_type ) => {
        let container;

        palettes_dom.forEach( p => {
            if ( p.title !== null ) {
                container = document.createElement("div");
                container.setAttribute("class", "container");

                document.querySelector( "section#colors_section" ).appendChild( container );

                container.appendChild(
                    new Palette( document.createElement("div"), p.color1, p.color2, p.title, class_type, container ) 
                );

                if ( class_type == "gradient_palette" ) {
                    class_type = "color_palette";
                    container.appendChild(
                        new Palette( document.createElement("div"), p.color1, null, null, class_type, container ) 
                    );
                    container.appendChild(
                        new Palette( document.createElement("div"), p.color2, null, null, class_type, container ) 
                    );
                }

            } else {
                container.appendChild(
                    new Palette( document.createElement("div"), p.color1, p.color2, p.title, class_type, container ) 
                );
                container.appendChild(
                    new Palette( document.createElement("div"), palettes_dom[0].color1, p.color2, p.title, class_type, container ) 
                );
            }
        });
    }

    if ( !customElements.get( "new-palette" ) ) {   
        customElements.define( "new-palette", Palette );
        do_colors( class_type );
    } else {
        document.querySelector( "section#colors_section" ).style.opacity = 0;
        
        setTimeout( function() { 
            document.querySelector( "section#colors_section" ).innerHTML = '';
            do_colors( class_type );
            document.querySelector( "section#colors_section" ).style.opacity = 1;
        }, 100 ); 
    }
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
            rgb[ key ] = input[ index ];
        });
    }

    return rgb;
}
    
function begin( input_type, button ) {
    const color_containers = document.querySelectorAll(".palette_container");
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
            class_type = "gradient_palette";
            color_palette( colors[0].r, colors[0].g, colors[0].b, colors[1].r, colors[1].g, colors[1].b, class_type );
            show_hide_sections( gradient_palette, color_containers );
            scroll();
        } else {
            class_type = "color_palette";
            color_palette( colors[0].r, colors[0].g, colors[0].b, null, null, null, class_type );
            show_hide_sections( color_containers, gradient_palette );
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
