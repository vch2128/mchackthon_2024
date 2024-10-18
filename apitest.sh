# curl -X POST "http://localhost:8001/api/techpost" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "content": "Tdddd",
#            "sender_id": "emplqwere123"
#          }'


# curl -X GET http://localhost:8001/api/techposts/others/emplqwere123
# curl -X GET http://localhost:8001/api/techposts
# curl -X GET http://localhost:8001/api/techposts/sender/emplqwere123

# create employee
# id = 2f089e4813ad4d028bc543ff1de4e11e
# curl -X POST "http://localhost:8001/api/employee" \
#      -H "Content-Type: application/json" \
#      -d '{
#             "name": "denniseee",
#             "account": "143rqwefqwf",
#             "password": "6666",
#             "department": "cs engineering"
#          }'

# id = 83fa6df15b784d60bc760e6413cd8269
# curl -X POST "http://localhost:8001/api/employee" \
#      -H "Content-Type: application/json" \
#      -d '{
#             "name": "Andrew",
#             "account": "143rqwefqwf",
#             "password": "6666",
#             "department": "cs engineering"
#          }'

# {"id":"78965c3c1dff4d8ba5a13e93fde07dd9","name":"dennis","account":"dennis0906","password":"0906"}
# {"id":"af9fa3e96de14cdabc61130faae9dbcc","name":"frank","account":"frank6999","password":"2222"}

# create emo msg
# curl -X POST "http://localhost:8001/api/emomsg" \
#     -H "Content-Type: application/json" \
#     -d '{  
#         "content": "i want to cry",
#         "sender_id": "a9dafa3762d24284be76cd0ddff9c7d0",
#         "rcvr_id": "2f089e4813ad4d028bc543ff1de4e11e"
#         }'

# create techpost 
# curl -X POST "http://localhost:8001/api/techpost" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "content": "I have some database schema problem.",
#            "sender_id": "2f089e4813ad4d028bc543ff1de4e11e"
#          }'


curl -X POST "http://localhost:8001/api/search/techpost" \
     -H "Content-Type: application/json" \
     -d '{
           "msg": "database schema problem."
         }'

# create tech comment
# curl -X POST "http://localhost:8001/api/techcomment" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "content": "Database schema should use MongoDB",
#            "sender_id": "emplqwere123",
#            "techpost_id": "fcc852c7eee944f48c228910d2d060de"
#          }'

# create emo reply
# curl -X POST "http://localhost:8001/api/emoreply" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "content": "haha",
#            "emo_msg_id": "ed4057c227f5476cb48461f2b20e0c42",
#            "sender_id": "2f089e4813ad4d028bc543ff1de4e11e"
#          }'

# curl -X GET http://localhost:8001/api/techposts/techcomments/d61dc499bcad41aeaa3f3f3e37e92840
# curl -X GET http://localhost:8001/api/techposts/708f24c378b64942b61edc3e15533045
# curl -X GET http://localhost:8001/api/emomsg/a9dafa3762d24284be76cd0ddff9c7d0
# curl -X GET http://localhost:8001/api/emomsg/rcvr/83fa6df15b784d60bc760e6413cd8269
# curl -X GET http://localhost:8001/api/emoreply/emomsg/a9dafa3762d24284be76cd0ddff9c7d0
curl -X GET http://localhost:8001/api/emoreply/sender/2f089e4813ad4d028bc543ff1de4e11e
# a9dafa3762d24284be76cd0ddff9c7d0
# 4214d9bfda9d4f9696d828aee6b5ba50