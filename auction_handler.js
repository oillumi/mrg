import { Worker } from 'worker_threads'

export default class AuctionHandler 
{
    constructor(th) 
    {
        this.thread_pool_size = th;
    }

    generate_page_iterations(total_pages) 
    {
        let main_array = [], sub_array = [];
        let actual_data = 0, last_data;

        for (let a = 1; a <= this.thread_pool_size; ++a) {
            
            sub_array = [];
            last_data = actual_data;
            actual_data = (a * (Math.floor(total_pages / this.thread_pool_size))) + (total_pages % this.thread_pool_size);

            for ( let b = last_data; b < actual_data; ++b ) 
            {
                sub_array.push(b)
            }

            main_array.push(sub_array);
        }

        return main_array;
    }

    async collect_auctions(workers, iterations, runtime) {
        
        const workerPromises = workers.map((worker, index) => {
                return new Promise((resolve) => 
                    {
                        worker.once('message', (message) => 
                        {
                            console.log(message)

                            if (index === workers.length - 1) 
                            {
                                console.log(`[MRG] Runtime: ${performance.now() - runtime}ms`);
                            }

                            resolve();
                            }
                        );

                        worker.postMessage(iterations[index]);
                    }
                )
            }
        );

        await Promise.all(workerPromises);
    }

    async new(total_pages, workers, runtime) 
    {
        const iterations = this.generate_page_iterations(total_pages, this.thread_pool_size);
        await this.collect_auctions(workers, iterations, runtime);

        setInterval(async () => 
            {
                console.log('\n[MRG] Updating threads, recollecting auctions...');
                await this.collect_auctions(workers, iterations, performance.now());
            }, 60000
        );
    }
}