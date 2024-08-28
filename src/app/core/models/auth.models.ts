export interface AuthenticationRequest {
  email:string,
  password:string
}

export interface TokenResponse {
  nom:string,
  prenom:string,
  email:string,
  token:string
}

export interface RegisterRequest {
  nom:string,
  prenom:string,
  email:string,
  password:string,
  token:string

}
