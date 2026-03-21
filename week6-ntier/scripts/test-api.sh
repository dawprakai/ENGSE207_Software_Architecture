#!/bin/bash
# scripts/test-api.sh
# API Test Script for Task Board

echo "═══════════════════════════════════════════════════════"
echo "  🧪 Task Board API Test Suite"
echo "═══════════════════════════════════════════════════════"
echo ""

BASE_URL="http://localhost:3000/api"
HTTPS_URL="https://taskboard.local/api"
PASSED=0
FAILED=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# curl options
CURL_OPTS="-s"
CURL_OPTS_HTTPS="-s -k"

# Test function
test_endpoint() {
    local name="$1"
    local method="$2"
    local url="$3"
    local data="$4"
    local expected="$5"
    local opts="$6"

    echo -n "Testing: $name... "

    if [ "$method" = "GET" ]; then
        response=$(curl $opts "$url")
    elif [ "$method" = "POST" ]; then
        response=$(curl $opts -X POST -H "Content-Type: application/json" -d "$data" "$url")
    elif [ "$method" = "PATCH" ]; then
        response=$(curl $opts -X PATCH -H "Content-Type: application/json" -d "$data" "$url")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl $opts -X DELETE "$url")
    fi

    if echo "$response" | grep -q "$expected"; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "  Response: $response"
        ((FAILED++))
    fi
}

echo "=== Testing Backend (Direct) ==="
echo ""

# Test 1: Health Check
test_endpoint "Health Check" "GET" "$BASE_URL/health" "" "healthy" "$CURL_OPTS"

# Test 2: Get All Tasks
test_endpoint "Get All Tasks" "GET" "$BASE_URL/tasks" "" "success" "$CURL_OPTS"

# Test 3: Get Statistics
test_endpoint "Get Statistics" "GET" "$BASE_URL/tasks/stats" "" "total" "$CURL_OPTS"

# Test 4: Create Task
test_endpoint "Create Task" "POST" "$BASE_URL/tasks" \
    '{"title":"Test Task from Script","priority":"MEDIUM"}' \
    "Task created" "$CURL_OPTS"

# Test 5: Get Task by ID
test_endpoint "Get Task by ID" "GET" "$BASE_URL/tasks/1" "" "success" "$CURL_OPTS"

# Test 6: Update Task Status
test_endpoint "Update Status" "PATCH" "$BASE_URL/tasks/1/status" \
    '{"status":"IN_PROGRESS"}' \
    "success" "$CURL_OPTS"

echo ""
echo "=== Testing via HTTPS (Nginx) ==="
echo ""

# Test 7: HTTPS Health Check
test_endpoint "HTTPS Health" "GET" "$HTTPS_URL/health" "" "healthy" "$CURL_OPTS_HTTPS"

# Test 8: HTTPS Get Tasks
test_endpoint "HTTPS Get Tasks" "GET" "$HTTPS_URL/tasks" "" "success" "$CURL_OPTS_HTTPS"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Test Results: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"
echo "═══════════════════════════════════════════════════════"
