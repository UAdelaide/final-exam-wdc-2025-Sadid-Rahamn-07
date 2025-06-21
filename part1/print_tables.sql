SELECT wa.walker_id, u.username, wr.status, wa.status AS application_status, wr.request_id
FROM WalkApplications wa
JOIN Users u ON wa.walker_id = u.user_id
JOIN WalkRequests wr ON wa.request_id = wr.request_id
WHERE wr.status = 'completed';