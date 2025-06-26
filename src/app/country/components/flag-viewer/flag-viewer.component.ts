import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'flag-viewer',
  imports: [],
  templateUrl: './flag-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlagViewerComponent { 

  flag = input.required<string>();

}
