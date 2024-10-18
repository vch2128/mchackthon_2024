import os
import json
from openai import OpenAI

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
            max_tokens=150,  # Increased tokens to accommodate longer responses
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