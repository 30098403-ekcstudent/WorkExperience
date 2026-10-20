const http = require("http");
const{ DatabaseSync } = require("node:sqlite");
const fs = require("fs");

const db = new DatabaseSync("users.db")

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, 
    car TEXT NOT NULL
    )

 `);

const server = http.createServer((req, res) => {

    if (req.method === "GET" && req.url === "/") {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(fs.readFileSync("CP11 - index.html"));
    }
    else if (req.method === "GET" && req.url === "/style.css") {
        res.writeHead(200, {"Content-Type": "text/css"});
        res.end(fs.readFileSync("style.css"));
    }

    else if (req.method === "POST" && req.url === "/save") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const data = JSON.parse(body);

                if (typeof data.name !== "string" ||
                    typeof data.car !== "string" ||
                    !data.name.trim() || !data.car.trim()) {
                    res.writeHead(400);
                    return res.end("Invalid input");
                }

                const statement = db.prepare(
                    "INSERT INTO users (name, car) VALUES (?, ?)"
                );

                statement.run(data.name, data.car);

                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify({message: "Data saved"}));
            } catch (error) {
                res.writeHead(400);
                res.end("Invalid request");
            }
        });
    }

    else if (req.method === "GET" && req.url === "/users") {
    const users = db.prepare("SELECT * FROM users").all();

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(users));
    }

    else {
        res.writeHead(404);
        res.end("Page not found");

    }
});
server.listen(3000, "127.0.0.1", () => {
     console.log("Server running at http://localhost:3000");
});



