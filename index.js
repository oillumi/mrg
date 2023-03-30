import { Worker } from "worker_threads";
import AuctionHandler from "./auction_handler.js";

const THREAD_POOL_SIZE = 4;
let auction_house = new AuctionHandler(THREAD_POOL_SIZE);

try 
{
    let workers = [];
    let thread_allocation_runtime = performance.now();

    for (let th = THREAD_POOL_SIZE + 1; --th;) 
    {
        workers.push(new Worker('./auction_house.js'));
    }

    console.log(`[MRG] Thread Allocation: ${performance.now() - thread_allocation_runtime}ms`);
    console.log(`[MRG] Process started for ${workers.length} workers on ${THREAD_POOL_SIZE} threads...\n`);

    await auction_house.new(60, workers, performance.now());
} 
catch (error) 
{
    console.log("[MRG] Something went wrong with worker generation -> " + error);
}
