// third party imports
// ..

// component imports
// ..

// misc imports
import { hash, load_dom } from "../utils/util.js";

// component wide variables
let dom_hash  = "";
// let html_body = "";

let c_canvas      = null;
let cb_update     = null;
const txt_encoder = new TextEncoder();
const dom_parser  = new DOMParser();



export function cb_canvas_update(cb)
{
    cb_update = cb;
    start();
}



export async function init_canvas(parent_dir) 
{
    const current_dir = `${parent_dir}/canvas/`;
    try
    {
        const canvas_raw = await load_dom(current_dir, "canvas");
        const canvas_body = dom_parser.parseFromString(canvas_raw, "text/html");
        c_canvas = canvas_body.querySelector("c_canvas");

        return c_canvas.outerHTML;
    }
    catch (error)
    {
        return `<div>failed to load canvas - ${error}</div>`
    }
}



function start()
{
    if (cb_update != null)
    {
        window.addEventListener("mousemove", async () => {
            let new_dom  = update_canvas();
            let new_hash = await hash("SHA1", txt_encoder.encode(new_dom));
            if (new_hash != dom_hash)
            {
                cb_update(new_dom, "c_canvas");
                dom_hash = new_hash;
            }
        });
    }
    else
    {
        console.error("No update callback registered for c_canvas");
    }
}



function update_canvas()
{
    // update contents
    const now = new Date();
    let dynamic_content = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;

    // manipulate and return updated HTML content based on cached HTML;
    const doc         = dom_parser.parseFromString(c_canvas.innerHTML, "text/html");
    const element     = doc.getElementById("value");
    element.innerText = dynamic_content;

    return doc.body.innerHTML;
}