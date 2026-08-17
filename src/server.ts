import http from "http";
import checkDbConn from "./database/check";
import app from "./app";
import ENV from "./config/env";

const startServer = () => {
  try {
    checkDbConn();

    const server = http.createServer(app);

    server.on("error", (err) => {
      console.error("Server encountered an error", err);
      process.exit(1);
    });

    server.listen(ENV.PORT, () => {
      console.log(`Server is listening on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
