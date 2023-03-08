import {
    Directive,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    ViewChild,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Directive({
    selector: '[citiglobalClearInputValue]',
})
export class CleanrInputValueDirective implements OnInit, OnDestroy {
    private input$ = new Subject<string>();

    constructor(private el: ElementRef) {}

    ngOnInit(): void {
        // const element: HTMLInputElement =
        //     this.el.nativeElement.querySelector('#rfidNoField');

        fromEvent(this.el.nativeElement, 'input')
            .pipe(
                map((event: any) => {
                    console.log(event.target.value);
                    return event.target.value;
                }),
                distinctUntilChanged()
            )
            .subscribe(this.input$);

        this.input$.subscribe((value) => {
            this.el.nativeElement.value = value;
        });
    }

    ngOnDestroy(): void {
        this.input$.complete();
    }
}
