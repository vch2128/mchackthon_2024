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
# id = 2f089e4813ad4d028bc543ff1de4e11e
# curl -X POST "http://localhost:8001/api/employee" \
#      -H "Content-Type: application/json" \
#      -d '{
#             "name": "denniseee",
#             "account": "143rqwefqwf",
#             "password": "6666",
#             "department": "cs engineering",
#             "age": 20,
#             "position": "intern"
#          }'

# id = 83fa6df15b784d60bc760e6413cd8269
# curl -X POST "http://localhost:8001/api/employee" \
#      -H "Content-Type: application/json" \
#      -d '{
#             "name": "Frank",
#             "account": "cccccccc",
#             "password": "6666",
#             "department": "cs engineering",
#             "age": 20,
#             "position": "intern",
#             "seniority": 1,
#             "region": "Taipei"
#          }'

# {"id":"78965c3c1dff4d8ba5a13e93fde07dd9","name":"dennis","account":"dennis0906","password":"0906"}
# {"id":"af9fa3e96de14cdabc61130faae9dbcc","name":"frank","account":"frank6999","password":"2222"}

# create emo msg
curl -X POST "http://localhost:8001/api/emomsg" \
    -H "Content-Type: application/json" \
    -d '{  
        "content": "want to go to the beach",
        "sender_id": "6bdfeb28d98b4ee6838d1906b194b672"
        }'

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
           "content": "hello everyone yeahhhh i have a problem of how to code i am a beginner to this. please help me. thank you",
           "sender_id": "d3ba2aed43824cdb92db62342c7a06fe",
           "topic": "how to code"
         }'

# create tech comment
# curl -X POST "http://localhost:8001/api/techcomment" \
# curl -X POST "http://localhost:8001/api/search/techpost" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "msg": "database schema problem."
#          }'

# create tech comment
curl -X POST "http://localhost:8001/api/techcomment" \
     -H "Content-Type: application/json" \
     -d '{
           "content": "Database schema should use MongoDB",
           "sender_id": "emplqwere123",
           "techpost_id": "708f24c378b64942b61edc3e15533045"
         }'

# create emo reply
# curl -X POST "http://localhost:8001/api/emoreply" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "content": "haha",
#            "emo_msg_id": "ed4057c227f5476cb48461f2b20e0c42",
#            "sender_id": "2f089e4813ad4d028bc543ff1de4e11e"
#          }'

# curl -X GET http://localhost:8001/api/techposts/techcomments/708f24c378b64942b61edc3e15533045
# curl -X GET http://localhost:8001/api/techposts/708f24c378b64942b61edc3e15533045
# curl -X GET http://localhost:8001/api/emomsg/a9dafa3762d24284be76cd0ddff9c7d0
# curl -X GET http://localhost:8001/api/emomsg/rcvr/83fa6df15b784d60bc760e6413cd8269
# curl -X GET http://localhost:8001/api/emoreply/emomsg/a9dafa3762d24284be76cd0ddff9c7d0
# curl -X GET http://localhost:8001/api/emoreply/sender/2f089e4813ad4d028bc543ff1de4e11e
# a9dafa3762d24284be76cd0ddff9c7d0
# 4214d9bfda9d4f9696d828aee6b5ba50