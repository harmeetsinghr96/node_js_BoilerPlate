import http from "http";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import { ControllerInterface } from "./interfaces";
import cors from "cors";
import { Helper } from "./helpers";
const debug = require("debug")("node");

class App {

    private app: express.Application;
    private server: http.Server;
    private port: number | string | boolean;

    constructor( controllers: ControllerInterface[] ) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.port = this.normalizePort(process.env.PORT! || "3001");
        this.setHeaders();
        this.initMiddleware();
        this.initControllers(controllers);
    };

    /**
     * @function initHeaders
     */
    private setHeaders = () => {
        this.app.use((req: any, res: any, next: any) => {
            req.header("multipart/form-data");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, form-data, Authorization"
            );
            res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PATCH, PUT, DELETE, OPTIONS"
            );
            next();
        });
    }


    /**
     * @function initMiddlewares
     */
    private initMiddleware = () => {
        this.app.set("port", this.port);
        this.app.use(bodyParser.json());
        this.app.use(helmet());
        this.app.use(cors);
        this.app.use(bodyParser.urlencoded({ extended: false }));
    };

    /**
     * @function initControllers
     * @param controllers 
     */
    private initControllers = (controllers: ControllerInterface[]) => {
        controllers.forEach((controller: ControllerInterface) => {
            this.app.use("/api/v1", controller.router);
        });
        this.app.use("/api/v1/status", (req: express.Request, res: express.Response, next: express.NextFunction) => {
            return Helper.Response.error(res, { status: "400", error: { message: 'Service Unavailable' } });
        })
    };

    /**
     * @function createServer
     */
    public startServer = () => {
        this.server.on("error", this.onError);
        this.server.on("listening", this.onListening);
        this.server.listen(this.port);
    };

    /**
     * @function normalizePort
     * @param value 
     * @returns 
     */
    private normalizePort = (ports: any) => {
        let port: number = parseInt(ports, 10);
        
        if (isNaN(port)) {
            return port;
        }

        if (port >= 0) {
            return port;
        }

        return false;
    };
    
    /**
     * @function onError
     * @param error 
     */
    private onError = (error: any) => {
        if (error.syscall !== "listen") {
            throw error;
        }

        const addr = this.server.address();
        const bind = typeof addr === "string" ? "pipe " + addr : "port " + this.port;
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    };

    /** 
     * @function onListener
    */
    private onListening = () => {
        const addr = this.server.address();
        const bind = typeof addr === "string" ? "pipe " + addr : "port " + this.port;
        debug("Listening on " + bind);
        console.log("User service listening on " + bind);
    };
}

export default App;