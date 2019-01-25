import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent implements OnInit {
  /** Error message to show */
  @Input() error: any;
  /** Will the close error button appear in the corner */
  @Input() canClose = true;
  /** Should the error be shown by default or hidden in an accordion */
  @Input() showError = false;

  constructor() {}

  ngOnInit() {}
}
