-- =========================
-- ROLES
-- =========================
INSERT INTO "Roles" ("Id","Title") VALUES
(1,'Администратор'),
(2,'Организатор турнира'),
(3,'Игрок'),
(4,'Гость'),
(5,'Капитан');

-- =========================
-- USERS (пароль любой, потом можно перерегистрироваться)
-- =========================
INSERT INTO "Users"
("Login","PasswordHash","Email","Nickname","RoleId","IsBlocked","IsDeleted")
VALUES
('admin','$2a$11$CpJdTOoGYoQEwlzYTs2l2uHuj6UAP8v6BNfAt2BODFuJVxmgOAOw6','admin@mail.ru','Admin',1,false,false),
('organizer','$2a$11$CpJdTOoGYoQEwlzYTs2l2uHuj6UAP8v6BNfAt2BODFuJVxmgOAOw6','org@mail.ru','Organizer',2,false,false),
('player1','$2a$11$CpJdTOoGYoQEwlzYTs2l2uHuj6UAP8v6BNfAt2BODFuJVxmgOAOw6','p1@mail.ru','PlayerOne',3,false,false),
('player2','$2a$11$CpJdTOoGYoQEwlzYTs2l2uHuj6UAP8v6BNfAt2BODFuJVxmgOAOw6','p2@mail.ru','PlayerTwo',3,false,false),
('player3','$2a$11$CpJdTOoGYoQEwlzYTs2l2uHuj6UAP8v6BNfAt2BODFuJVxmgOAOw6','p3@mail.ru','PlayerThree',3,false,false),
('player4','$2a$11$CpJdTOoGYoQEwlzYTs2l2uHuj6UAP8v6BNfAt2BODFuJVxmgOAOw6','p4@mail.ru','PlayerFour',3,false,false),
('player5','$2a$11$CpJdTOoGYoQEwlzYTs2l2uHuj6UAP8v6BNfAt2BODFuJVxmgOAOw6','p5@mail.ru','PlayerFive',3,false,false),
('player6','$2a$11$CpJdTOoGYoQEwlzYTs2l2uHuj6UAP8v6BNfAt2BODFuJVxmgOAOw6','p6@mail.ru','PlayerSix',3,false,false);

-- =========================
-- DISCIPLINES
-- =========================
INSERT INTO "Disciplines" ("Id","Title","Description") VALUES
(1,'Dota 2','MOBA'),
(2,'Counter-Strike 2','FPS'),
(3,'PUBG: Battlegrounds','Battle Royale'),
(4,'Clash Royale','Strategy'),
(5,'Valorant','Tactical Shooter');

-- =========================
-- TOURNAMENT STATUSES
-- =========================
INSERT INTO "TournamentStatuses" ("Id","Title") VALUES
(1,'Запланирован'),
(2,'Открыт'),
(3,'В процессе'),
(4,'Завершен'),
(5,'Отменен');

-- =========================
-- TOURNAMENT SYSTEMS
-- =========================
INSERT INTO "TournamentSystems" ("Id","Title") VALUES
(1,'single elimination'),
(2,'double elimination'),
(3,'swiss'),
(4,'round robin'),
(5,'group stage');

-- =========================
-- MATCH STAGES
-- =========================
INSERT INTO "MatchStages" ("Id","Title") VALUES
(1,'Групповой этап'),
(2,'Четвертьфинал'),
(3,'Полуфинал'),
(4,'Финал'),
(5,'Матч за 3 место');

-- =========================
-- BRACKET TYPES
-- =========================
INSERT INTO "TournamentBracketTypes" ("Id","Title") VALUES
(1,'Upper'),
(2,'Lower'),
(3,'Final'),
(4,'Main'),
(5,'Swiss');

-- =========================
-- APPLICATION STATUSES
-- =========================
INSERT INTO "ApplicationStatuses" ("Id","Title") VALUES
(1,'На рассмотрении'),
(2,'Одобрена'),
(3,'Отклонена'),
(4,'Отозвана'),
(5,'Завершена');

-- =========================
-- TEAMS
-- =========================
INSERT INTO "Teams"
("Id","Title","DisciplineId","CaptainId","CreatedAt")
VALUES
(1,'Radiant',1,3,CURRENT_DATE),
(2,'Dire',1,4,CURRENT_DATE),
(3,'Mirage',2,5,CURRENT_DATE),
(4,'Inferno',2,6,CURRENT_DATE),
(5,'Phoenix',1,7,CURRENT_DATE);

-- =========================
-- TEAM MEMBERS
-- =========================
INSERT INTO "TeamMembers"
("Id","TeamId","UserId","JoinedAt")
VALUES
(1,1,3,CURRENT_DATE),
(2,2,4,CURRENT_DATE),
(3,3,5,CURRENT_DATE),
(4,4,6,CURRENT_DATE),
(5,5,7,CURRENT_DATE);

-- =========================
-- TOURNAMENTS
-- =========================
INSERT INTO "Tournaments"
("Id","Title","DisciplineId","StartDate","EndDate",
 "PrizePool","MinTeamSize","StatusId","OrganizerId","SystemId","IsDeleted")
VALUES
(1,'Dota Spring Cup',1,CURRENT_DATE,CURRENT_DATE + INTERVAL '7 days',100000,1,2,2,1,false),
(2,'CS Major',2,CURRENT_DATE,CURRENT_DATE + INTERVAL '10 days',200000,1,2,2,1,false),
(3,'PUBG Open',3,CURRENT_DATE,CURRENT_DATE + INTERVAL '5 days',50000,1,1,2,3,false),
(4,'Clash Masters',4,CURRENT_DATE,CURRENT_DATE + INTERVAL '4 days',30000,1,1,2,1,false),
(5,'Dota Championship',1,CURRENT_DATE,CURRENT_DATE + INTERVAL '6 days',150000,1,3,2,2,false);

-- =========================
-- TOURNAMENT PARTICIPANTS
-- =========================
INSERT INTO "TournamentParticipants"
("Id","TournamentId","TeamId","IsDeleted")
VALUES
(1,1,1,false),
(2,1,2,false),
(3,1,5,false),
(4,2,3,false),
(5,2,4,false);

-- =========================
-- MATCHES
-- =========================
INSERT INTO "Matches"
("Id","TournamentId","TeamAId","TeamBId",
 "MatchDate","StageId","IsFinished")
VALUES
(1,1,1,2,CURRENT_TIMESTAMP,2,false),
(2,2,3,4,CURRENT_TIMESTAMP,2,false),
(3,1,1,5,CURRENT_TIMESTAMP,1,false),
(4,1,2,5,CURRENT_TIMESTAMP,1,false),
(5,2,3,4,CURRENT_TIMESTAMP,3,false);

-- =========================
-- MATCH RESULTS
-- =========================
INSERT INTO "MatchResults"
("Id","MatchId","ScoreTeamA","ScoreTeamB","WinnerTeamId")
VALUES
(1,1,2,1,1),
(2,2,16,10,3),
(3,3,1,0,1),
(4,4,0,1,5),
(5,5,16,14,3);
