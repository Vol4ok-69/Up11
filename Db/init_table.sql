CREATE TABLE "Roles" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE "Users" (
    "Id" SERIAL PRIMARY KEY,
    "Login" VARCHAR(50) NOT NULL UNIQUE,
    "PasswordHash" VARCHAR(255) NOT NULL,
    "Email" VARCHAR(100) NOT NULL UNIQUE,
    "Nickname" VARCHAR(50) NOT NULL,
    "RoleId" INT NOT NULL,
    "IsBlocked" BOOLEAN NOT NULL DEFAULT FALSE,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FK_Users_Roles"
        FOREIGN KEY ("RoleId")
        REFERENCES "Roles"("Id")
        ON DELETE RESTRICT
);

CREATE TABLE "Disciplines" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(100) NOT NULL UNIQUE,
    "Description" TEXT
);

CREATE TABLE "Teams" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(100) NOT NULL UNIQUE,
    "DisciplineId" INT NOT NULL,
    "CaptainId" INT NOT NULL,
    "CreatedAt" DATE NOT NULL,
    CONSTRAINT "FK_Teams_Disciplines"
        FOREIGN KEY ("DisciplineId")
        REFERENCES "Disciplines"("Id")
        ON DELETE RESTRICT,
    CONSTRAINT "FK_Teams_Captain"
        FOREIGN KEY ("CaptainId")
        REFERENCES "Users"("Id")
        ON DELETE RESTRICT
);

CREATE TABLE "TeamMembers" (
    "Id" SERIAL PRIMARY KEY,
    "TeamId" INT NOT NULL,
    "UserId" INT NOT NULL,
    "JoinedAt" DATE NOT NULL,
    CONSTRAINT "FK_TeamMembers_Teams"
        FOREIGN KEY ("TeamId")
        REFERENCES "Teams"("Id")
        ON DELETE CASCADE,
    CONSTRAINT "FK_TeamMembers_Users"
        FOREIGN KEY ("UserId")
        REFERENCES "Users"("Id")
        ON DELETE CASCADE,
    CONSTRAINT "UQ_TeamMembers"
        UNIQUE ("TeamId", "UserId")
);

CREATE TABLE "Tournaments" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(150) NOT NULL,
    "DisciplineId" INT NOT NULL,
    "StartDate" DATE NOT NULL,
    "EndDate" DATE NOT NULL,
    "PrizePool" NUMERIC(12,2) NOT NULL CHECK ("PrizePool" >= 0),
    "Status" VARCHAR(30) NOT NULL,
    "OrganizerId" INT NOT NULL,
    CONSTRAINT "FK_Tournaments_Discipline"
        FOREIGN KEY ("DisciplineId")
        REFERENCES "Disciplines"("Id")
        ON DELETE RESTRICT,
    CONSTRAINT "FK_Tournaments_Organizer"
        FOREIGN KEY ("OrganizerId")
        REFERENCES "Users"("Id")
        ON DELETE RESTRICT
);

CREATE TABLE "TournamentApplications" (
    "Id" SERIAL PRIMARY KEY,
    "TournamentId" INT NOT NULL,
    "TeamId" INT NOT NULL,
    "Status" VARCHAR(30) NOT NULL,
    "AppliedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FK_Applications_Tournament"
        FOREIGN KEY ("TournamentId")
        REFERENCES "Tournaments"("Id")
        ON DELETE CASCADE,
    CONSTRAINT "FK_Applications_Team"
        FOREIGN KEY ("TeamId")
        REFERENCES "Teams"("Id")
        ON DELETE CASCADE,
    CONSTRAINT "UQ_TournamentApplication"
        UNIQUE ("TournamentId", "TeamId")
);

CREATE TABLE "TournamentParticipants" (
    "Id" SERIAL PRIMARY KEY,
    "TournamentId" INT NOT NULL,
    "TeamId" INT NOT NULL,
    CONSTRAINT "FK_Participants_Tournament"
        FOREIGN KEY ("TournamentId")
        REFERENCES "Tournaments"("Id")
        ON DELETE CASCADE,
    CONSTRAINT "FK_Participants_Team"
        FOREIGN KEY ("TeamId")
        REFERENCES "Teams"("Id")
        ON DELETE CASCADE,
    CONSTRAINT "UQ_TournamentParticipant"
        UNIQUE ("TournamentId", "TeamId")
);

CREATE TABLE "Matches" (
    "Id" SERIAL PRIMARY KEY,
    "TournamentId" INT NOT NULL,
    "TeamAId" INT NOT NULL,
    "TeamBId" INT NOT NULL,
    "MatchDate" TIMESTAMP NOT NULL,
    "Stage" VARCHAR(50) NOT NULL,
    "IsFinished" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT "FK_Matches_Tournament"
        FOREIGN KEY ("TournamentId")
        REFERENCES "Tournaments"("Id")
        ON DELETE CASCADE,
    CONSTRAINT "FK_Matches_TeamA"
        FOREIGN KEY ("TeamAId")
        REFERENCES "Teams"("Id")
        ON DELETE RESTRICT,
    CONSTRAINT "FK_Matches_TeamB"
        FOREIGN KEY ("TeamBId")
        REFERENCES "Teams"("Id")
        ON DELETE RESTRICT,
    CONSTRAINT "CHK_DifferentTeams"
        CHECK ("TeamAId" <> "TeamBId")
);

CREATE TABLE "MatchResults" (
    "Id" SERIAL PRIMARY KEY,
    "MatchId" INT NOT NULL UNIQUE,
    "ScoreTeamA" INT NOT NULL CHECK ("ScoreTeamA" >= 0),
    "ScoreTeamB" INT NOT NULL CHECK ("ScoreTeamB" >= 0),
    "WinnerTeamId" INT NOT NULL,
    CONSTRAINT "FK_Results_Match"
        FOREIGN KEY ("MatchId")
        REFERENCES "Matches"("Id")
        ON DELETE CASCADE,
    CONSTRAINT "FK_Results_Winner"
        FOREIGN KEY ("WinnerTeamId")
        REFERENCES "Teams"("Id")
        ON DELETE RESTRICT
);