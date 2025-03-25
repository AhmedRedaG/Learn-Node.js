const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url,
    method = req.method;
  if (url === "/") {
    res.write(`<html>
              <body>
                <form action="/message" method="POST">
                  <input type="text" name="message">
                  <button type="submit">Send</button>
                </form>
              </body>
            </html>`);
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      console.log("New message:", message);
      // fs.appendFileSync("messages.txt", message + "\n");
      fs.writeFile("messages.txt", message, (error) => {
        console.log("Message saved successfully.");
      });
    });
    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }
};

// module.exports = requestHandler;
// module.exports.handler = requestHandler;
// module.exports = {
//   handler: requestHandler,
//   anyData: "value",
// }

exports.handler = requestHandler;
