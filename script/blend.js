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
	const hex_values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
		"A", "B", "C", "D", "E", "F"];

	for (let i = 0; i < 6; i++) {
		let rand = Math.floor(Math.random() * 16);
        
		hex += hex_values[rand];
	}

	return hex;
}
    
function hex_to_rgb( hex ) {
    if ( hex.length == 3 ) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
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
    
    if (red.length == 1) {
        red = "0" + red
    }
    if (green.length == 1) {
        green = "0" + green
    }
    if (blue.length == 1) {
        blue = "0" + blue
    }
    
    return red + green + blue;
}

// // // // // // // // // //
    
function triadic_one(red, green, blue) {
	return {
        r : green,
        g : blue,
        b : red
    };
}

function triadic_two(red, green, blue) {
	return {
        r : blue,
        g : red,
        b : green
    };
}

function complement(red, green, blue) {
	let r = 0;
	let g = 0;
	let b = 0;

	//	red highest value
	if (red > blue && red > green) {
		//	yellow
		if (green > blue) {
			r = blue;
			g = (red - green) + blue;
			b = red;
		}
		//	magenta
		if (blue > green) {
			r = green;
			g = red;
			b = (red - blue) + green;
		}
		if (green == blue) {
			r = green;
			g = red;
			b = red;
		}
	}
	//	green highest value
	if (green > red && green > blue) {
		//	yellow
		if (red > blue) {
			r = (green - red) + blue;
			g = blue;
			b = green;
		}
		//	cyan
		if (blue > red) {
			r = green;
			g = red;
			b = (green - blue) + red;
		}
		if (blue == red) {
			r = green;
			g = red;
			b = green;
		}
	}
	//	blue highest value
	if (blue > red && blue > green) {
		//	magenta
		if (red > green) {
			r = (green - red) + blue;
			g = blue;
			b = green;
		}
		//	cyan
		if (green > red) {
			r = blue;
			g = (blue - green) + red;
			b = red;
		}
		if (green == red) {
			r = blue;
			g = blue;
			b = red;
		}
	}
	//	red green highest
	if (red > blue && red == green) {
		r = green;
		g = green;
		b = red;
	}
	//	red blue highest
	if (red > green && red == blue) {
		r = green;
		g = red;
		b = green;
	}
	//	green blue highest
	if (green > red && green == blue) {
		r = green;
		g = red;
		b = red;
	}
	//	gray / white / black
	if (red == blue && red == green) {
		r = 255 - red;
		g = 255 - green;
		b = 255 - blue;
	}

	return {
        r : r,
        g : g,
        b : b
    };
}
    
