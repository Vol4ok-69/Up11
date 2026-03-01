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

CREATE TABLE "TournamentSystems" (
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
    "MinTeamSize" INT NOT NULL CHECK ("MinTeamSize" > 0),
    "StatusId" INT NOT NULL,
    "OrganizerId" INT NOT NULL,
    "SystemId" INT NOT NULL,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY ("DisciplineId") REFERENCES "Disciplines"("Id"),
    FOREIGN KEY ("StatusId") REFERENCES "TournamentStatuses"("Id"),
    FOREIGN KEY ("OrganizerId") REFERENCES "Users"("Id"),
    FOREIGN KEY ("SystemId") REFERENCES "TournamentSystems"("Id")
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
    "IsDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE ("TournamentId","TeamId"),
    FOREIGN KEY ("TournamentId") REFERENCES "Tournaments"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("TeamId") REFERENCES "Teams"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("StatusId") REFERENCES "ApplicationStatuses"("Id")
);

CREATE TABLE "TournamentParticipants" (
    "Id" SERIAL PRIMARY KEY,
    "TournamentId" INT NOT NULL,
    "TeamId" INT NOT NULL,
    "IsDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
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

CREATE TABLE "TournamentApplicationStatusHistory" (
    "Id" SERIAL PRIMARY KEY,
    "ApplicationId" INT NOT NULL,
    "OldStatusId" INT NOT NULL,
    "NewStatusId" INT NOT NULL,
    "ChangedByUserId" INT NOT NULL,
    "ChangedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("ApplicationId") REFERENCES "TournamentApplications"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("OldStatusId") REFERENCES "ApplicationStatuses"("Id"),
    FOREIGN KEY ("NewStatusId") REFERENCES "ApplicationStatuses"("Id"),
    FOREIGN KEY ("ChangedByUserId") REFERENCES "Users"("Id")
);

CREATE TABLE "TournamentBracketTypes" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE "TournamentBrackets" (
    "Id" SERIAL PRIMARY KEY,
    "TournamentId" INT NOT NULL,
    "StageId" INT NOT NULL,
    "Position" INT NOT NULL,
    "MatchId" INT NULL,
    "ParentBracketId" INT NULL,
    "SlotInParent" INT NULL,
    "BracketTypeId" INT NOT NULL DEFAULT 1,
    FOREIGN KEY ("TournamentId") REFERENCES "Tournaments"("Id") ON DELETE CASCADE,
    FOREIGN KEY ("StageId") REFERENCES "MatchStages"("Id"),
    FOREIGN KEY ("MatchId") REFERENCES "Matches"("Id"),
    FOREIGN KEY ("BracketTypeId") REFERENCES "TournamentBracketTypes"("Id"),
    FOREIGN KEY ("ParentBracketId") REFERENCES "TournamentBrackets"("Id")
);


