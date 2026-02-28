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
    "IsDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("RoleId") REFERENCES "Roles"("Id")
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
    FOREIGN KEY ("DisciplineId") REFERENCES "Disciplines"("Id"),
    FOREIGN KEY ("CaptainId") REFERENCES "Users"("Id")
);

CREATE TABLE "TeamMembers" (
    "Id" SERIAL PRIMARY KEY,
    "TeamId" INT NOT NULL,
    "UserId" INT NOT NULL,
    "JoinedAt" DATE NOT NULL,
    UNIQUE ("TeamId","UserId"),
    FOREIGN KEY ("TeamId") REFERENCES "Teams"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("UserId") REFERENCES "Users"("Id") ON DELETE CASCADE
);

CREATE TABLE "TournamentStatuses" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE "Tournaments" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(150) NOT NULL,
    "DisciplineId" INT NOT NULL,
    "StartDate" DATE NOT NULL,
    "EndDate" DATE NOT NULL,
    "PrizePool" NUMERIC(12,2) NOT NULL CHECK ("PrizePool" >= 0),
    "StatusId" INT NOT NULL,
    "OrganizerId" INT NOT NULL,
    FOREIGN KEY ("DisciplineId") REFERENCES "Disciplines"("Id"),
    FOREIGN KEY ("StatusId") REFERENCES "TournamentStatuses"("Id"),
    FOREIGN KEY ("OrganizerId") REFERENCES "Users"("Id")
);

CREATE TABLE "ApplicationStatuses" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE "TournamentApplications" (
    "Id" SERIAL PRIMARY KEY,
    "TournamentId" INT NOT NULL,
    "TeamId" INT NOT NULL,
    "StatusId" INT NOT NULL,
    "AppliedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("TournamentId","TeamId"),
    FOREIGN KEY ("TournamentId") REFERENCES "Tournaments"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("TeamId") REFERENCES "Teams"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("StatusId") REFERENCES "ApplicationStatuses"("Id")
);

CREATE TABLE "TournamentParticipants" (
    "Id" SERIAL PRIMARY KEY,
    "TournamentId" INT NOT NULL,
    "TeamId" INT NOT NULL,
    UNIQUE ("TournamentId","TeamId"),
    FOREIGN KEY ("TournamentId") REFERENCES "Tournaments"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("TeamId") REFERENCES "Teams"("Id") ON DELETE CASCADE
);

CREATE TABLE "MatchStages" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE "Matches" (
    "Id" SERIAL PRIMARY KEY,
    "TournamentId" INT NOT NULL,
    "TeamAId" INT NOT NULL,
    "TeamBId" INT NOT NULL,
    "MatchDate" TIMESTAMP NOT NULL,
    "StageId" INT NOT NULL,
    "IsFinished" BOOLEAN NOT NULL DEFAULT FALSE,
    CHECK ("TeamAId" <> "TeamBId"),
    FOREIGN KEY ("TournamentId") REFERENCES "Tournaments"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("TeamAId") REFERENCES "Teams"("Id"),
    FOREIGN KEY ("TeamBId") REFERENCES "Teams"("Id"),
    FOREIGN KEY ("StageId") REFERENCES "MatchStages"("Id")
);

CREATE TABLE "MatchResults" (
    "Id" SERIAL PRIMARY KEY,
    "MatchId" INT NOT NULL UNIQUE,
    "ScoreTeamA" INT NOT NULL CHECK ("ScoreTeamA" >= 0),
    "ScoreTeamB" INT NOT NULL CHECK ("ScoreTeamB" >= 0),
    "WinnerTeamId" INT,
    FOREIGN KEY ("MatchId") REFERENCES "Matches"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("WinnerTeamId") REFERENCES "Teams"("Id")
);
	
ALTER TABLE "MatchResults"
ADD CONSTRAINT "CHK_Winner_Logic"
CHECK (
    ("ScoreTeamA" = "ScoreTeamB" AND "WinnerTeamId" IS NULL)
    OR
    ("ScoreTeamA" <> "ScoreTeamB" AND "WinnerTeamId" IS NOT NULL)
);
