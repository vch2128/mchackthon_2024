curl -X POST "http://localhost:3001/api/techpost" \
     -H "Content-Type: application/json" \
     -d '{
           "content": "This is a new tech post",
           "sender_id": "employee123"
         }'
