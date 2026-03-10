import { IncomingMessage } from "http";

export type Handler = (req:IncomingMessage, params:Record<string,string>) => Promise<any>
type Route = { 
    method: string; 
    path:string; 
    handler: Handler
}

export class Router {
    private routes: Route[] = [];
    add(
        method: string,
        path:string,
        handler: Handler
    ){
        this.routes.push({method: method.toUpperCase(), path, handler})
    }
    match(method: string, urlPath:string){
        const m = method.toUpperCase();
        for(const route of this.routes){
            if (route.method !== m) continue;
            if (route.path ===urlPath){
                return {handler: route.handler, params:{}}
            }
            return null
        }
    }
}

export const readJsonBody = async(req: IncomingMessage) =>{
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
        chunks.push(Buffer.from(chunk));
    }
    const raw = Buffer.concat(chunks).toString("utf8");
    return raw ? JSON.parse(raw) : {};
}