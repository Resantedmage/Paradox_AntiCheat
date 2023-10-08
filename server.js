const http = require("http");
const path = require("path");
const finalhandler = require("finalhandler");
const serveStatic = require("serve-static");

const serve = serveStatic("docs", { index: ["index.html"] });
const server = http.createServer((req, res) => {
    serve(req, res, finalhandler(req, res));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
