import "cookie-session"
declare module "cookie-session" {
    interface SessionData {
        user: {[key: string]: any};
   }
 }