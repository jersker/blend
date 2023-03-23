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
    
function hex_to_rgb(hex) {
    return {
        r : parseInt(hex.substring(0, 2), 16),
        g : parseInt(hex.substring(2, 4), 16),
        b : parseInt(hex.substring(4, 6), 16)
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
    
function get_cmyk(red, green, blue) {
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

const message = document.getElementsByClassName("message");

function hide_error() {
	message[0].style.opacity = "0";
	message[1].style.opacity = "0";
}

function show_error(index, type) {
    let error = "";
    if ( type == "hex" ) {
        error = "Please enter a valid hexadecimal value."
    }
    else if (type == "rgb") {
        error = "Please enter a valid RGB value."
    }
    else if (type == "both") {
        error = "Please only enter one value for each color."
    }
    else if (type == "none_search") {
        error = "Please enter a value."
    }

	message[index].innerHTML = error;
	message[index].style.opacity = "1";
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
	constructor(palette, r1, g1, b1, r2, g2, b2) {
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
    
function retrieve_input( button ) {
    const slide_id = "#" + document.querySelector("#" + button).parentElement.getAttribute("id");
    const slide = document.querySelector(slide_id);
    const input_containers = slide.querySelectorAll("div.input_container");
    
    let color = [ null, null, null, null ];
    let colors = [];
    
    input_containers.forEach(container => {
        let inputs = container.querySelectorAll("input");
        
        inputs.forEach(function( input, index ) {
            if ( input.value ) {
                color[index] = input.value;
            }
        });
        
        colors.push( color );
        color = [];
    });
    
    return colors;
}
    
function validate_input( input, type ) {
    let valid = true;
    let invalid_code;
    
    switch (type) {
        case "hex":
            if ( input.length == 3 ) {
                valid = true;
                input = input[0] + input[0] + input[1] + input[1] + input[2] + input[2];
            }
            else if ( input.length < 6 && input.length !== 3) {
                valid = false;
                invalid_code = "hex";
            }
            break;
        case "rgb":
            if ( input[0] > 255 || input[1] > 255 || input[2] > 255 ) {
                valid = false;
                invalid_code = "rgb";
            }
            else {
                for (let v = 0; v < input.length; v++) {
                    input[v] = parseInt(input[v], 10);
                }
            }
            break;
    }

    return input;
}
    
function validate( input, color ) {
    
    let valid = true;
    let invalid_code = "";
    
    let hex_input = color[0];
    let rgb_input = color[1] || color[2] || color[3];
    
    if ( hex_input ) { 
        if ( input.length == 3 ) {
            valid = true;
        }
        else if ( input.length < 6 && input.length !== 3) {
            valid = false;
            invalid_code = "hex";
        }
        else {
            valid = true;
        }
    }
    else {
        if ( input > 255 ) {
            valid = false;
            invalid_code = "rgb"
        }
        else {
            valid = true;
        }
    }

    return valid;
}
    
function parse_input_to_colors( inputs, button ) {

    let rgb = [ rgb1 = { r : null, g : null, b : null },
                rgb2 = { r : null, g : null, b : null } ];
    
    inputs.forEach( (input, color) => {
        let valid;
        let hex_input = input[0];
        let rgb_input = input[1] || input[2] || input[3];
        
        if ( hex_input ) {
            if ( validate( hex_input, input ) ) {
                rgb[color] = hex_to_rgb(hex_input);
            }
        }
        if ( rgb_input ) {
            if ( validate( rgb_input, input ) ) {
                rgb[color].r = parseInt(input[1], 10);
                rgb[color].g = parseInt(input[2], 10);
                rgb[color].b = parseInt(input[3], 10);
            }
        }
        color++;
    });

    return {
        r1 : rgb[ 0 ].r,
        g1 : rgb[ 0 ].g,
        b1 : rgb[ 0 ].b,
        r2 : rgb[ 1 ].r,
        g2 : rgb[ 1 ].g,
        b2 : rgb[ 1 ].b
    };
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
    
function begin( button, search_inputs ) {
    const color_containers = document.querySelectorAll(".color_container");
    const gradient_palette = document.getElementById("gradient_palette");
    const gradient_container = document.querySelectorAll(".gradient_container");
    
    hide_error();
    
    let type = "";
    let value = 0;
    
    switch ( button ) {
        case "search_button":
            value = 1;
            type = "input";
            break;
        case "blend_button":
            value = 2;
            type = "input"
            break;
        case "random_button":
            value = 1;
            type = "random";
            break;
        case "random_gradient":
            value = 2;
            type = "random";
            break;
    }
    
    let rgb;
    let red1, green1, blue1;
    let red2, green2, blue2;
    
    switch ( type ) {
        case "input":
            const inputs = retrieve_input( button );
            rgb = parse_input_to_colors( inputs, button );
            
            red1 = rgb.r1;
            green1 = rgb.g1;
            blue1 = rgb.b1;

            console.log(red1, green1, blue1);
            
            red2 = rgb.r2;
            green2 = rgb.g2;
            blue2 = rgb.b2;
            break;
        case "random":
            rgb = hex_to_rgb( hex_rand() );
            
            red1 = rgb.r;
            green1 = rgb.g;
            blue1 = rgb.b;
            
            rgb = hex_to_rgb( hex_rand() );
            
            red2 = rgb.r;
            green2 = rgb.g;
            blue2 = rgb.b;
            break;
    }
    
    switch ( value ) {
        //  Search
        case 1:
            color_palette(red1, green1, blue1);
            show_hide_sections(color_containers, gradient_container);
            scroll();
            break;
        //  Blend
        case 2:
            new Palette(gradient_palette, red1, green1, blue1, red2, green2, blue2);
            show_hide_sections(gradient_container, color_containers);
            scroll();
            break;
    }
}
    
function start() {
    
    main_animation();

    const input_fields = document.querySelectorAll("div.text_area input");
    const search_inputs = document.querySelectorAll("div#search_slide input");
    const blend_inputs = document.querySelectorAll("div#blend_slide input");

    const buttons = [
        document.getElementById("search_button"),
        document.getElementById("blend_button"),
        document.getElementById("random_button"),
        document.getElementById("random_gradient")
    ];
    
    const color_palettes = document.querySelectorAll("div.palette_container");
	const color = document.querySelectorAll(".color");

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
            let allowed = [
                //    0-9
                48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
                //    0-9 numpad
                96, 97, 98, 99, 100, 101, 102, 103, 104, 105,
                //    enter, backspace
                13, 8
            ];
                
            if ( field.classList.contains("hex_input") ) {
                //  A-F
                allowed.push( 65, 66, 67, 68, 69, 70, );
            }
            
            //  Allow tab if and only if input has immediate sibling
            //  or if there are still input elements on the same slide.
            //  This prevents the user from tabbing to another slide.
            
            //  works for search slide
            if ( field.nextElementSibling ||
                field.parentElement.nextElementSibling ) {
                allowed.push( 9 );
            }

            for (let i = 0; i < allowed.length; i++) {
                if ( !(allowed.includes(key) ) || (event.shiftKey)) {
                    event.preventDefault();
                }
            }
            
            //  Enter key
            if (key === 13) {
                //  Messy, but gets the button ID of the slide where enter was pressed
                let button_type = field.parentNode.parentNode.parentNode.nextElementSibling;
                begin( button_type.getAttribute("id") );
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

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            button.index = buttons.indexOf( button );
            begin( this.getAttribute("id"), search_inputs );
            //  Clear all input
            input_fields.forEach( field => {
                field.value = "";
            });
        });
    });
}

start();

});
