#!/bin/bash

# Number of employees to generate
NUM_EMPLOYEES=80

# Predefined department and position lists relevant to TSMC
DEPARTMENTS=("R&D" "Manufacturing" "Management" "Sales" "Finance" "Quality Assurance")
POSITIONS=("Engineer" "Manager" "Senior Engineer" "Analyst" "Intern")
REGIONS=("Taipei" "Hsinchu" "Tainan")

# Output JSON file
OUTPUT_FILE="employees.json"

# Initialize an empty array to store employees
employees=()

# Function to generate random string (for name, account, etc.)
generate_random_string() {
    LENGTH=$1
    echo $(cat /dev/urandom | tr -dc 'a-zA-Z' | fold -w ${LENGTH} | head -n 1)
}

# Function to generate a random number in a range
generate_random_number() {
    MIN=$1
    MAX=$2
    echo $(( ( RANDOM % (MAX - MIN + 1) ) + MIN ))
}

# Function to pick a random element from an array
pick_random_element() {
    local arr=("$@")
    echo ${arr[$((RANDOM % ${#arr[@]}))]}
}

# Function to determine seniority based on position
generate_seniority_based_on_position() {
    local position=$1
    case $position in
        "Intern")
            echo $(generate_random_number 0 1)  # 0-1 years
            ;;
        "Engineer")
            echo $(generate_random_number 2 5)  # 2-5 years
            ;;
        "Senior Engineer")
            echo $(generate_random_number 8 15) # 8-15 years
            ;;
        "Manager")
            echo $(generate_random_number 5 10) # 5-10 years
            ;;
        "Analyst")
            echo $(generate_random_number 1 4)  # 1-4 years
            ;;
        *)
            echo 0
            ;;
    esac
}

# Function to generate age based on seniority
generate_age_based_on_seniority() {
    local seniority=$1
    echo $((seniority + 25 + $(generate_random_number 0 10)))
}

# Generate random employees and insert via API
for i in $(seq 1 $NUM_EMPLOYEES); do
    name="New_Employee_$i"
    account=$(generate_random_string 8)
    password=$(generate_random_string 8)
    department=$(pick_random_element "${DEPARTMENTS[@]}")
    position=$(pick_random_element "${POSITIONS[@]}")
    region=$(pick_random_element "${REGIONS[@]}")
    seniority=$(generate_seniority_based_on_position "$position")
    age=$(generate_age_based_on_seniority "$seniority")

    # Create JSON data for the employee
    employee_json=$(cat <<EOF
{
  "name": "$name",
  "account": "$account",
  "password": "$password",
  "department": "$department",
  "age": $age,
  "position": "$position",
  "region": "$region",
  "seniority": $seniority
}
EOF
    )

    # Append to the employees array
    employees+=("$employee_json")

    # Call the API to create the employee
    curl -X POST "http://localhost:8001/api/employee" \
        -H "Content-Type: application/json" \
        -d "$employee_json"

    echo "Created employee: $name"
done

# Write all employees to the output JSON file
echo "[" > "$OUTPUT_FILE"
echo "${employees[0]}" >> "$OUTPUT_FILE"
for i in $(seq 2 $NUM_EMPLOYEES); do
    echo "," >> "$OUTPUT_FILE"
    echo "${employees[$((i-1))]}" >> "$OUTPUT_FILE"
done
echo "]" >> "$OUTPUT_FILE"

echo "Finished creating $NUM_EMPLOYEES employees via the API."
echo "Employees data saved to $OUTPUT_FILE"
