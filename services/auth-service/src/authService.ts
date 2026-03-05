import { AuthTokens } from "@shared/types";
import { createServiceError } from "@shared/utils";
import { prisma } from "./database";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";

export class AuthService {
    private readonly jwtSecret: string;
    private readonly jwtRefreshSecret: string;
    private readonly jwtExpiresIn: string;
    private readonly jwtRefreshExpiresIn: string;
    private readonly bcryptRounds: number;

    constructor() {
        this.jwtSecret = process.env.JWT_SECRET!;
        this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "15m";
        this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
        this.bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);

        if (!this.jwtSecret || !this.jwtRefreshSecret) {
            throw new Error("JWT secrets are not defined in environment variables");
        }
    }

    async register(email: string, password: string): Promise<AuthTokens> {
        // check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw createServiceError("User already exists", 409);
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, this.bcryptRounds);

        // create the user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        // generate tokens
        return this.generateTokens(user.id, user.email);
    }

    private async generateTokens(
        userId: string,
        email: string
    ): Promise<AuthTokens> {
        const payload = { userId, email };

        // Generate access token
        const accessTokenOptions: SignOptions = {
            expiresIn: this.jwtExpiresIn as StringValue,
        };

        const accessToken = jwt.sign(
            payload,
            this.jwtSecret,
            accessTokenOptions
        ) as string;

        // Generate refresh token
        const refreshTokenOptions: SignOptions = {
            expiresIn: this.jwtRefreshExpiresIn as StringValue,
        };
        const refreshToken = jwt.sign(
            payload,
            this.jwtRefreshSecret,
            refreshTokenOptions
        ) as string;

        // Store refresh token in the database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        await prisma.refreshToken.create({
            data: {
                userId,
                token: refreshToken,
                expiresAt,
            },
        });

        return {
            accessToken,
            refreshToken,
        };
    }
}