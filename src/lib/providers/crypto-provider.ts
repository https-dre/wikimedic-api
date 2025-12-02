import jwt from "jsonwebtoken";
export class JwtProvider {
  private key: string = process.env.JWT_KEY!;
  generateToken(payload: object) {
    return jwt.sign(payload, this.key, { expiresIn: "1y" });
  }
  verifyToken(token: string) {
      const payload = jwt.verify(token, this.key)
      return payload
  }
}