--Пользователи и их роли
SELECT u."Id", u."Login" AS "Логин", u."Nickname" AS "Игровое имя", r."Title" AS "Роль в системе"
FROM "Users" u JOIN "Roles" r ON u."RoleId" = r."Id"
ORDER BY r."Title", u."Login";

--Турниры с дисциплиной и статусом
SELECT t."Title" AS "Название турнира", d."Title" AS "Дисциплина", ts."Title" AS "Статус турнира", t."PrizePool" AS "Призовой фонд"
FROM "Tournaments" t JOIN "Disciplines" d ON t."DisciplineId" = d."Id" JOIN "TournamentStatuses" ts ON t."StatusId" = ts."Id"
ORDER BY t."PrizePool" DESC;

--Поиск турниров по названию, где в названии есть слово "Cup"
SELECT t."Title" AS "Название турнира", t."StartDate" AS "Дата начала", t."EndDate" AS "Дата окончания"
FROM "Tournaments" t WHERE t."Title" LIKE '%Cup%'
ORDER BY t."StartDate";

--Количество команд в каждой дисциплине
SELECT d."Title" AS "Дисциплина", COUNT(t."Id") AS "Количество команд"
FROM "Disciplines" d LEFT JOIN "Teams" t ON d."Id" = t."DisciplineId"
GROUP BY d."Title" ORDER BY "Количество команд" DESC;

--Матчи с командами и стадией
SELECT m."Id" AS "Номер матча", ta."Title" AS "Команда A", tb."Title" AS "Команда B", ms."Title" AS "Стадия", m."MatchDate" AS "Дата проведения"
FROM "Matches" m JOIN "Teams" ta ON m."TeamAId" = ta."Id" JOIN "Teams" tb ON m."TeamBId" = tb."Id" JOIN "MatchStages" ms ON m."StageId" = ms."Id"
ORDER BY m."MatchDate";

--Количество заявок на каждый турнир
SELECT t."Title" AS "Название турнира", COUNT(a."Id") AS "Количество заявок"
FROM "Tournaments" t LEFT JOIN "TournamentApplications" a ON t."Id" = a."TournamentId"
GROUP BY t."Title" ORDER BY "Количество заявок" DESC;

--Команды и их капитаны
SELECT tm."Title" AS "Название команды", u."Nickname" AS "Капитан команды"
FROM "Teams" tm JOIN "Users" u ON tm."CaptainId" = u."Id"
ORDER BY tm."Title";

--Результаты матчей с победителем(Null если ничья)
SELECT m."Id" AS "Матч", ta."Title" AS "Команда A", tb."Title" AS "Команда B", mr."ScoreTeamA" AS "Счёт A", mr."ScoreTeamB" AS "Счёт B", tw."Title" AS "Победитель"
FROM "MatchResults" mr JOIN "Matches" m ON mr."MatchId" = m."Id" JOIN "Teams" ta ON m."TeamAId" = ta."Id" JOIN "Teams" tb ON m."TeamBId" = tb."Id" LEFT JOIN "Teams" tw ON mr."WinnerTeamId" = tw."Id"
ORDER BY m."Id";

--Количество матчей в каждом турнире
SELECT t."Title" AS "Название турнира", COUNT(m."Id") AS "Количество матчей"
FROM "Tournaments" t LEFT JOIN "Matches" m ON t."Id" = m."TournamentId"
GROUP BY t."Title" ORDER BY "Количество матчей" DESC;

--Пользователи с никнеймом на S
SELECT u."Login" AS "Логин", u."Nickname" AS "Игровое имя"
FROM "Users" u WHERE u."Nickname" LIKE 'S%'
ORDER BY u."Nickname";

--Логины, содержащие цифры
SELECT u."Login" AS "Логин",
       u."Nickname" AS "Игровое имя"
FROM "Users" u WHERE u."Login" ~ '[0-9]'
ORDER BY u."Login";

--Турниры, у которых призовой фонд выше среднего
SELECT t."Title" AS "Название турнира", t."PrizePool" AS "Призовой фонд"
FROM "Tournaments" t WHERE t."PrizePool" > (SELECT AVG("PrizePool") FROM "Tournaments")
ORDER BY t."PrizePool" DESC;

--Команды, выигравшие более 1 матча
SELECT tm."Title" AS "Команда", COUNT(mr."Id") AS "Количество побед"
FROM "MatchResults" mr JOIN "Teams" tm ON mr."WinnerTeamId" = tm."Id" 
GROUP BY tm."Title" HAVING COUNT(mr."Id") > 1 ORDER BY "Количество побед" DESC;

--Команды, которые участвовали в турнирах, но не выиграли ни одного матча
SELECT tm."Title" AS "Команда"
FROM "Teams" tm WHERE EXISTS (SELECT 1 FROM "TournamentParticipants" tp WHERE tp."TeamId" = tm."Id")
AND NOT EXISTS (SELECT 1 FROM "MatchResults" mr WHERE mr."WinnerTeamId" = tm."Id")
ORDER BY tm."Title";

