import { default as fetch } from 'node-fetch';
import { parentPort, threadId } from 'worker_threads'

console.log(`[MRG] Thread ${threadId} created.`)

parentPort.on('message', async (pages) => 
    {
        let requests_promises = [];

        async function request_handler(page) 
        {
            await (await fetch(`https://api.hypixel.net/skyblock/auctions?page=${page}`)).json();
        }

        for ( let page_index = pages.length; page_index--; ) 
        {
            requests_promises.push(request_handler(pages[page_index]))
        }

        await Promise.all(requests_promises);
        parentPort.postMessage(`[MRG] All requests sent successfully on thread ${threadId}`)
    }
)

parentPort.on('message', (message) => 
    {
        if (message === 'close') 
        {
            console.log(`[MRG] Closing thread ${threadId} tasks.`);
            process.exit(0);
        }
    }
)