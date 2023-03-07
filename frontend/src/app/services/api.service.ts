import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MOMENT_SQL_DATE_FORMAT, SERVICE_CONFIG } from '@constants';
import { SortDirection } from '@enums';
import { PaginationOption } from '@interfaces';
import { ServiceConfig } from '@models';
import { isNumericInteger, momentize } from '@utils';
import { get, isArray, isDate, isObjectLike, isString } from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';

type AnyObject = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key in string]?: any;
};

const DEFAULT_LIST_OPTIONS: ListPagingOptions<AnyObject> = {
    defaultLimit: 10,
};

export interface ListPagingOptions<Dto extends PaginationOption> {
    defaultLimit?: number | null;
    sortables?: {
        [key in string]: Dto['sort'];
    };
    httpParams?: HttpParams;
}

export type FindWithJoin<T extends AnyObject> = T & {
    join?: T['join'];
};

@Injectable({ providedIn: 'root' })
export class ApiService {
    private API_URL: string;

    constructor(
        @Inject(SERVICE_CONFIG) private readonly config: ServiceConfig,
        public readonly httpClient: HttpClient
    ) {
        this.API_URL = this.config.apiUrl;
    }

    get<ReturnObject, HttpOptions = AnyObject>(
        url: string,
        options = {} as HttpOptions
    ): Observable<ReturnObject> {
        return this.httpClient.get<ReturnObject>(
            `${this.API_URL}/${url}`,
            options
        );
    }

    post<ReturnObject, Payload = AnyObject, HttpOptions = AnyObject>(
        url: string,
        body: Payload,
        options = {} as HttpOptions
    ): Observable<ReturnObject> {
        return this.httpClient.post<ReturnObject>(
            `${this.API_URL}/${url}`,
            body,
            options
        );
    }

    patch<ReturnObject, Payload = AnyObject, HttpOptions = AnyObject>(
        url: string,
        body: Payload,
        options = {} as HttpOptions
    ): Observable<ReturnObject> {
        return this.httpClient.patch<ReturnObject>(
            `${this.API_URL}/${url}`,
            body,
            options
        );
    }

    delete<ReturnObject, HttpOptions = AnyObject>(
        url: string,
        options = {} as HttpOptions
    ): Observable<ReturnObject> {
        return this.httpClient.delete<ReturnObject>(
            `${this.API_URL}/${url}`,
            options
        );
    }

    put<ReturnObject, Payload = AnyObject, HttpOptions = AnyObject>(
        url: string,
        body: Payload,
        options = {} as HttpOptions
    ): Observable<ReturnObject> {
        return this.httpClient.put<ReturnObject>(
            `${this.API_URL}/${url}`,
            body,
            options
        );
    }

    getHttpClient() {
        return this.httpClient;
    }

    createJoinParameter<T>(
        options: FindWithJoin<T>,
        httpParams?: HttpParams
    ): HttpParams {
        let params = httpParams || new HttpParams();

        if (isArray(options.join)) {
            options.join.forEach((relation) => {
                if (!relation || !isString(relation)) {
                    return;
                }

                params = params.append('join[]', relation);
            });
        }

        return params;
    }

    createSortParameter<T extends PaginationOption>(
        { sort, sortDirection }: T,
        sortables: ListPagingOptions<T>['sortables'],
        httpParams?: HttpParams
    ): HttpParams {
        let params = httpParams || new HttpParams();

        // apply sorting
        if (
            isString(sort) &&
            isObjectLike(sortables) &&
            Object.values(sortables).includes(sort)
        ) {
            params = params.set('sort', sort);

            // use sort direction if provided
            if (
                sortDirection &&
                Object.values(SortDirection).includes(sortDirection)
            ) {
                params = params.set('sortDirection', sortDirection);
            }
        }

        return params;
    }

    createGetRecordParameter<T = unknown>(
        options: T,
        params?: HttpParams
    ): HttpParams {
        let newParams = params || new HttpParams();

        if (!isObjectLike(options)) {
            return newParams;
        }

        const join = get(options, 'join');
        const withDeleted = get(options, 'withDeleted');

        // apply join relations
        if (isArray(join)) {
            newParams = this.createJoinParameter({ join }, newParams);
        }

        if (withDeleted === true || withDeleted === 'true') {
            newParams = newParams.set('withDeleted', 'true');
        }

        return newParams;
    }

    createListRecordParameters<T extends PaginationOption = unknown>(
        options: T,
        pagingOptions: ListPagingOptions<T> = {}
    ): HttpParams {
        // finalize paging Options
        const { httpParams, defaultLimit } = {
            ...DEFAULT_LIST_OPTIONS,
            ...(isObjectLike(pagingOptions) ? pagingOptions : {}),
        } as ListPagingOptions<T>;

        // initial HttpParams
        let params = httpParams || new HttpParams();

        // no options defined
        if (!isObjectLike(options)) {
            return params;
        }

        const { limit, page, nopage, search } = options;

        params = this.createGetRecordParameter(options, params);

        // apply search
        if (search && isString(search)) {
            params = params.set('search', `${search}`);
        }

        // apply sorting
        params = this.createSortParameter(
            options,
            pagingOptions.sortables,
            params
        );

        // disables paging and requests for all records
        if (nopage === 'true') {
            return params.set('nopage', 'true');
        }

        // apply the needed paging request
        const finalizedLimit =
            isNumericInteger(limit) && limit > 0 ? +limit : defaultLimit;

        if (finalizedLimit !== null) {
            params = params.set('limit', `${finalizedLimit}`);
        }

        if (isNumericInteger(page) && page > -1) {
            params = params.set('page', `${page}`);
        }

        return params;
    }

    createDateRangeParameter<T = unknown>(
        params: HttpParams,
        fieldName: string,
        value: T
    ): HttpParams {
        if (!isString(value) && !isDate(value) && !moment.isMoment(value)) {
            return params;
        }

        return params.append(
            fieldName,
            isString(value)
                ? value
                : moment.isMoment(value)
                ? value.format(MOMENT_SQL_DATE_FORMAT)
                : momentize(value).format(MOMENT_SQL_DATE_FORMAT)
        );
    }
}
