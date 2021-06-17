import App from "./app";
import { Config } from "./config";

( async () => {
  
  const isStarted: boolean = await Config();
  if (isStarted) {
    const app = new App([]);
    app.startServer();
  }
  
})();


