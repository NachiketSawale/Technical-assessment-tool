export interface LoginRequest {
    email: string;
   
}

export interface LoginResponse {
    token: string;
    username: string;
}