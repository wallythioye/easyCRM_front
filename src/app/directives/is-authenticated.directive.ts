import {Directive, inject, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {AuthService} from "../core/services/auth/auth.service";

@Directive({
  selector: '[IsAuthenticated]',
  standalone: true,
  hostDirectives:[{
    directive:NgIf
  }]
})
export class IsAuthenticatedDirective implements OnInit {
  private   authServ:AuthService=inject(AuthService)
  private ngIfDirective=inject(NgIf)

  ngOnInit(): void {
    this.ngIfDirective.ngIf=this.authServ.isAuthenticated
  }

}
