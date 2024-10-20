import os
import json
# import asyncio
from openai import OpenAI
from typing import List
from dal_tables import GPTData, GPTEmployeeData
import numpy as np

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]

client = OpenAI(api_key=OPENAI_API_KEY)

async def gpt_get_topic(paragraph):
    if not OPENAI_API_KEY:
        return {"message": "API key not set"}
    
    prompt = f"""
    Summarize the main topic of the following paragraph in 10 words or fewer:

    Paragraph:
    "{paragraph}"
    """
    
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt}
    ]
    
    try:
        # Asynchronous API call
        completion = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            max_tokens=150,  # Increased tokens to accommodate longer responses
        )

        assistant_reply = completion.choices[0].message.content
        return assistant_reply
    
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return {"message": "Error processing the paragraph."}

async def gpt_separate_paragraph(paragraph):
    if not OPENAI_API_KEY:
        return {"message": "API key not set"}
    # clean_paragraph = paragraph.replace('\\', ' ').replace('\n', ' ').replace('\t', ' ')
    prompt = f"""
        You will help me separate the paragraph into two parts.
        - The first part should include the mood and sentimental expression.
        - The second part should include any technical problems mentioned.

        Please format your response exactly as shown below, without any additional text:
        ```
        {{"emo_prob": "<emotional part>","tech_prob": "<technical part>"}}
        ```
        
        Paragraph:
        "{paragraph}"
    """

                     
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt}
    ]
    
    try:
        # Asynchronous API call
        completion = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            max_tokens=5000,  # Increased tokens to accommodate longer responses
        )

        assistant_reply = completion.choices[0].message.content
    
        try:
            # Parse the JSON string into a dictionary
            print(assistant_reply)
            dict_str = json.loads(assistant_reply)
            result=dict(dict_str)
            # Optionally, validate the presence of required keys
            if "emo_prob" in result and "tech_prob" in result:
                return result
            else:
                raise ValueError("Missing required keys in the response.")
        except json.JSONDecodeError as json_err:
            print(f"JSON decoding failed: {json_err}")
            return {"message": "Failed to parse the response from GPT."}
    
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return {"message": "Error processing the paragraph."}
    
    
# "I am thrilled about the advancements in renewable energy technologies. "
# "However, there are significant challenges in energy storage and grid integration that need to be addressed."

async def get_embedding(text, model="text-embedding-3-small"):
    text = text.replace("\n", " ")
    return client.embeddings.create(input = [text], model=model).data[0].embedding

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Compute the cosine similarity between two vectors."""
    a = np.array(vec1)
    b = np.array(vec2)
    if np.linalg.norm(a) == 0 or np.linalg.norm(b) == 0:
        return 0.0
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

async def find_most_similar(
    gpt_data_list: List[GPTData],
    new_embedding: List[float]
) -> GPTData:
    """Find the GPTData instance with the most similar embedding to the new_embedding."""
    max_similarity = -1.0
    most_similar_data = None

    if not gpt_data_list:
        return None

    # Compute all similarity scores
    async for data in gpt_data_list:
        similarity = cosine_similarity(data.tech_post_embedding, new_embedding)
        if similarity > max_similarity:
            max_similarity = similarity
            most_similar_data = data
    print(most_similar_data.tech_post_id)
    return most_similar_data

async def gpt_pre_answer_tech_post(problem, history_answer_list):
    history_answer = ";".join(history_answer_list)
    if not OPENAI_API_KEY:
        return {"message": "API key not set"}

    prompt = f"""
    You are provided with some historical answers to a similar problem. Please use this as a reference to answer the current problem.

    **Historical Answer:**
    "{history_answer}"

    **Current Problem:**
    "{problem}"

    Please ensure that your answer is clear, concise, and builds upon the insights from the historical answer.
    """
    
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt}
    ]
    
    try:
        # Asynchronous API call
        completion = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            max_token=5000,  # Increased tokens to accommodate longer responses
        )

        assistant_reply = completion.choices[0].message.content
        return assistant_reply
    
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return "failed"
    
async def gpt_get_rcvr_id_mostmatched(
        gpt_employee_data_list: List[GPTEmployeeData],
        new_embedding: List[float]
    ) -> str:
    """Find the GPTData instance with the most similar embedding to the new_embedding."""
    max_similarity = -1.0
    most_similar_data = None

    if not gpt_employee_data_list:
        return "2f089e4813ad4d028bc543ff1de4e11e"
    # Compute all similarity scores
    for data in gpt_employee_data_list:
        similarity = cosine_similarity(data.employee_embedding, new_embedding)
        if similarity > max_similarity:
            max_similarity = similarity
            most_similar_data = data.employee_id
    return most_similar_data

async def gpt_get_rcvr_id_mostunmatched(
        gpt_employee_data_list: List[GPTEmployeeData],
        new_embedding: List[float]
    ) -> str:
    """Find the GPTData instance with the most similar embedding to the new_embedding."""
    min_similarity = 1.0
    most_similar_data = "2f089e4813ad4d028bc543ff1de4e11e"

    if not gpt_employee_data_list:
        return "2f089e4813ad4d028bc543ff1de4e11e"
    # Compute all similarity scores
    for data in gpt_employee_data_list:
        similarity = cosine_similarity(data.employee_embedding, new_embedding)
        if similarity < min_similarity:
            min_similarity = similarity
            most_similar_data = data.employee_id
    return most_similar_data

# async def main():
#     result = await get_embedding("I am a bad guy")
#     print(result)

# asyncio.run(main())