import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>, // @Inject(MAT_DIALOG_DATA) public data: any, // @Inject(MAT_DIALOG_DATA) public dataAlt: any,
  ) {}

  ngOnInit() {}

  /**
   * Submit the form
   */
  public submit() {
    this.dialogRef.close();
  }
}
