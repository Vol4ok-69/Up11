import { createCrudService } from "./crud.factory"

export interface TournamentBracketTypeReadDto {
    id: number
    title: string | null
}

export interface TournamentBracketTypeCreateDto {
    title: string | null
}

export interface TournamentBracketTypeUpdateDto {
    title: string | null
}

export const TournamentBracketTypesService = createCrudService<
    TournamentBracketTypeReadDto,
    TournamentBracketTypeCreateDto,
    TournamentBracketTypeUpdateDto
>("/api/TournamentBracketTypes")
