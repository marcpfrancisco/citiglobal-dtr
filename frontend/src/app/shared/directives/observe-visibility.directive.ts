/**
 * @fileoverview
 * Directive that notifies visibility of Element based from
 * documentation in https://angularbites.com/intersection-observer-with-angular/
 *
 * More reference and browser compatibility about IntersectionObserver can be found in
 * MDN documentation: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */
import { isPlatformBrowser } from '@angular/common';
import {
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    PLATFORM_ID,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { delay, filter } from 'rxjs/operators';

interface IntersectionData {
    entry: IntersectionObserverEntry;
    observer: IntersectionObserver;
}

@Directive({
    selector: '[citiglobalObserveVisibility]',
})
export class ObserveVisibilityDirective
    implements OnInit, AfterViewInit, OnDestroy
{
    private observer: IntersectionObserver | null;

    private intersectSubject$: Subject<IntersectionData>;
    private intersectSubscription: Subscription;

    get isSupported(): boolean {
        return (
            isPlatformBrowser(this.platformId) &&
            typeof IntersectionObserver !== 'undefined'
        );
    }
    @Input() threshold = 0;

    @Output() visible = new EventEmitter<Element | null>();

    constructor(
        private element: ElementRef,
        @Inject(PLATFORM_ID) private platformId: Object,
        private ngZone: NgZone
    ) {
        this.intersectSubject$ = new Subject();
        this.observer = null;
    }

    ngOnInit(): void {
        // do not initialize if not supported (So far, only doesn't support this as for now)
        if (!this.isSupported) {
            return;
        }

        this.intersectSubscription = this.intersectSubject$.subscribe(
            async (data: IntersectionData): Promise<void> =>
                this.onIntersect(data)
        );
    }

    ngAfterViewInit(): void {
        // do not start observing if not supported!
        if (!this.isSupported) {
            // if not supported, just emit that element is visible
            this.visible.emit(null);
            return;
        }

        this.ngZone.runOutsideAngular(() => {
            this.observer = new IntersectionObserver(
                ([entry], observer) => {
                    if (entry.isIntersecting || entry.intersectionRatio > 0) {
                        this.intersectSubject$.next({ entry, observer });
                    }
                },
                {
                    root: null,
                    rootMargin: '0px',
                    threshold: this.threshold,
                }
            );

            this.observer.observe(this.element.nativeElement);
        });
    }

    ngOnDestroy(): void {
        if (!this.isSupported) {
            return;
        }

        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        if (this.intersectSubscription) {
            this.intersectSubscription.unsubscribe();
        }

        this.intersectSubject$.complete();
    }

    protected async onIntersect({
        entry,
        observer,
    }: IntersectionData): Promise<void> {
        const isVisible = await new Promise((resolve) => {
            let subObserver = new IntersectionObserver(([subEntry]) => {
                resolve(
                    subEntry.intersectionRatio > 0 || subEntry.isIntersecting
                );
                subObserver.disconnect();
                subObserver = null;
            });

            subObserver.observe(entry.target);
        });

        if (isVisible) {
            this.visible.emit(entry.target);
            observer.unobserve(entry.target);
        }
    }
}
