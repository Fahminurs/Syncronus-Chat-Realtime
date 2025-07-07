import jwt from "jsonwebtoken"; // 53.5k (gzipped: 16.1k)

export const verifyToken = (request, response, next) => {
    const token = request.cookies.jwt;
    if (!token) return response.status(401).send("You are not authenticated!");

    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
        if (err) return response.status(403).send("Token is not valid!");
        // Here is the vital part: Make sure to set `userId`, not `payload.id` or other
        request.userId = payload.userId; 
        next();
    });
};