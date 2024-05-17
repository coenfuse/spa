// third party imports
// ..

// component imports
import {init_app, cb_app_update} from './app/app.js';

// misc imports
// ..

// component wide variables
// ..



window.addEventListener("load", async () => 
    {
        const current_dir = "./app";
        let c_root = document.querySelector("c_root");

        try 
        {
            const app_raw = await init_app(current_dir);
            c_root.innerHTML = app_raw;
            
            cb_app_update((content, tag) => 
            {
                let element = c_root.querySelector(tag);
                element.innerHTML = content;
                c_root.innerHTML  = element.outerHTML;
            });
        }
        catch (error)
        {
            console.error("something messed up");
        }
    }
);