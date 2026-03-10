import { url } from 'inspector';
import { Router } from "./router.js";
import http from "http";

export const createServer = (Router: Router) => {
    return http.createServer(async (req, res) => {
        try{
            const url = new URL(req.url || "/", "http://localhost");
            const match = Router.match(req.method || "GET", url.pathname);
            if(!match){
                res.writeHead(404, {"content-Type": "application/json"});
                res.end(JSON.stringify({error: "Not found"}));
                return;
            }
            const response = await match.handler(req, match.params);
            res.writeHead(response.status, response.headers);

        } catch (err){
            console.error("Error handling request:", err);
        }
    });
}