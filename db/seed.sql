INSERT INTO "Roles" ("Title") VALUES
('Администратор'),
('Организатор турнира'),
('Игрок'),
('Гость'),
('Капитан');

INSERT INTO "Users"
("Login","PasswordHash","Email","Nickname","RoleId","IsBlocked","IsDeleted")
VALUES
('admin','$2a$11$CpJdTOoGYoQEwlzYTs2l2uHuj6UAP8v6BNfAt2BODFuJVxmgOAOw6','admin@mail.ru','Admin',1,false,false),
('organizer','$2a$11$CpJdTOoGYoQEwlzYTs2l2uHuj6UAP8v6BNfAt2BODFuJVxmgOAOw6','org@mail.ru','Organizer',2,false,false),

('s1','$2a$11$hash','s1@mail.ru','Shadow',3,false,false),
('s2','$2a$11$hash','s2@mail.ru','Storm',3,false,false),
('s3','$2a$11$hash','s3@mail.ru','Snake',3,false,false),
('s4','$2a$11$hash','s4@mail.ru','Spectre',3,false,false),

('player1','$2a$11$hash','p1@mail.ru','Blaze',3,false,false),
('player2','$2a$11$hash','p2@mail.ru','Razor',3,false,false),
('player3','$2a$11$hash','p3@mail.ru','Phantom',3,false,false),
('player4','$2a$11$hash','p4@mail.ru','Vortex',3,false,false),
('player5','$2a$11$hash','p5@mail.ru','Inferno',3,false,false),
('player6','$2a$11$hash','p6@mail.ru','Mirage',3,false,false),
('player7','$2a$11$hash','p7@mail.ru','Titan',3,false,false),
('player8','$2a$11$hash','p8@mail.ru','Nova',3,false,false),
('player9','$2a$11$hash','p9@mail.ru','Zenith',3,false,false),
('player10','$2a$11$hash','p10@mail.ru','Solar',3,false,false),
('player11','$2a$11$hash','p11@mail.ru','Echo',3,false,false),
('player12','$2a$11$hash','p12@mail.ru','Atlas',3,false,false),
('player13','$2a$11$hash','p13@mail.ru','Viper',3,false,false),
('player14','$2a$11$hash','p14@mail.ru','Ghost',3,false,false),
('player15','$2a$11$hash','p15@mail.ru','Kraken',3,false,false),
('player16','$2a$11$hash','p16@mail.ru','Falcon',3,false,false),
('player17','$2a$11$hash','p17@mail.ru','Blizzard',3,false,false),
('player18','$2a$11$hash','p18@mail.ru','Reaper',3,false,false),
('player19','$2a$11$hash','p19@mail.ru','Orion',3,false,false),
('player20','$2a$11$hash','p20@mail.ru','Comet',3,false,false);

INSERT INTO "Disciplines" ("Title","Description") VALUES
('Dota 2','MOBA'),
('Counter-Strike 2','FPS'),
('PUBG','Battle Royale'),
('Valorant','Shooter'),
('Clash Royale','Strategy');

INSERT INTO "TournamentStatuses" ("Title") VALUES
('Запланирован'),
('Открыт'),
('В процессе'),
('Завершен'),
('Отменен');

INSERT INTO "TournamentSystems" ("Title") VALUES
('single elimination'),
('double elimination'),
('swiss'),
('round robin'),
('group stage');

INSERT INTO "MatchStages" ("Title") VALUES
('Групповой этап'),
('Четвертьфинал'),
('Полуфинал'),
('Финал'),
('Матч за 3 место');

INSERT INTO "TournamentBracketTypes" ("Title") VALUES
('Upper'),
('Lower'),
('Final'),
('Main'),
('Swiss');

INSERT INTO "ApplicationStatuses" ("Title") VALUES
('На рассмотрении'),
('Одобрена'),
('Отклонена'),
('Отозвана'),
('Завершена');

INSERT INTO "Teams"
("Title","DisciplineId","CaptainId","CreatedAt")
VALUES
('Radiant',1,3,CURRENT_DATE),
('Dire',1,4,CURRENT_DATE),
('Sentinel',1,7,CURRENT_DATE),
('Ancients',1,8,CURRENT_DATE),

