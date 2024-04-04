import { Express } from "express";
declare global {
  namespace Express {
    interface User {
      googleID: string;
      displayName: string;
      firstName: string;
      lastName: string;
      email: string;
      pfp: string;
      userID: string;
    }
    interface Request {
      user?: {
        googleID: string;
        displayName: string;
        firstName: string;
        lastName: string;
        email: string;
        pfp: string;
        userID: string;
      };
      session?: Session & Partial<SessionData> & { user?:
        {
          googleID: string;
          displayName: string;
          firstName: string;
          lastName: string;
          email: string;
          pfp: string;
          userID: string;
        };
      };
      };
    }
  interface Response {
    user?: {
      googleID: string;
      displayName: string;
      firstName: string;
      lastName: string;
      email: string;
      pfp: string;
      userID: string;
    };
  }
  interface SessionData {
    user?: {
      googleID: string;
      displayName: string;
      firstName: string;
      lastName: string;
      email: string;
      pfp: string;
      userID: string;
    };
  }
}
