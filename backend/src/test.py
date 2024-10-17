# main.py
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dal_funcs import EmployeeDAL

async def main():
    client = AsyncIOMotorClient('mongodb+srv://admin:admin@cluster0.fxkk1.mongodb.net/mchack_2024?retryWrites=true&w=majority&appName=Cluster0')
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

if __name__ == "__main__":
    asyncio.run(main())