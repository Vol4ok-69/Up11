INSERT INTO "Roles" ("Title") VALUES
('Администратор'),
('Организатор турнира'),
('Игрок'),
('Гость'),
('Капитан');

INSERT INTO "Users" ("Login","PasswordHash","Email","Nickname","RoleId")
VALUES
('admin','h1','admin@mail.ru','Admin',1),
('org1','h2','org1@mail.ru','OrganizerPro',2),
('player1','h3','p1@mail.ru','Shadow',3),
('player2','h4','p2@mail.ru','Blaze',5),
('player3','h5','p3@mail.ru','Sniper',3),
('player4','h6','p4@mail.ru','Phoenix',3);

INSERT INTO "Disciplines" ("Title","Description") VALUES
('Dota 2','MOBA'),
('Counter-Strike 2','Shooter'),
('PUBG','Battle Royale'),
('Clash Royale','Mobile strategy'),
('Valorant','Shooter');

INSERT INTO "TournamentStatuses" ("Title") VALUES
('Регистрация'), 
('Открыт'),      
('В процессе'),  
('Завершен'),    
('Черновик'),    
('Отменен');     

INSERT INTO "ApplicationStatuses" ("Title") VALUES
('На рассмотрении'),
('Одобрена'),
('Отклонена'),
('Отозвана'),
('Завершена');

INSERT INTO "MatchStages" ("Title") VALUES
('Групповой этап'),
('Четвертьфинал'),
('Полуфинал'),
('Финал'),
('Гранд-финал');

INSERT INTO "Teams" ("Title","DisciplineId","CaptainId","CreatedAt") VALUES
('CyberStorm',1,4,'2026-02-01'),
('NightRaid',1,3,'2026-02-02'),
('FireLine',2,5,'2026-02-03'),
('SkyForce',2,6,'2026-02-04'),
('RoyalKings',4,4,'2026-02-05');

INSERT INTO "TeamMembers" ("TeamId","UserId","JoinedAt") VALUES
(1,4,'2026-02-01'),
(1,3,'2026-02-01'),
(2,3,'2026-02-02'),
(3,5,'2026-02-03'),
(4,6,'2026-02-04');

INSERT INTO "Tournaments"
("Title","DisciplineId","StartDate","EndDate","PrizePool","MinTeamSize","StatusId","OrganizerId")
VALUES
('Dota Spring Cup',1,'2026-03-10','2026-03-20',100000,5,2,2),
('CS Winter Cup',2,'2026-04-01','2026-04-10',150000,5,1,2),
('PUBG Masters',3,'2026-05-01','2026-05-15',200000,4,1,2),
('Clash Royale Open',4,'2026-06-01','2026-06-05',50000,2,4,2),
('Valorant Pro League',5,'2026-07-01','2026-07-20',250000,5,1,2);

INSERT INTO "TournamentApplications"
("TournamentId","TeamId","StatusId")
VALUES
(1,1,2),
(1,2,1),
(2,3,2),
(2,4,3),
(4,5,2);

INSERT INTO "TournamentParticipants"
("TournamentId","TeamId")
VALUES
(1,1),
(2,3),
(4,5),
(2,4),
(1,2);

INSERT INTO "Matches"
("TournamentId","TeamAId","TeamBId","MatchDate","StageId","IsFinished")
VALUES
(1,1,2,'2026-03-11 18:00',1,true),
(2,3,4,'2026-04-02 19:00',3,true),
(4,5,1,'2026-06-02 15:00',4,false),
(1,2,1,'2026-03-12 18:00',1,false),
(2,4,3,'2026-04-03 20:00',4,true);

INSERT INTO "MatchResults"
("MatchId","ScoreTeamA","ScoreTeamB","WinnerTeamId")
VALUES
(1,2,1,1),
(2,16,10,3),
(5,16,14,4),
(3,0,0,NULL),
(4,1,2,1);
