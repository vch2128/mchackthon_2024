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
# id = 172d3ea5d9df41d5948bc12b52b7457c
# curl -X POST "http://localhost:8001/api/employee" \
#      -H "Content-Type: application/json" \
#      -d '{
#             "name": "bonnie",
#             "account": "bonniech",
#             "password": "bonnie",
#             "department": "cs engineering",
#             "age": 45,
#             "position": "product manager",
#             "seniority": 10,
#             "region": "taipei"
#          }'

# id = 83fa6df15b784d60bc760e6413cd8269
# curl -X POST "http://localhost:8001/api/emomsg" \
#      -H "Content-Type: application/json" \
#      -d '{
#             "sender_id": "Andrew",
#             "content": "143rqwefqwf",
#             "rcvr_id": "6666"
#          }'
# curl -X POST "http://localhost:8001/api/employee" \
#      -H "Content-Type: application/json" \
#      -d '{
#             "name": "arqfei",
#             "account": "143rqwf",
#             "password": "66efqe",
#             "department": "human resource",
#             "age": 20,
#             "position": "regular employee",
#             "seniority": 1,
#             "region": "taipei"
#          }'

# id = 83fa6df15b784d60bc760e6413cd8269
# curl -X POST "http://localhost:8001/api/employee" \
#      -H "Content-Type: application/json" \
#      -d '{
#             "name": "DENNISSSS",
#             "account": "ccccccccfff",
#             "password": "66wefqwef",
#             "department": "cs engineering",
#             "age": 21,
#             "position": "intern",
#             "seniority": 1,
#             "region": "Kaoshiung"
#          }'
# {"id":"7144dcaa96534cc6bf35b93efa8b7ee4","name":"Frank_testing","account":"cccccccc","password":"$2b$12$1YApLunGTKVA.7p/KFxlCO6cAmlLbb/GQ4unpGGrSQPeO6K42ZPre","department":"cs engineering","age":20,"position":"intern","seniority":1,"region":"Taipei"}

# {"id":"78965c3c1dff4d8ba5a13e93fde07dd9","name":"dennis","account":"dennis0906","password":"0906"}
# {"id":"af9fa3e96de14cdabc61130faae9dbcc","name":"frank","account":"frank6999","password":"2222"}


# create techpost 
# curl -X POST "http://localhost:8001/api/techpost" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "content": "I want to learn to use docker",
#            "sender_id": "7144dcaa96534cc6bf35b93efa8b7ee4"
#          }'


# # curl -X POST "http://localhost:8001/api/search/techpost" \
# #      -H "Content-Type: application/json" \
# #      -d '{
# #            "content": "hello everyone yeahhhh i have a problem of how to code i am a beginner to this. please help me. thank you",
# #            "sender_id": "d3ba2aed43824cdb92db62342c7a06fe",
# #            "topic": "how to code"
# #          }'


# curl -X POST "http://localhost:8001/api/search/techpost" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "content": "hello everyone yeahhhh i have a problem of how to code i am a beginner to this. please help me. thank you",
#            "sender_id": "d3ba2aed43824cdb92db62342c7a06fe",
#            "topic": "how to code"
#          }'

# create tech comment
# curl -X POST "http://localhost:8001/api/techcomment" \
# curl -X POST "http://localhost:8001/api/search/techpost" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "msg": "database schema problem."
#          }'

# create tech comment
# curl -X POST "http://localhost:8001/api/techcomment" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "content": "Database schema should use MongoDB",
#            "sender_id": "emplqwere123",
#            "techpost_id": "708f24c378b64942b61edc3e15533045"
#          }'

# create emo reply
# curl -X POST "http://localhost:8001/api/emoreply" \
#      -H "Content-Type: application/json" \
#      -d '{
#            "content": "haha",
#            "emo_msg_id": "61ea989c65b849d88055992f7beaba3e",
#            "sender_id": "066f32644fac497f9c72bf0e7d12a8c1"
#          }'

# create emo msg
# curl -X POST "http://localhost:8001/api/emomsg"  \
#        -H "Content-Type: application/json" \
#        -d '{
#              "sender_id": "7144dcaa96534cc6bf35b93efa8b7ee4",
#              "content": "I am happy",
#              "rcvr_id": "83fa6df15b784d60bc760e6413cd8269"
#           }'

# curl -X GET http://localhost:8001/api/techposts/techcomments/708f24c378b64942b61edc3e15533045
# curl -X GET http://localhost:8001/api/techposts/708f24c378b64942b61edc3e15533045
# curl -X GET http://localhost:8001/api/emomsg/a9dafa3762d24284be76cd0ddff9c7d0
# curl -X GET http://localhost:8001/api/emomsg/rcvr/83fa6df15b784d60bc760e6413cd8269
# curl -X GET http://localhost:8001/api/emoreply/emomsg/a9dafa3762d24284be76cd0ddff9c7d0
# curl -X GET http://localhost:8001/api/emoreply/sender/2f089e4813ad4d028bc543ff1de4e11e
# curl -X GET http://localhost:8001/api/employees/0445782eb4e4476aa1d3802a1df4f462
# a9dafa3762d24284be76cd0ddff9c7d0
# 4214d9bfda9d4f9696d828aee6b5ba50

# curl -X GET http://localhost:8001/api/employee/embeddings
# curl -X GET http://localhost:8001/api/employee/gptdata/cda5b4b3229d4bac8ae3d37f12619a7b

# test wallet api
# curl -X PUT http://localhost:8001/api/employee/wallet/
# curl -X PUT "http://localhost:8001/api/employee/update_wallet" -H "Content-Type: application/json" -d '{"value": 100, "employee_id": "7144dcaa96534cc6bf35b93efa8b7ee4"}'
# curl -X GET http://localhost:8001/api/employee/get_wallet/7144dcaa96534cc6bf35b93efa8b7ee4
# curl -X GET http://localhost:8001/api/campaigns


curl -X POST "http://localhost:8001/api/campaign" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dinner with dennis",
    "description": "This is a test campaign",
    "price": 2,
    "image_path": "/images/campaign.jpg",
    "quantity": 3,
    "lasting_hours": 72,
    "attenders_id": ["1", "2", "3"]
  }'

