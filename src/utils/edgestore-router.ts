import { initEdgeStore } from "@edgestore/server";
import { CreateContextOptions, createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";
import { z } from "zod";

// backend
import { initEdgeStoreClient } from "@edgestore/server/core";

type Context = {
    userId: string,
    userRole: "admin" | "user";
}

function createContext({ req }: CreateContextOptions): Context {
    //get session
    return {
        userId: "frfr",
        userRole: "admin",
    };
}

const es = initEdgeStore.create();

export const edgeStoreRouter = es.router({
    caca: es
        .imageBucket({
            maxSize: 1024 * 1024 * 2,
        })
        .input(
            z.object({
                type: z.enum(["brands", "designs"]),
            })
        )
        .path(({ input }) => [{ type: input.type }]),
    
    products: es
        .fileBucket({
            maxSize: 1024 * 1024 * 2,
            accept: ['image/jpeg', 'image/png'],
        }),
        // .path(({ ctx }) => [{ owner: ctx.userId }]),
    
    users: es
        .fileBucket({
            maxSize: 1024 * 1024 * 2,
            accept: ['image/jpeg', 'image/png'],
        }),
        
    
});

// backend
export const backendClient = initEdgeStoreClient({
    router: edgeStoreRouter,
})
// export { edgeStoreRouter as esRouter};
