import {
    Directive,
    ElementRef,
    HostListener,
    Inject,
    PLATFORM_ID,
} from '@angular/core';

@Directive({
    selector: '[citiglobalFocusHiddenInput]',
})
export class FocusElementDirective {
    constructor(
        private elementRef: ElementRef,
        @Inject(PLATFORM_ID)
        private platformId: Object
    ) {
        if (!elementRef.nativeElement['focus']) {
            throw new Error('Element does not accept focus.');
        }
    }

    ngAfterViewInit(): void {
        const hiddenInput: HTMLInputElement =
            this.elementRef.nativeElement.querySelector('#rfidNoField');

        if (hiddenInput) {
            hiddenInput.focus();
            hiddenInput.addEventListener('paste', this.handlePaste);
        }
    }

    ngOnDestroy(): void {
        const hiddenInput: HTMLInputElement =
            this.elementRef.nativeElement.querySelector('#rfidNoField');

        if (hiddenInput) {
            hiddenInput.removeEventListener('paste', this.handlePaste);
        }
    }

    @HostListener('document:click', ['$event.target'])
    onClick(target: HTMLElement) {
        const hiddenInput =
            this.elementRef.nativeElement.querySelector('#rfidNoField');

        if (hiddenInput && !hiddenInput.contains(target)) {
            hiddenInput.focus();
        }
    }

    handlePaste(event: ClipboardEvent): void {
        event.preventDefault();
    }
}
