export async function hash(algo_id, data)
{
    switch (algo_id)
    {
        case "SHA1" : {
            const hash = await crypto.subtle.digest("SHA-1", data);
            return Array.from(new Uint8Array(hash))
                .map(v => v.toString(16).padStart(2, '0'))
                .join('');
        }
    }
}



export async function load_dom(root, component)
{
    try 
    {
        let html_obj  = await fetch(`${root}/${component}.html`);
        let html_body = await html_obj.text();
        // console.debug(`loaded : ${root}/${component}.html -> ${html_body}`);

        let css_obj  = await fetch(`${root}/${component}.css`);
        let css_body = await css_obj.text();
        // console.debug(`loaded : ${root}/${component}.html -> ${css_body}`);

        // TODO : do some path based hashing to ensure DOM is unique upon merge

        const style = document.createElement('style');
        style.textContent = css_body;
        document.head.appendChild(style);

        // console.debug(`${component} loaded`)
        return html_body
    }
    catch (error)
    {
        console.error(`Error loading ${component} because ${error}`);
        return `<div>error loading ${component}</div>`
    }
}