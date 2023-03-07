import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[citiglobalFocusElement]',
})
export class FocusElementDirective implements AfterViewInit, OnDestroy {
    private destroyed$ = new Subject<void>();

    constructor(private elementRef: ElementRef) {
        if (!elementRef.nativeElement['focus']) {
            throw new Error('Element does not accept focus.');
        }
    }

    ngAfterViewInit(): void {
        const inputElement = this.elementRef.nativeElement.querySelector(
            'input[type="hidden"]'
        );
        inputElement.focus();

        const outsideClick$ = fromEvent(document, 'click').pipe(
            takeUntil(this.destroyed$)
        );

        outsideClick$.subscribe((event: Event) => {
            if (!inputElement.contains(event.target as HTMLElement)) {
                inputElement.focus();
            }
        });
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
