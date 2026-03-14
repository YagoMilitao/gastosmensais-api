import { url } from 'inspector';
import { Router } from "./router.js";
import { handleError } from "./presenters/http-response";
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
            res.end(response.body);

        } catch (err){
            const response = handleError(err, res);
            res.writeHead(response.status, response.headers);
            res.end(response.body);
        }
    });
}