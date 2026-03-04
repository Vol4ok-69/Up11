import { createCrudService } from "./crud.factory"

export interface MatchStageReadDto {
    id: number
    title: string | null
}

export interface MatchStageCreateDto {
    title: string | null
}

export interface MatchStageUpdateDto {
    title: string | null
}

export const MatchStagesService = createCrudService<
    MatchStageReadDto,
    MatchStageCreateDto,
    MatchStageUpdateDto
>("/api/MatchStages")
