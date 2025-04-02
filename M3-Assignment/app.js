const html = require("http");
const fs = require("fs");

const server = html.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");

  const url = req.url,
    method = req.method;

  const errorHandler = (err) => {
    console.error(err);
    return res.end("Error in users.txt");
  };

  if (url === "/") {
    res.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Home</title>
      </head>
      <body>
        <h1 style="padding:20px;text-align:center;margin:20px 0;">Welcome to our website!</h1>
        <hr />
        <p>Create new user</p>
        <form action="/create-user" method="POST">
          <input type="text" name="username" required>
          <button type="submit">Submit</button>
        </form>
        <hr />
        <p>View all users</p>
        <form action="/users" method="POST">
          <button type="submit">View Users</button>
        </form>
      </body> 
      </html>`);
    return res.end();
  }
  if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => body.push(chunk));
    return req.on("end", (err) => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split("=")[1];
      // Save user data to a file
      fs.promises
        .appendFile("users.txt", username + "\n")
        .then(() => {
          console.log(`New user created and saved successfully: ${username}`);
          res.writeHead(302, { Location: "/users" });
          return res.end();
        })
        .catch(errorHandler);
    });
  }
  if (url === "/users") {
    return fs.promises
      .readFile("users.txt", "utf8")
      .then((users) => {
        res.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Users</title>
          </head>
          <body>
            <h2 style="padding:20px;text-align:center;margin:20px 0;">Users</h2>
            <hr />
            <ul>
                      ${
                        users
                          .trim()
                          .split("\n")
                          .map((user) => `<li>${user}</li>`)
                          .join("") || "no users yet"
                      }
            </ul>
            <hr />
            <form action="/" method="POST">
              <button type="submit">Back to home</button>
            </form>
          </body>
          </html>`);
        return res.end();
      })
      .catch(errorHandler);
  }
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
