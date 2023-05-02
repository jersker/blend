class Palette extends HTMLElement {
	constructor( palette, color1, color2, title, class_type ) {

        super();

        const shadow = this.attachShadow( { mode: "open" } );
        
        //const palette_container = document.createElement("div");
        //const gradient_container = document.createElement("div");

        //palette_container.setAttribute("class", "palette_container");
        //palette_container.setAttribute("id", title);
        //gradient_container.setAttribute("class", "gradient_palette");

        const title_h2 = document.createElement("h2");
        title_h2.innerHTML = `${title}`;

        const about = document.createElement("div");
        about.setAttribute("class", "about");
        about.innerHTML = `
            <div class="active_color"></div>
            <table class="info">
                <tr><td class="hex_label"></td><td class="hex_value"></td></tr>
                <tr><td class="rgb_label"></td><td class="rgb_value"></td></tr>
                <tr><td class="cmyk_label"></td><td class="cmyk_value"></td></tr>
                <tr><td class="hsl_label"></td><td class="hsl_value"></td></tr>
            </table>
        `;

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
        const main_radius = "8px";

        const style = document.createElement("style");
        style.textContent = `
            div.palette_container, div.gradient_container {
                -webkit-transition:all 0.5s;
                -moz-transition:all 0.5s;
                -ms-transition:all 0.5s;
                -o-transition:all 0.5s;
                transition:all 0.5s;
            }
            div#main_container {
                border:1px solid blue;
            }
            div.color_palette, div.gradient_palette {
                border:1px solid red;
                /*width:100%;*/
                width:200px;
                height:auto;
                opacity:1;
                /*
                display:-webkit-box;
                display:-webkit-flex;
                display:-ms-flexbox;
                display:flex;
                */
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
                width:100%;
                
                display:flex;
                justify-content:space-between;
                
                margin-bottom:${main_margin};
            }
            div.active_color {
                width:30%;
                border:1px solid rgba(255, 255, 255, 0.3);
                border-radius:${main_radius};
                
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

        const colors_dom = palette.querySelectorAll("div.color");
        let active_color = colors_dom[4];

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

            shadow.appendChild( gradient );
            //palette_container.appendChild( gradient );
        }

        let grad_middle;

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

        shadow.appendChild( style );
        shadow.appendChild( title_h2 );
        shadow.appendChild( about );

        shadow.appendChild( palette );

        create_labels( active_color, grad_middle );
        active_color.classList.add( "clicked" ); 
	};
}