# main.py
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dal_funcs import EmployeeDAL

async def main():
    client = AsyncIOMotorClient('mongodb+srv://dennis:tingwei0906@cluster0.gckml.mongodb.net/mchack_2024?retryWrites=true&w=majority&appName=Cluster0')
    db = client.get_default_database()
    employee_collection = db['employees']

    employee_dal = EmployeeDAL(employee_collection)

    # Create a new employee
    new_employee_id = await employee_dal.create_employee(
        department="Engineering",
        wallet=1000,
        score=10
    )
    print(f"New employee ID: {new_employee_id}")

    # Get the employee
    employee = await employee_dal.get_employee(new_employee_id)
    print(employee)

    # List all employees
    async for emp in employee_dal.list_employees():
        print(emp)


async def test_get_employee():
    # Setup MongoDB connection (make sure to replace with your database URI)
    client = AsyncIOMotorClient('mongodb+srv://dennis:tingwei0906@cluster0.gckml.mongodb.net/mchack_2024?retryWrites=true&w=majority&appName=Cluster0')
    db = client.get_default_database()
    employee_collection = db['employee']
    # Create an instance of EmployeeDAL
    employee_dal = EmployeeDAL(employee_collection)

    # Test with a valid employee ID
    employee_id = "24b212ee180145c7a78b08b68bd1cd3a"  # Use a real or mock ID from your database

    # Call the function and print the result
    employee = await employee_dal.get_employee(employee_id)
    
    if employee:
        print(f"Employee found: {employee}")
    else:
        print("Employee not found")


async def test_get_wallet_and_score():
    # Connect to MongoDB
    print("help")
    client = AsyncIOMotorClient('mongodb+srv://dennis:tingwei0906@cluster0.gckml.mongodb.net/mchack_2024?retryWrites=true&w=majority&appName=Cluster0')
    db = client.get_default_database()
    employee_collection = db['employee']

    # Create instance of EmployeeDAL
    employee_dal = EmployeeDAL(employee_collection)

    # Use a valid employee ID here
    employee_id = "24b212ee180145c7a78b08b68bd1cd3a"  
    # Call the method and print the results
    result = await employee_dal.get_wallet_and_score(employee_id)
    
    if result:
        print(f"Wallet: {result['wallet']}, Score: {result['score']}")
    else:
        print("Employee not found")

if __name__ == "__main__":
    asyncio.run(test_get_wallet_and_score())