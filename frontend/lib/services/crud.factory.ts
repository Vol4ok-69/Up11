import { apiRequest } from "../api"

export interface CrudService<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
    getAll(): Promise<T[]>
    getById(id: string | number): Promise<T>
    create(data: TCreate): Promise<T>
    update(id: string | number, data: TUpdate): Promise<void>
    delete(id: string | number): Promise<void>
}

export function createCrudService<
    T,
    TCreate = Partial<T>,
    TUpdate = Partial<T>
>(
    baseUrl: string
): CrudService<T, TCreate, TUpdate> {

    return {

        getAll: () =>
            apiRequest<T[]>(baseUrl),

        getById: (id) =>
            apiRequest<T>(`${baseUrl}/${id}`),

        create: (data) =>
            apiRequest<T>(baseUrl, {
                method: "POST",
                body: JSON.stringify(data),
            }),

        update: (id, data) =>
            apiRequest<void>(`${baseUrl}/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            }),

        delete: (id) =>
            apiRequest<void>(`${baseUrl}/${id}`, {
                method: "DELETE",
            }),
    }
}