import jwt, { JwtPayload } from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }
  let token = req.headers.authorization.split(' ')[1];
  if (token === 'null') {
    return res.status(401).send('Unauthorized request');
  }
  try {
    const payload = jwt.verify(token, 'secretKey') as string | JwtPayload;
    if (typeof payload === 'string') {
      return res.status(401).send('Unauthorized request');
    }
    req.userId = payload.subject;
    req.userRole = payload.role;
    next();
  } catch (err) {
    return res.status(401).send('Unauthorized request');
  }
}

export function isAdmin(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).send('Forbidden: Admins only');
  }
  next();
}

export function isWaiter(req, res, next) {
  if (req.userRole !== 'waiter') {
    return res.status(403).send('Forbidden: Waiters only');
  }
  next();
}
