import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.css'],
})
export class EditProfileDialogComponent implements OnInit {
  username: string = '';
  email: string = '';
  desc: string = '';
  from: string = '';
  city: string = '';
  relationship: string = '';
  constructor(
    public dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) {}

  ngOnInit(): void {
    this.username = this.user.username;
    this.email = this.user.email;
    this.desc = this.user.desc;
    this.from = this.user.from;
    this.city = this.user.city;
    this.relationship = this.user.relationship;
  }
  saveData() {
    const userUpdatedData = {
      username: this.username,
      email: this.email,
      desc: this.desc,
      from: this.from,
      city: this.city,
      relationship: this.relationship,
    };
    this.dialogRef.close(userUpdatedData);
  }
}
