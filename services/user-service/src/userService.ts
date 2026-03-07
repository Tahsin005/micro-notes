import { AuthClient } from "./authClient";

export class UserService {
    private authClient: AuthClient;

    constructor() {
        this.authClient = new AuthClient();
    }
}