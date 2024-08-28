
import { Injectable } from '@angular/core';
import * as JWT from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor() {}

  decodeToken(token: string): any {
    return JWT.jwtDecode(token);
  }
}
