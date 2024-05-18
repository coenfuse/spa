// third party imports
// ..

// component imports
import { init_bar_tool, cb_bar_tool_update } from "./bar_tool/bar_tool.js";

// misc imports
import { load_dom } from "../utils/util.js";

// component wide variables;
let c_editor  = null;
let cb_update = null;
const dom_parser  = new DOMParser();



export function cb_editor_update(cb)
{
    cb_update = cb;
    start();
}



export async function init_editor(parent_dir)
{
    const current_dir = `${parent_dir}/editor/`;
    try
    {
        const editor_raw = await load_dom(current_dir, "editor");
        const editor_body = dom_parser.parseFromString(editor_raw, "text/html");
        c_editor = editor_body.querySelector("c_editor");
        
        const toolbar_raw = await init_bar_tool(current_dir);
        // c_editor.insertAdjacentHTML("afterbegin", toolbar_raw);

        return c_editor.outerHTML;
    }
    catch (error)
    {
        return `<div>failed to load editor - ${error}</div>`
    }
}



function start()
{
    if (cb_update != null)
    {
        function dom_updater(content, tag)
        {
            c_editor.querySelector(tag).innerHTML = content;
            cb_update(c_editor.innerHTML, "c_editor");
        };

        cb_bar_tool_update(dom_updater);
        // cb_panel_nodes_update(dom_updater);
        // cb_panel_config_update(dom_updater);
        // cb_bar_status_update(dom_updater);
    }
    else
    {
        console.error("No update callback registered for c_editor");
    }
}