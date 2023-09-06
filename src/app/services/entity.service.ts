import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Entity } from '../models/entity';

@Injectable()
export class EntityService {
    private BASE_URL = 'http://localhost:3000';

    constructor(private http: HttpClient) {}

    addEntity(payload: Entity[]): Observable<Entity[]> {
        const url = `${this.BASE_URL}/add-entity`;
        return this.http.post<Entity[]>(url, payload);
    }

    getEntities(token: string): Observable<Entity[]> {
        const url = `${this.BASE_URL}/get-entities`;
        return this.http.post<Entity[]>(url, { token });
    }
}