function get_cmyk( red, green, blue ) {
    let cyan = 0, magenta = 0, yellow = 0;
    
    let cmy = {
        cyan, magenta, yellow
    };
    
    let rgb = [
        red,
        green,
        blue
    ];
    
    let black = 100;
	let minimum = 0;
    
    if ( ! (red == 0 && green == 0 & blue == 0 ) ) {
        
        Object.keys(cmy).forEach(function (color_type, index) {
            if (rgb[index] == 0) {
                cmy[color_type] = 100;
            }
            else {
                cmy[color_type] = (1 - (rgb[index] / 255));
            }
            
        });
        
        minimum = Math.min(cmy.cyan, cmy.magenta, cmy.yellow);
        
        Object.keys(cmy).forEach(function (color_type, index) {
            if (rgb[index] == 0) {
                cmy[color_type] = 100;
            }
            else {
                cmy[color_type] = Math.round((cmy[color_type] - minimum) / (1 - minimum) * 100);
            }
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

function scroll() {
    let header = document.querySelector("section#blend_page");
    let search_container = document.querySelector("section#blend_section");
    let scroll_y;
    scroll_y = header.offsetHeight + search_container.offsetHeight;
    
    window.scroll({
        top: scroll_y,
        behavior: 'smooth'
    });
}
 
function shades_tints(colors, red, green, blue) {
    const shades = Array.from(colors).slice(0,4);
    
    const red_shade = Math.floor( red / 5 );
    const green_shade = Math.floor( green / 5 );
    const blue_shade = Math.floor( blue / 5 );
    
    let red_s = red_shade;
    let green_s = green_shade;
    let blue_s = blue_shade;
    
    shades.forEach(s => {
        s.red = red_s;
        s.green = green_s;
        s.blue = blue_s;
        
        red_s += red_shade;
        green_s += green_shade;
        blue_s += blue_shade;
    });
    
    const tints = Array.from(colors).slice(5,9);
    
    const red_tint = Math.floor( (255 - red) / 5 );
    const green_tint = Math.floor( (255 - green) / 5 );
    const blue_tint = Math.floor( (255 - blue) / 5 );
    
    let red_t = red + red_tint;
    let green_t = green + green_tint;
    let blue_t = blue + blue_tint;
    
    tints.forEach(t => {
        t.red = red_t;
        t.green = green_t;
        t.blue = blue_t;
        
        red_t += red_tint;
        green_t += green_tint;
        blue_t += blue_tint;
    });
    
    colors[4].red = red;
    colors[4].green = green;
    colors[4].blue = blue;
}
    
function gradient_shades(colors, r1, g1, b1, r2, g2, b2) {

    const shades = Array.from(colors).slice(1,8);
    //    Get halfway values between colors A and B
    let r_step = Math.floor( (r1 + r2) / 2);
    let g_step = Math.floor( (g1 + g2) / 2);
    let b_step = Math.floor( (b1 + b2) / 2);

    for (let i = 0; i < 2; i++) {
        r_step = Math.floor((r_step + r1) / 2);
        g_step = Math.floor((g_step + g1) / 2);
        b_step = Math.floor((b_step + b1) / 2);
    }
    //    Convert all to positive values to get
    //    distance from zero
    r_step = Math.abs(r1 - r_step);
    g_step = Math.abs(g1 - g_step);
    b_step = Math.abs(b1 - b_step);
    
    colors[0].red = r1;
    colors[0].green = g1;
    colors[0].blue = b1;
    
    colors[8].red = r2;
    colors[8].green = g2;
    colors[8].blue = b2;
    
    shades.forEach(s => {
        if (r1 > r2) {
            r1 -= r_step;
        }
        else {
            r1 += r_step;
        }
        if (g1 > g2) {
            g1 -= g_step;
        }
        else {
            g1 += g_step;
        }
        if (b1 > b2) {
            b1 -= b_step;
        }
        else {
            b1 += b_step;
        }
        
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
    
    info_table.querySelector("td.hex_value").innerHTML = '#' + color.hex;
    info_table.querySelector("td.rgb_value").innerHTML = color.info_rgb;
    info_table.querySelector("td.cmyk_value").innerHTML = color.info_cmyk;
    
    info_active_color.style.backgroundColor = color.style.backgroundColor;
}
    
class Palette {
	constructor( palette, r1, g1, b1, r2, g2, b2 ) {
		let colors = palette.children;

        if ( palette.parentElement.classList.contains("color_container") ) {
            shades_tints(colors, r1, g1, b1);
        }
        else if ( palette.parentElement.classList.contains("gradient_container") ||
            palette.getAttribute("id") == "animation_palette" ) {
            gradient_shades(colors, r1, g1, b1, r2, g2, b2)
            
            const gradient = palette.parentElement.querySelector("div.gradient");
            const first_color = "rgb("+ r1 + "," + g1 + "," + b1 +")";
            const last_color = "rgb("+ r2 + "," + g2 + "," + b2 +")";
            
            gradient.setAttribute("style",
                "background:-webkit-linear-gradient(left, " + first_color + ', ' + last_color + ")",
                "background:-moz-linear-gradient(left, " + first_color + ', ' + last_color + ")",
                "background:linear-gradient(left, " + first_color + ', ' + last_color + ")"
            );
        }
        
        let active_color = colors[4];

        Array.from(colors).forEach(color => {
            color.hex = rgb_to_hex(color.red, color.green, color.blue);
            color.info_rgb = color.red + ", " + color.green + ", " + color.blue;
            color.info_cmyk = get_cmyk(color.red, color.green, color.blue);
            color.info_cmyk = color.info_cmyk.c + ", " + color.info_cmyk.m + ", " + color.info_cmyk.y + ", " + color.info_cmyk.k;
            color.style.backgroundColor = "rgb(" + color.red + "," + color.green + "," + color.blue + ")";
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
    
function show_hide_sections(containers_show, containers_hide) {
    
    document.querySelector("section#colors_section").classList.remove("section-hidden");
    containers_show.forEach(container => {
        container.classList.remove("section-hidden");
    });
    
    containers_hide.forEach(container => {
        container.classList.add("section-hidden");
    });
}
    
function main_animation() {
    const animation_palette = document.getElementById("animation_palette");
    const animation_colors = Array.from(animation_palette.children);
    
    const rgb1 = hex_to_rgb("15dc5a");
    const rgb2 = hex_to_rgb("9529f9");
    
    let active_color;
    
    new Palette(animation_palette, rgb1.r, rgb1.g, rgb1.b, rgb2.r, rgb2.g, rgb2.b);

    setInterval(function() {
        let random = Math.round( Math.random() * 8 );
        active_color = animation_colors[random];
        active_color.click();
    }, 2000);
}

function validate_input( input, hex_re, rgb_re ) {
    let valid = true;

    if ( input.match( hex_re ) || input.match( rgb_re ) ) {
        valid = true;
    }
    else {
        valid = false;
    }

    return valid;
}

function input_to_colors( input, color_type ) {
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
    
function begin( input_type ) {
    const color_containers = document.querySelectorAll(".color_container");
    const gradient_palette = document.getElementById("gradient_palette");
    const gradient_container = document.querySelectorAll(".gradient_container");

    const hex_re = /^#?([0-9A-F]{3}){1,2}$/i;
    const rgb_re = /^(rgb)?\(?([01]?\d\d?|2[0-4]\d|25[0-5])((\,)|(\ )|(\,( )))([01]?\d\d?|2[0-4]\d|25[0-5])((\,)|(\ )|(\,( )))(([01]?\d\d?|2[0-4]\d|25[0-5])\)?)$/;
    
    let color_type;
    let inputs = document.getElementById(input_type).querySelectorAll(".color_input");

    let colors = {};

    inputs.forEach( ( field, index ) => {
        let input = field.value;
        if ( input ) {
            if ( validate_input( input, hex_re, rgb_re ) ) {
                if ( input.match( hex_re ) ) {
                    color_type = "hex";
                }
                else if ( input.match( rgb_re ) ) {
                    color_type = "rgb";
                }

                colors[index] = input_to_colors( input, color_type );
            }
            else {
                console.log("error: not valid input");
            }
        }
        else {
            console.log("error");
        }
    });

    if ( input_type == "search_slide" ) {
        color_palette( colors[0].r, colors[0].g, colors[0].b );
        show_hide_sections( color_containers, gradient_container );
        scroll();
    }
    else {
        new Palette( gradient_palette, colors[0].r, colors[0].g, colors[0].b, 
        colors[1].r, colors[1].g, colors[1].b );
        show_hide_sections( gradient_container, color_containers );
        scroll();
    }
}
    
function start() {
    const input_fields = document.querySelectorAll("input.color_input");
    const search_inputs = document.querySelectorAll("div#search_slide input");
    const blend_inputs = document.querySelectorAll("div#blend_slide input");
    const color_palettes = document.querySelectorAll("div.palette_container");
    const landing_button = document.querySelectorAll("div.landing_button");
    const buttons = [
        document.getElementById("search_button"),
        document.getElementById("blend_button"),
        document.getElementById("random_button"),
        document.getElementById("random_gradient")
    ];
    
    main_animation();

    //  Hide all palettes
    //  Hide the section that shows the palettes
    color_palettes.forEach(palette => {
        palette.classList.add("section-hidden");
    });
    document.querySelector("section#colors_section").classList.add("section-hidden");
    
    //  Control input
    input_fields.forEach(field => {
        field.addEventListener("keydown", event => {
            let key = event.charCode || event.keyCode;
            
            //  Enter key
            if (key === 13) {
                //  Messy, but gets the button ID of the slide where enter was pressed
                begin( field.parentNode.parentNode.getAttribute("id") );
                //  Clear all input
                input_fields.forEach(field => {
                    field.value = "";
                });
            }
        });
    });
    
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


    //  todo: fix random buttons
    buttons.forEach(button => {
        button.addEventListener("click", function() {
            begin( this.parentNode.getAttribute("id") );
            //  Clear all input
            input_fields.forEach( field => {
                field.value = "";
            });
        });
    });

    landing_button.forEach(button => {
        button.addEventListener("click", function() {
            let scroll_y = blend_page.offsetHeight;
            window.scroll({
                top: scroll_y,
                behavior: 'smooth'
            });
        });
    });
}

start();

});
