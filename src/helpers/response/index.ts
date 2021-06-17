import { Response } from "express";
import { ErrorInterface } from "../../interfaces";

class ResponseHelper {
    
    /**
     * @funcation success
     * @param response 
     * @param data 
     * @returns response
     */
    public success(res: Response, data: any = {}) {
        return res.status(200).json(data);
    } 

    /**
     * @fuction error
     * @param response 
     * @param errors 
     * @returns 
     */
    public error(res: Response, errors: ErrorInterface) {
        let { status, error } = errors;
        status = status || 400;
        return res.status(status).json({ error });
    }

} 

export default new ResponseHelper();