('Mirage',2,9,CURRENT_DATE),
('Inferno',2,10,CURRENT_DATE),
('Dust',2,11,CURRENT_DATE),
('Overpass',2,12,CURRENT_DATE),

('Phoenix',3,13,CURRENT_DATE),
('Dragon',3,14,CURRENT_DATE),
('Kraken',3,15,CURRENT_DATE),
('Titan',3,16,CURRENT_DATE),

('Valor',4,17,CURRENT_DATE),
('Nova',4,18,CURRENT_DATE),
('Spectre',4,19,CURRENT_DATE),
('Storm',4,20,CURRENT_DATE);

INSERT INTO "TeamMembers"
("TeamId","UserId","JoinedAt")
VALUES
(1,3,CURRENT_DATE),
(2,4,CURRENT_DATE),
(3,7,CURRENT_DATE),
(4,8,CURRENT_DATE),
(5,9,CURRENT_DATE),
(6,10,CURRENT_DATE),
(7,11,CURRENT_DATE),
(8,12,CURRENT_DATE),
(9,13,CURRENT_DATE),
(10,14,CURRENT_DATE),
(11,15,CURRENT_DATE),
(12,16,CURRENT_DATE),
(13,17,CURRENT_DATE),
(14,18,CURRENT_DATE),
(15,19,CURRENT_DATE),
(16,20,CURRENT_DATE);

INSERT INTO "Tournaments"
("Title","DisciplineId","StartDate","EndDate","PrizePool","MinTeamSize","StatusId","OrganizerId","SystemId","IsDeleted")
VALUES
('Dota Spring Cup',1,CURRENT_DATE,CURRENT_DATE+INTERVAL '7 days',100000,1,2,2,1,false),
('Dota Summer Cup',1,CURRENT_DATE,CURRENT_DATE+INTERVAL '7 days',150000,1,2,2,1,false),
('CS Major Cup',2,CURRENT_DATE,CURRENT_DATE+INTERVAL '10 days',200000,1,2,2,1,false),
('CS Winter Cup',2,CURRENT_DATE,CURRENT_DATE+INTERVAL '8 days',120000,1,1,2,1,false),
('PUBG Global Cup',3,CURRENT_DATE,CURRENT_DATE+INTERVAL '5 days',50000,1,1,2,3,false),
('Valorant Masters',4,CURRENT_DATE,CURRENT_DATE+INTERVAL '6 days',70000,1,1,2,3,false);

INSERT INTO "TournamentParticipants"
("TournamentId","TeamId","IsDeleted")
VALUES
(1,1,false),(1,2,false),(1,3,false),(1,4,false),(1,5,false),(1,6,false),(1,7,false),(1,8,false),
(2,9,false),(2,10,false),(2,11,false),(2,12,false),(2,13,false),(2,14,false),(2,15,false),(2,16,false);

INSERT INTO "Matches"
("TournamentId","TeamAId","TeamBId","MatchDate","StageId","IsFinished")
VALUES
(1,1,2,CURRENT_TIMESTAMP,2,false),
(1,3,4,CURRENT_TIMESTAMP,2,false),
(1,5,6,CURRENT_TIMESTAMP,2,false),
(1,7,8,CURRENT_TIMESTAMP,2,false),

(1,1,3,CURRENT_TIMESTAMP,3,false),
(1,5,7,CURRENT_TIMESTAMP,3,false),

(1,1,5,CURRENT_TIMESTAMP,4,false),
(1,3,7,CURRENT_TIMESTAMP,5,false),

(2,9,10,CURRENT_TIMESTAMP,2,false),
(2,11,12,CURRENT_TIMESTAMP,2,false),
(2,13,14,CURRENT_TIMESTAMP,2,false),
(2,15,16,CURRENT_TIMESTAMP,2,false);

INSERT INTO "MatchResults"
("MatchId","ScoreTeamA","ScoreTeamB","WinnerTeamId")
VALUES
(1,2,1,1),
(2,2,0,3),
(3,1,2,6),
(4,0,2,8),

(5,2,0,1),
(6,2,1,5),

(9,2,1,9),
(10,2,0,11),
(11,1,2,14),
(12,2,1,15);