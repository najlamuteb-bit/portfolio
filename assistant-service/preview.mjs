// Local preview only: serves the real portfolio with the assistant visible.
// The API deliberately reports unavailable until the live service has been configured.
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const types={".html":"text/html; charset=utf-8",".css":"text/css",".js":"text/javascript",".jpg":"image/jpeg",".png":"image/png",".woff2":"font/woff2",".pdf":"application/pdf",".xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"};
const server=http.createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname);
  if(pathname==="/chat"){res.writeHead(503,{"Content-Type":"application/json"});res.end('{"code":"service_unavailable"}');return}
  const file=path.resolve(root,"."+(pathname==="/"?"/index.html":pathname));
  if(!file.startsWith(root+path.sep)||file.split(path.sep).some(p=>p.startsWith("."))||file.includes(path.sep+"assistant-service"+path.sep)){res.writeHead(403);res.end();return}
  const data=await fs.readFile(file);res.writeHead(200,{"Content-Type":types[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});res.end(data);
 }catch{res.writeHead(404);res.end("Not found")}
});
server.listen(8791,"127.0.0.1",()=>console.log("Portfolio preview: http://127.0.0.1:8791 (AI connection is not active)"));
