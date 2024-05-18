// third party imports
// ..

// component imports
import { init_canvas, cb_canvas_update } from './canvas/canvas.js';
import { init_editor, cb_editor_update } from './editor/editor.js';

// misc imports
import { load_dom } from './utils/util.js'

// component wide variables
let c_app         = null;
let cb_update     = null;
const dom_parser  = new DOMParser();



export function cb_app_update(callback) 
{
    cb_update = callback;
    start();
}



export async function init_app(parent_dir)
{
    const current_dir = `${parent_dir}/`;
    try 
    {
        const app_raw  = await load_dom(current_dir, "app")
        const app_body = dom_parser.parseFromString(app_raw, "text/html");
        c_app = app_body.querySelector("c_app");

        const canvas_raw = await init_canvas(current_dir);
        c_app.insertAdjacentHTML("afterbegin", canvas_raw)

        const editor_raw = await init_editor(current_dir);
        c_app.insertAdjacentHTML("beforeend", editor_raw);

        return c_app.outerHTML;
    }
    catch (error)
    {
        return `<div>failed to load app - ${error}</div>`
    }
}



function start()
{
    if (cb_update)
    {
        function dom_updater(content, tag)
        {
            c_app.querySelector(tag).innerHTML = content;
            cb_update(c_app.innerHTML, "c_app");
        };

        cb_canvas_update(dom_updater);
        cb_editor_update(dom_updater);
    }
    else {
        console.error("No update callback registered for #app");
    }
}