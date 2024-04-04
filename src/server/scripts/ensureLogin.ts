export const ensureAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/home");
  }
};
export const ensureGuest = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    return next();
  }
};
