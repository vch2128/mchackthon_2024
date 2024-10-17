# curl -X POST "http://localhost:8001/api/techpost" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "content": "Tdddd",
#            "sender_id": "emplqwere123"
#          }'

# curl -X GET http://localhost:8001/api/techposts
# curl -X GET http://localhost:8001/api/techposts/others/emplqwere123
# curl -X GET http://localhost:8001/api/techposts
# curl -X GET http://localhost:8001/api/techposts/sender/emplqwere123

# create employee
curl -X POST "http://localhost:8001/api/techpost" \
     -H "Content-Type: application/json" \
     -d '{
            "content": "yeahyeahyeahyeahy eahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeah",
            "sender_id": "bonnie"
         }'
# {"id":"78965c3c1dff4d8ba5a13e93fde07dd9","name":"dennis","account":"dennis0906","password":"0906"}
# {"id":"af9fa3e96de14cdabc61130faae9dbcc","name":"frank","account":"frank6999","password":"2222"}

# create techpost
# for techpost
# curl -X POST "http://localhost:8001/api/techpost" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "content": "Tdddd",
#            "sender_id": "emplqwere123"
#          }'