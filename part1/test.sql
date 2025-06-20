INSERT INTO Users (username, email, password_hash, role)
VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('dave369', 'dave@example.com', 'hashed101', 'walker'),
('emily123', 'emily@example.com', 'hashed202', 'owner');


INSERT INTO Dogs (owner_id, name, size)
VALUES
((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
((SELECT user_id FROM Users WHERE username = 'dave369'), 'Charlie', 'large'),
((SELECT user_id FROM Users WHERE username = 'emily123'), 'Daisy', 'medium'),
((SELECT user_id FROM Users WHERE username = 'bobwalker'), 'Rocky', 'small');

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
VALUES
((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
((SELECT dog_id FROM Dogs WHERE name = 'Charlie'), '2025-06-11 10:00:00', 60, 'Botanic Gardens', 'open'),
((SELECT dog_id FROM Dogs WHERE name = 'Daisy'), '2025-06-12 07:15:00', 30, 'North Terrace', 'cancelled'),
((SELECT dog_id FROM Dogs WHERE name = 'Rocky'), '2025-06-12 07:15:00', 15, 'North Terrace', 'cancelled'),