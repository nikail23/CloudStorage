import { Injectable } from '@angular/core';
import { RippleGlobalOptions } from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class RippleService implements RippleGlobalOptions {

  disabled: boolean = false;

  constructor() { }
}
