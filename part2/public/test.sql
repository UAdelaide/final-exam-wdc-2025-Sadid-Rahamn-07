INSERT INTO Dogs (owner_id, name, size)
VALUES
((SELECT user_id FROM Users WHERE username = 'alice123'), 'john', 'small'),
((SELECT user_id FROM Users WHERE username = 'bobwalker'), 'henry', 'large');