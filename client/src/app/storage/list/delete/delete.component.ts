import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StorageElement, StorageElementType } from 'src/app/services/storage.model';

@Component({
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {
  public StorageElementType = StorageElementType;

  public name: string;
  public size: string;
  public createdAt: Date;
  public type: StorageElementType;

  constructor(@Inject(MAT_DIALOG_DATA) public data: StorageElement) {
    this.name = data.name;
    this.size = data.size;
    this.createdAt = data.createdAt;
    this.type = data.type;
  }

  ngOnInit(): void {
  }

}
