#!/bin/bash

# Number of employees to generate
NUM_EMPLOYEES=2

# Predefined department and position lists relevant to TSMC
DEPARTMENTS=("R&D" "Manufacturing" "Management" "Sales" "Finance" "Quality Assurance")
POSITIONS=("Engineer" "Manager" "Senior Engineer" "Analyst" "Intern")
REGIONS=("Taipei" "Hsinchu" "Tainan")

# Last names (40 Chinese surnames in English)
LAST_NAMES=("Chen" "Lin" "Wang" "Zhang" "Li" "Huang" "Wu" "Liu" "Xu" "Cai" "Zheng" "Gao" "Hu" "Luo" "Xu" "Guo" "Ma" "Zhu" "Zhou" "Lu" "Fang" "Deng" "Xiao" "Xie" "Ye" "Han" "Shi" "Tang" "He" "Sun" "Jiang" "Qian" "Zeng" "Peng" "Du" "Pan" "Yu" "Wei" "Ren" "Jin")

# First names (40 English first names)
FIRST_NAMES=(
  "Frank" "Dennis" "Bonnie" "Emily" "James" "Linda" "Michael" "Sophia" "Robert" "Emma"
  "John" "Olivia" "David" "Ava" "William" "Isabella" "Richard" "Mia" "Thomas" "Charlotte"
  "Charles" "Amelia" "Joseph" "Harper" "Daniel" "Evelyn" "Matthew" "Abigail" "Anthony" "Lily"
  "Mark" "Ella" "Steven" "Grace" "Kevin" "Chloe" "Brian" "Victoria" "George" "Hannah"
)

# Output JSON file
OUTPUT_FILE="employee.json"

# Description files
DESCRIPTION_FILE="description.txt"
HOBBY_FILE="hobby.txt"

# Check if required files exist
for file in "$DESCRIPTION_FILE" "$HOBBY_FILE"; do
    if [ ! -f "$file" ]; then
        echo "Required file '$file' not found!"
        exit 1
    fi
done

# Read descriptions and categorize them by department
declare -A DESCRIPTIONS

current_department=""
while IFS= read -r line; do
    if [[ $line =~ ^\[(.*)\]$ ]]; then
        current_department="${BASH_REMATCH[1]}"
        DESCRIPTIONS["$current_department"]=""
    elif [[ -n "$line" && -n "$current_department" ]]; then
        DESCRIPTIONS["$current_department"]+="$line|"
    fi
done < "$DESCRIPTION_FILE"

# Read hobby descriptions into an array
mapfile -t HOBBY_DESCRIPTIONS < "$HOBBY_FILE"

# Function to generate random string (for account, password, etc.)
generate_random_string() {
    LENGTH=$1
    cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w ${LENGTH} | head -n 1
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

# Initialize an empty array to store employees
employees=()

# Start user ID from 1
USER_ID=1

# Generate random employees and insert via API
for i in $(seq 1 $NUM_EMPLOYEES); do
    # Generate random first and last name
    first_name=$(pick_random_element "${FIRST_NAMES[@]}")
    last_name=$(pick_random_element "${LAST_NAMES[@]}")
    name="${first_name} ${last_name}"

    account=$(generate_random_string 8)
    password=$(generate_random_string 8)
    department=$(pick_random_element "${DEPARTMENTS[@]}")
    position=$(pick_random_element "${POSITIONS[@]}")
    region=$(pick_random_element "${REGIONS[@]}")
    seniority=$(generate_seniority_based_on_position "$position")
    age=$(generate_age_based_on_seniority "$seniority")
    
    # Select a random description based on department
    IFS='|' read -ra DESC_ARRAY <<< "${DESCRIPTIONS[$department]}"
    desc_count=${#DESC_ARRAY[@]}
    desc_index=$(generate_random_number 0 $(( desc_count - 1 )))
    department_description="${DESC_ARRAY[$desc_index]}"

    # Select a random hobby description
    hobby_index=$(generate_random_number 0 $(( ${#HOBBY_DESCRIPTIONS[@]} - 1 )))
    hobby_description="${HOBBY_DESCRIPTIONS[$hobby_index]}"

    # Combine descriptions
    full_description="${department_description} In free time, ${hobby_description}"

    # Escape double quotes in description
    full_description=$(echo "$full_description" | sed 's/"/\\"/g')

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
  "seniority": $seniority,
  "description": "$full_description"
}
EOF
    )

    # Append to the employees array
    employees+=("$employee_json")

    # Call the API to create the employee (取消註解以下行以啟用 API 調用)
    curl -X POST "http://localhost:8001/api/employee" \
        -H "Content-Type: application/json" \
        -d "$employee_json"

    echo "Created employee: $name with User ID: $USER_ID"

    # Increment user ID
    USER_ID=$((USER_ID + 1))
done

# Write all employees to the output JSON file
echo "[" > "$OUTPUT_FILE"
for i in "${!employees[@]}"; do
    if [ $i -ne 0 ]; then
        echo "," >> "$OUTPUT_FILE"
    fi
    echo "${employees[$i]}" >> "$OUTPUT_FILE"
done
echo "]" >> "$OUTPUT_FILE"

echo "Finished creating $NUM_EMPLOYEES employees."
echo "Employees data saved to $OUTPUT_FILE"
