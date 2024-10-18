# curl -X POST "http://localhost:8001/api/techpost" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "content": "Tdddd",
#            "sender_id": "emplqwere123"
#          }'


# curl -X GET http://localhost:8001/api/techposts/others/emplqwere123
# curl -X GET http://localhost:8001/api/techposts
# curl -X GET http://localhost:8001/api/techposts/sender/d61dc499bcad41aeaa3f3f3e37e92840

# create employee
# curl -X POST "http://localhost:8001/api/techpost" \
#      -H "Content-Type: application/json" \
#      -d '{
#             "content": "yeahyeahyeahyeahy eahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeahyeah",
#             "sender_id": "bonnie"
#          }'
# {"id":"78965c3c1dff4d8ba5a13e93fde07dd9","name":"dennis","account":"dennis0906","password":"0906"}
# {"id":"af9fa3e96de14cdabc61130faae9dbcc","name":"frank","account":"frank6999","password":"2222"}

# create techpost 
curl -X POST "http://localhost:8001/api/techpost" \
     -H "Content-Type: application/json" \
     -d '{
           "content": "hello everyone yeahhhh i have a problem of how to code i am a beginner to this. please help me. thank you",
           "sender_id": "d3ba2aed43824cdb92db62342c7a06fe",
           "topic": "how to code"
         }'

# create tech comment
# curl -X POST "http://localhost:8001/api/techcomment" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "content": "Tdddd",
#            "sender_id": "emplqwere123",
#            "techpost_id": "d61dc499bcad41aeaa3f3f3e37e92840"
#          }'

# curl -X GET http://localhost:8001/api/techposts/techcomments/d61dc499bcad41aeaa3f3f3e37e92840
# curl -X GET http://localhost:8001/api/techposts/d61dc499bcad41aeaa3f3f3e37e92840