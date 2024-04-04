import session from "express-session";
declare module "express-session" {
    export interface SessionData {
        user: {[key: string]: any};
   }
 }

 interface SessionData extends Session{
    user: {[key: string]: any};
 }
