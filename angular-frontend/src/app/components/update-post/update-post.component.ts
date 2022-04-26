import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css'],
})
export class UpdatePostComponent implements OnInit {
  desc: string = '';
  constructor(
    public dialogRef: MatDialogRef<UpdatePostComponent>,
    @Inject(MAT_DIALOG_DATA) public post: any
  ) {}

  ngOnInit(): void {
    this.desc = this.post.desc;
  }
  saveData() {
    const postUpdatedData = {
      desc:this.desc
    }
    this.dialogRef.close(postUpdatedData);
  }
}
