// third party imports
// ..

// component imports
// ..

// misc imports
import { hash, load_dom } from "../../utils/util.js";

// component wide variables;
let dom_hash   = "";
let c_bar_tool = null;
let cb_update  = null;
const txt_encoder = new TextEncoder();
const dom_parser  = new DOMParser();



export function cb_bar_tool_update(cb)
{
    cb_update = cb;
    start();
}



export async function init_bar_tool(parent_dir)
{
    const current_dir = `${parent_dir}/bar_tool/`;
    try
    {
        const toolbar_raw = await load_dom(current_dir, "bar_tool");
        const toolbar_body = dom_parser.parseFromString(toolbar_raw, "text/html");
        c_bar_tool = toolbar_body.querySelector("c_bar_tool");

        return c_bar_tool.outerHTML;
    }
    catch (error)
    {
        return `<div>failed to load tool bar - ${error}</div>`
    }
}



function start()
{
    if (cb_update != null)
    {
        setInterval(async() => 
        {
            const new_dom = update_toolbar();
            const new_hash = hash("SHA1", txt_encoder.encode(new_dom));

            if (new_hash != dom_hash)
            {
                dom_hash = new_hash;
                cb_update(new_dom, "c_bar_tool");
            }
        }, 10000);
    }
    else
    {
        console.error("No update callback registered for c_bar_tool");
    }
}



function update_toolbar()
{
    // update contents
    const now = new Date();
    let dynamic_content = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;

    // manipulate and return updated HTML content based on cached HTML;
    const doc         = dom_parser.parseFromString(c_bar_tool.innerHTML, "text/html");
    const element     = doc.getElementById("value");
    element.innerText = dynamic_content;

    return doc.body.innerHTML;
}