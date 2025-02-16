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
#             "region": "taipei",
#             "description": "I am a bad guy"
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

# id = 6eea426c67114dfc94a89d12749274cf
# curl -X POST "http://localhost:8001/api/employee" \
#      -H "Content-Type: application/json" \
#      -d '{
#             "name": "Frank",
#             "account": "cccccc",
#             "password": "Frank",
#             "department": "R&D",
#             "age": 25,
#             "position": "intern",
#             "seniority": 3,
#             "region": "Kaoshiung",
#             "description": "I am a intern in R&D department. In free time, I like to play basketball."
#             "name": "ADMIN",
#             "account": "ccccccc",
#             "password": "0906",
#             "department": "admin",
#             "age": 30,
#             "position": "CEO",
#             "seniority": 10,
#             "region": "Kaoshiung", 
#             "description": "I know everything."
#          }'


# for test 
# {"id":"07cbf45c0101427d9f648944ff4a6081","name":"Frank","account":"cccccc","password":"$2b$12$T3NvcR8aFlSAqDtE3VgpGOdE7qemtetNgdINNikMphOTLA09U0LJK","department":"R&D","age":25,"position":"intern","seniority":3,"region":"Kaoshiung"}


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
curl -X POST "http://localhost:8001/api/emoreply" \
     -H "Content-Type: application/json" \
     -d '{
           "content": "I am sorry you are facing this. Clear communication is so important for a smooth workflow. Maybe asking for more clarity or starting small check-ins could help. You are not alone in feeling this way, and things can improve with a little more openness. Stay positive!",
           "emo_msg_id": "31c677711feb40788efee745660aa576",
           "sender_id": "19aab065ed44438b8b48b19476c32012"
         }'

string="I work diligently on projects, but my efforts go unnoticed. Despite my hard work, I receive little recognition or praise from management. This lack of appreciation has started to diminish my motivation and job satisfaction."

# curl -X POST "http://localhost:8001/api/emomsg"  \
#      -H "Content-Type: application/json" \
#      -d '{
#            "sender_id": "07cbf45c0101427d9f648944ff4a6081",
#            "content": "'"$string"'"
#          }'

# curl -X POST "http://localhost:8001/api/emomsg_to"  \
#      -H "Content-Type: application/json" \
#      -d '{
#            "sender_id": "17c5771383a64adea83fd5d50311dd5e",
#            "content": "'"$string"'",
#            "rcvr_id": ["07cbf45c0101427d9f648944ff4a6081"]
#          }'


# curl -X GET http://localhost:8001/api/techposts/techcomments/708f24c378b64942b61edc3e15533045
# curl -X GET http://localhost:8001/api/techposts/708f24c378b64942b61edc3e15533045
# curl -X GET http://localhost:8001/api/emomsg/a9dafa3762d24284be76cd0ddff9c7d0
# curl -X GET http://localhost:8001/api/emomsg/rcvr/83fa6df15b784d60bc760e6413cd8269
# curl -X GET http://localhost:8001/api/emoreply/emomsg/a9dafa3762d24284be76cd0ddff9c7d0
# curl -X GET http://localhost:8001/api/emoreply/sender/2f089e4813ad4d028bc543ff1de4e11e
# curl -X GET http://localhost:8001/api/employees/0874ae7d1cdd4867ae26334c86b0a4cb
# a9dafa3762d24284be76cd0ddff9c7d0
# 4214d9bfda9d4f9696d828aee6b5ba50

# curl -X GET http://localhost:8001/api/employee/embeddings
# curl -X GET http://localhost:8001/api/employee/gptdata/cda5b4b3229d4bac8ae3d37f12619a7b

# test wallet api
# curl -X PUT http://localhost:8001/api/employee/wallet/
# curl -X PUT "http://localhost:8001/api/employee/update_wallet" -H "Content-Type: application/json" -d '{"value": 100, "employee_id": "7144dcaa96534cc6bf35b93efa8b7ee4"}'
# curl -X GET http://localhost:8001/api/employee/get_wallet/7144dcaa96534cc6bf35b93efa8b7ee4
# curl -X GET http://localhost:8001/api/campaigns


# curl -X POST "http://localhost:8001/api/campaign" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "name": "Dinner with dennis",
#     "description": "This is a test campaign",
#     "price": 2,
#     "image_path": "/images/campaign.jpg",
#     "quantity": 3,
#     "lasting_hours": 72,
#     "attenders_id": ["1", "2", "3"]
#   }'
curl -X POST "http://localhost:8001/api/campaign" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mountain Adventure Hike",
    "description": "Take on an exhilarating hike through the scenic mountain trails, with breathtaking views at every turn. This guided trek will end with a picnic at the summit, complete with healthy snacks and refreshing drinks.",
    "price": 0,
    "image_path": "/images/campaign4.jpg",
    "quantity": 12,
    "lasting_hours": 6,
    "attenders_id": []
  }'
