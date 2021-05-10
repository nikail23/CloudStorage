import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  public errorName: string;
  public errorText: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data) {
    this.errorName = data.errorName;
    this.errorText = data.errorText;
  }

  ngOnInit(): void {
  }

}
