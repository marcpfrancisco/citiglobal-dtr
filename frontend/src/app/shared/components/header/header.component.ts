import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ContentChild,
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'bloomlocal-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: fuseAnimations,
})
export class HeaderComponent {
  // Name of the Icon to be displayed
  @Input() iconName: string;

  // Flag for displaying the back button
  @Input() isBack = false;

  // Flag for displaying image
  @Input() hasImage = false;

  // The image path
  @Input() imageSrc = '';

  // Triggers event when back icon is clicked
  @Output()
  public backEvent = new EventEmitter();

  /** Templates */
  @ContentChild('title', { static: true }) titleTemplate: TemplateRef<any>;
  @ContentChild('actions', { static: true }) actionsTemplate: TemplateRef<any>;
  @ContentChild('search', { static: true }) searchTemplate: TemplateRef<any>;
  @ContentChild('subTitle', { static: true }) subTitleTemplate: TemplateRef<
    any
  >;

  /** Emit event when back icon is clicked
   */
  navTo(): void {
    this.backEvent.emit();
  }
}
