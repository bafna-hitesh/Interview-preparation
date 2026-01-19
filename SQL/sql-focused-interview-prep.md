# SQL Focused Interview Prep
## Second-Highest, Top N per Group, Joins + Aggregation, Window Functions, Edge Cases

---

## 📋 TABLE OF CONTENTS
1. [Nth Highest/Lowest Queries](#nth-highestlowest-queries)
2. [Top N per Group](#top-n-per-group)
3. [Joins + Aggregation (GROUP BY + HAVING)](#joins--aggregation-group-by--having)
4. [Window Functions Deep Dive](#window-functions-deep-dive)
5. [Edge Cases: NULLs & Duplicates](#edge-cases-nulls--duplicates)
6. [Practice Problems with Solutions](#practice-problems-with-solutions)

---

## 🎯 NTH HIGHEST/LOWEST QUERIES

### Problem: Find 2nd Highest Salary

#### Method 1: Using LIMIT and OFFSET
```sql
-- 2nd highest salary
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;

-- Edge case: What if there's only 1 employee?
-- Returns empty result (correct behavior)
```

#### Method 2: Using Subquery with MAX
```sql
-- 2nd highest salary
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- Edge case: Handles duplicates better
-- If multiple employees have max salary, this still works
```

#### Method 3: Using Window Functions (ROW_NUMBER)
```sql
-- 2nd highest salary
SELECT salary
FROM (
    SELECT 
        salary,
        ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn
    FROM employees
) t
WHERE rn = 2;

-- Edge case: If you want 2nd highest including duplicates, use DENSE_RANK
```

#### Method 4: Using Window Functions (DENSE_RANK)
```sql
-- 2nd highest salary (if multiple have same highest, this gives true 2nd)
SELECT DISTINCT salary
FROM (
    SELECT 
        salary,
        DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) t
WHERE rnk = 2;

-- This handles: [100, 100, 90, 80] → 2nd highest is 90
```

#### Method 5: Using Correlated Subquery
```sql
-- 2nd highest salary
SELECT salary
FROM employees e1
WHERE 1 = (
    SELECT COUNT(DISTINCT e2.salary)
    FROM employees e2
    WHERE e2.salary > e1.salary
);

-- Edge case: Returns NULL if no 2nd highest exists
```

### Problem: Find Nth Highest Salary (General Solution)

#### Method 1: Using LIMIT and OFFSET
```sql
-- Nth highest salary (N = 3 example)
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET (N - 1);

-- For N = 3: LIMIT 1 OFFSET 2
```

#### Method 2: Using Window Function (Recommended)
```sql
-- Nth highest salary
SELECT DISTINCT salary
FROM (
    SELECT 
        salary,
        DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) t
WHERE rnk = N;

-- Best for handling duplicates
```

#### Method 3: Using Correlated Subquery
```sql
-- Nth highest salary
SELECT DISTINCT salary
FROM employees e1
WHERE (N - 1) = (
    SELECT COUNT(DISTINCT e2.salary)
    FROM employees e2
    WHERE e2.salary > e1.salary
);
```

### Problem: Find 2nd Highest Salary per Department

```sql
-- Using window function (best approach)
SELECT department, salary
FROM (
    SELECT 
        department,
        salary,
        DENSE_RANK() OVER (
            PARTITION BY department 
            ORDER BY salary DESC
        ) AS rnk
    FROM employees
) t
WHERE rnk = 2;
```

### Edge Cases to Consider

```sql
-- Case 1: What if there's no 2nd highest? (only 1 employee)
-- Solution: Returns empty (correct) or use COALESCE
SELECT COALESCE(
    (SELECT DISTINCT salary
     FROM employees
     ORDER BY salary DESC
     LIMIT 1 OFFSET 1),
    NULL
) AS second_highest;

-- Case 2: What if all salaries are same?
-- Solution: Returns empty (no 2nd highest exists)

-- Case 3: What if there are NULL salaries?
SELECT DISTINCT salary
FROM employees
WHERE salary IS NOT NULL  -- Filter NULLs first!
ORDER BY salary DESC
LIMIT 1 OFFSET 1;

-- Case 4: What if you want employee details, not just salary?
SELECT e.*
FROM employees e
WHERE e.salary = (
    SELECT DISTINCT salary
    FROM employees
    ORDER BY salary DESC
    LIMIT 1 OFFSET 1
);
```

### Common Mistakes

```sql
-- ❌ WRONG: Using MAX twice
SELECT MAX(salary) FROM employees
WHERE salary = MAX(salary) - something;  -- Can't use aggregate in WHERE

-- ✅ CORRECT: Use subquery
SELECT MAX(salary) FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- ❌ WRONG: Not handling duplicates
SELECT salary FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;  -- Might return duplicate if multiple have 2nd highest

-- ✅ CORRECT: Use DISTINCT
SELECT DISTINCT salary FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
```

---

## 🏆 TOP N PER GROUP

### Problem: Top 3 Salaries per Department

#### Method 1: Using Window Function ROW_NUMBER (Recommended)
```sql
-- Top 3 salaries per department
SELECT department, name, salary
FROM (
    SELECT 
        department,
        name,
        salary,
        ROW_NUMBER() OVER (
            PARTITION BY department 
            ORDER BY salary DESC
        ) AS rn
    FROM employees
) t
WHERE rn <= 3
ORDER BY department, salary DESC;
```

#### Method 2: Using Window Function DENSE_RANK
```sql
-- Top 3 salary VALUES per department (handles ties differently)
SELECT department, name, salary
FROM (
    SELECT 
        department,
        name,
        salary,
        DENSE_RANK() OVER (
            PARTITION BY department 
            ORDER BY salary DESC
        ) AS rnk
    FROM employees
) t
WHERE rnk <= 3
ORDER BY department, salary DESC;

-- Difference: If 3 people tie for 1st, ROW_NUMBER gives 1,2,3
-- DENSE_RANK gives all 1,1,1 (all considered top 1)
```

#### Method 3: Using Correlated Subquery (Less Efficient)
```sql
-- Top 3 salaries per department
SELECT e1.department, e1.name, e1.salary
FROM employees e1
WHERE (
    SELECT COUNT(DISTINCT e2.salary)
    FROM employees e2
    WHERE e2.department = e1.department 
    AND e2.salary > e1.salary
) < 3
ORDER BY e1.department, e1.salary DESC;
```

### Problem: Top 1 Salary per Department (Multiple Solutions)

#### Method 1: Window Function
```sql
SELECT department, name, salary
FROM (
    SELECT 
        department,
        name,
        salary,
        ROW_NUMBER() OVER (
            PARTITION BY department 
            ORDER BY salary DESC
        ) AS rn
    FROM employees
) t
WHERE rn = 1;
```

#### Method 2: Using GROUP BY with JOIN
```sql
-- Get max salary per department, then join to get employee details
SELECT e.department, e.name, e.salary
FROM employees e
INNER JOIN (
    SELECT department, MAX(salary) AS max_salary
    FROM employees
    GROUP BY department
) dept_max ON e.department = dept_max.department 
    AND e.salary = dept_max.max_salary;

-- ⚠️ Edge case: If multiple employees have same max salary in a department,
-- this returns ALL of them (not just one)
```

#### Method 3: Using Correlated Subquery
```sql
SELECT e1.*
FROM employees e1
WHERE e1.salary = (
    SELECT MAX(e2.salary)
    FROM employees e2
    WHERE e2.department = e1.department
);
-- ⚠️ Also returns all employees with max salary if there are ties
```

### Problem: Top N with Tie Handling

```sql
-- If you want exactly N employees per group (even with ties)
-- Use ROW_NUMBER
SELECT department, name, salary
FROM (
    SELECT 
        department,
        name,
        salary,
        ROW_NUMBER() OVER (
            PARTITION BY department 
            ORDER BY salary DESC, name ASC  -- Add tie-breaker
        ) AS rn
    FROM employees
) t
WHERE rn <= 3;

-- If you want all employees in top N salary brackets
-- Use DENSE_RANK
SELECT department, name, salary
FROM (
    SELECT 
        department,
        name,
        salary,
        DENSE_RANK() OVER (
            PARTITION BY department 
            ORDER BY salary DESC
        ) AS rnk
    FROM employees
) t
WHERE rnk <= 3;
```

### Edge Cases

```sql
-- Case 1: Department with fewer than N employees
-- Solution: Returns all employees (correct behavior)

-- Case 2: Handling NULL salaries
SELECT department, name, salary
FROM (
    SELECT 
        department,
        name,
        salary,
        ROW_NUMBER() OVER (
            PARTITION BY department 
            ORDER BY salary DESC NULLS LAST  -- PostgreSQL
        ) AS rn
    FROM employees
    WHERE salary IS NOT NULL  -- Or filter NULLs first
) t
WHERE rn <= 3;

-- Case 3: Department with no employees
-- Solution: Won't appear in results (correct)

-- Case 4: All employees have same salary in a department
-- ROW_NUMBER: Returns first N (arbitrary order)
-- DENSE_RANK: Returns all (all have rank 1)
```

---

## 🔗 JOINS + AGGREGATION (GROUP BY + HAVING)

### Pattern 1: Join Then Aggregate

```sql
-- Average salary per department (with department name)
SELECT 
    d.department_name,
    AVG(e.salary) AS avg_salary,
    COUNT(e.id) AS employee_count
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
GROUP BY d.department_name
ORDER BY avg_salary DESC;
```

### Pattern 2: Aggregate Then Join

```sql
-- Departments with average salary > 60000
SELECT 
    d.department_name,
    dept_stats.avg_salary,
    dept_stats.employee_count
FROM (
    SELECT 
        department_id,
        AVG(salary) AS avg_salary,
        COUNT(*) AS employee_count
    FROM employees
    GROUP BY department_id
    HAVING AVG(salary) > 60000
) dept_stats
INNER JOIN departments d ON dept_stats.department_id = d.id;
```

### Pattern 3: Multiple Aggregations with HAVING

```sql
-- Departments with more than 10 employees and avg salary > 50000
SELECT 
    d.department_name,
    COUNT(e.id) AS employee_count,
    AVG(e.salary) AS avg_salary,
    MAX(e.salary) AS max_salary,
    MIN(e.salary) AS min_salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
GROUP BY d.department_name
HAVING COUNT(e.id) > 10 
    AND AVG(e.salary) > 50000
ORDER BY avg_salary DESC;
```

### Pattern 4: Complex Aggregation with Multiple Tables

```sql
-- Department performance: employees, projects, and total project budget
SELECT 
    d.department_name,
    COUNT(DISTINCT e.id) AS employee_count,
    COUNT(DISTINCT p.id) AS project_count,
    SUM(p.budget) AS total_budget,
    AVG(e.salary) AS avg_salary
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
LEFT JOIN projects p ON e.id = p.employee_id
GROUP BY d.department_name
HAVING COUNT(DISTINCT e.id) > 0  -- Only departments with employees
ORDER BY total_budget DESC;
```

### Pattern 5: Conditional Aggregations

```sql
-- Count employees by salary range per department
SELECT 
    d.department_name,
    COUNT(*) AS total_employees,
    SUM(CASE WHEN e.salary < 50000 THEN 1 ELSE 0 END) AS low_salary_count,
    SUM(CASE WHEN e.salary BETWEEN 50000 AND 80000 THEN 1 ELSE 0 END) AS mid_salary_count,
    SUM(CASE WHEN e.salary > 80000 THEN 1 ELSE 0 END) AS high_salary_count,
    AVG(e.salary) AS avg_salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
GROUP BY d.department_name
HAVING COUNT(*) > 5  -- Only departments with more than 5 employees
ORDER BY avg_salary DESC;
```

### Pattern 6: Self-Join with Aggregation

```sql
-- Managers and their team statistics
SELECT 
    m.name AS manager_name,
    COUNT(e.id) AS team_size,
    AVG(e.salary) AS team_avg_salary,
    SUM(e.salary) AS team_total_salary
FROM employees m
INNER JOIN employees e ON m.id = e.manager_id
GROUP BY m.id, m.name
HAVING COUNT(e.id) >= 3  -- Managers with at least 3 direct reports
ORDER BY team_size DESC;
```

### Common Mistakes

```sql
-- ❌ WRONG: Using aggregate in WHERE
SELECT d.department_name, AVG(e.salary)
FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE AVG(e.salary) > 50000  -- Can't use aggregate in WHERE!
GROUP BY d.department_name;

-- ✅ CORRECT: Use HAVING
SELECT d.department_name, AVG(e.salary)
FROM employees e
JOIN departments d ON e.department_id = d.id
GROUP BY d.department_name
HAVING AVG(e.salary) > 50000;

-- ❌ WRONG: Missing columns in GROUP BY
SELECT d.department_name, e.role, AVG(e.salary)
FROM employees e
JOIN departments d ON e.department_id = d.id
GROUP BY d.department_name;  -- Missing e.role!

-- ✅ CORRECT: Include all non-aggregated columns
SELECT d.department_name, e.role, AVG(e.salary)
FROM employees e
JOIN departments d ON e.department_id = d.id
GROUP BY d.department_name, e.role;

-- ❌ WRONG: COUNT(*) includes NULLs from LEFT JOIN
SELECT d.department_name, COUNT(*) AS employee_count
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.department_name;
-- Returns 1 even for departments with no employees!

-- ✅ CORRECT: Count non-NULL values
SELECT d.department_name, COUNT(e.id) AS employee_count
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.department_name;
```

---

## 🪟 WINDOW FUNCTIONS DEEP DIVE

### ROW_NUMBER() - Sequential Numbering

```sql
-- Basic usage
SELECT 
    name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn
FROM employees;

-- Partitioned
SELECT 
    department,
    name,
    salary,
    ROW_NUMBER() OVER (
        PARTITION BY department 
        ORDER BY salary DESC
    ) AS dept_rank
FROM employees;

-- With tie-breaker
SELECT 
    department,
    name,
    salary,
    ROW_NUMBER() OVER (
        PARTITION BY department 
        ORDER BY salary DESC, name ASC
    ) AS rn
FROM employees;
```

### RANK() vs DENSE_RANK()

```sql
-- RANK: Leaves gaps
SELECT 
    name,
    salary,
    RANK() OVER (ORDER BY salary DESC) AS rank_with_gaps,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS rank_no_gaps
FROM employees;

-- Example output:
-- Salary: 100, 100, 90, 80
-- RANK:     1,   1,  3,  4  (skips 2)
-- DENSE_RANK: 1,   1,  2,  3  (no gaps)
```

### SUM() OVER - Cumulative Sums

```sql
-- Running total
SELECT 
    date,
    sales,
    SUM(sales) OVER (ORDER BY date) AS running_total
FROM daily_sales
ORDER BY date;

-- Partitioned running total
SELECT 
    department,
    date,
    sales,
    SUM(sales) OVER (
        PARTITION BY department 
        ORDER BY date
    ) AS dept_running_total
FROM sales
ORDER BY department, date;

-- Running total with window frame
SELECT 
    date,
    sales,
    SUM(sales) OVER (
        ORDER BY date 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total,
    SUM(sales) OVER (
        ORDER BY date 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS last_3_days_total
FROM daily_sales;
```

### AVG() OVER - Moving Averages

```sql
-- Moving average (last 7 days)
SELECT 
    date,
    sales,
    AVG(sales) OVER (
        ORDER BY date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS moving_avg_7days
FROM daily_sales;

-- Partitioned moving average
SELECT 
    product,
    date,
    sales,
    AVG(sales) OVER (
        PARTITION BY product 
        ORDER BY date 
        ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING
    ) AS centered_moving_avg
FROM product_sales;
```

### LAG() and LEAD() - Previous/Next Values

```sql
-- Compare with previous day
SELECT 
    date,
    sales,
    LAG(sales, 1) OVER (ORDER BY date) AS prev_sales,
    sales - LAG(sales, 1) OVER (ORDER BY date) AS day_over_day_change,
    (sales - LAG(sales, 1) OVER (ORDER BY date)) * 100.0 / 
        LAG(sales, 1) OVER (ORDER BY date) AS percent_change
FROM daily_sales;

-- Compare with next day
SELECT 
    date,
    sales,
    LEAD(sales, 1) OVER (ORDER BY date) AS next_sales
FROM daily_sales;

-- With default value for first/last row
SELECT 
    date,
    sales,
    LAG(sales, 1, 0) OVER (ORDER BY date) AS prev_sales  -- Default 0
FROM daily_sales;
```

### FIRST_VALUE() and LAST_VALUE()

```sql
-- First and last value in window
SELECT 
    department,
    name,
    salary,
    FIRST_VALUE(salary) OVER (
        PARTITION BY department 
        ORDER BY salary DESC
    ) AS top_salary,
    LAST_VALUE(salary) OVER (
        PARTITION BY department 
        ORDER BY salary DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS bottom_salary
FROM employees;
```

### Window Frame Specifications

```sql
-- ROWS vs RANGE
SELECT 
    date,
    sales,
    -- ROWS: Physical rows
    SUM(sales) OVER (
        ORDER BY date 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS sum_rows,
    -- RANGE: Logical range (same date values)
    SUM(sales) OVER (
        ORDER BY date 
        RANGE BETWEEN INTERVAL '2' DAY PRECEDING AND CURRENT ROW
    ) AS sum_range
FROM daily_sales;

-- Common frames:
-- All previous rows
ROWS UNBOUNDED PRECEDING

-- Current row to end
ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING

-- N rows before and after
ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING

-- Last N rows
ROWS BETWEEN N PRECEDING AND CURRENT ROW
```

### Combining Multiple Window Functions

```sql
-- Complex analysis
SELECT 
    department,
    name,
    salary,
    ROW_NUMBER() OVER (
        PARTITION BY department 
        ORDER BY salary DESC
    ) AS dept_rank,
    AVG(salary) OVER (PARTITION BY department) AS dept_avg,
    salary - AVG(salary) OVER (PARTITION BY department) AS diff_from_avg,
    PERCENT_RANK() OVER (
        PARTITION BY department 
        ORDER BY salary
    ) AS salary_percentile
FROM employees;
```

---

## ⚠️ EDGE CASES: NULLs & DUPLICATES

### NULL Handling in Queries

#### NULL in WHERE Clause
```sql
-- ❌ WRONG
SELECT * FROM employees WHERE manager_id = NULL;  -- Always returns nothing!

-- ✅ CORRECT
SELECT * FROM employees WHERE manager_id IS NULL;
SELECT * FROM employees WHERE manager_id IS NOT NULL;
```

#### NULL in Comparisons
```sql
-- NULL comparisons always return NULL (not TRUE or FALSE)
SELECT * FROM employees 
WHERE salary > 50000 OR salary IS NULL;  -- Include NULLs if needed

-- COALESCE to handle NULLs
SELECT 
    name,
    COALESCE(salary, 0) AS salary  -- Replace NULL with 0
FROM employees;
```

#### NULL in Aggregations
```sql
-- COUNT(*) counts all rows including NULLs
SELECT COUNT(*) FROM employees;  -- Counts all rows

-- COUNT(column) excludes NULLs
SELECT COUNT(manager_id) FROM employees;  -- Excludes NULL manager_id

-- Other aggregates ignore NULLs
SELECT AVG(salary) FROM employees;  -- NULL salaries excluded
SELECT SUM(salary) FROM employees;   -- NULL salaries excluded
SELECT MAX(salary) FROM employees;  -- NULL salaries excluded
```

#### NULL in JOINs
```sql
-- NULL foreign keys don't match
SELECT e.name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;
-- Employees with NULL department_id will have NULL department_name

-- Filter NULLs before JOIN if needed
SELECT e.name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.department_id IS NOT NULL;  -- Redundant but explicit
```

#### NULL in ORDER BY
```sql
-- NULLs first or last
SELECT * FROM employees
ORDER BY salary DESC NULLS LAST;  -- PostgreSQL

SELECT * FROM employees
ORDER BY 
    CASE WHEN salary IS NULL THEN 1 ELSE 0 END,
    salary DESC;  -- Standard SQL
```

### Duplicate Handling

#### Finding Duplicates
```sql
-- Find duplicate emails
SELECT email, COUNT(*) AS count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Get all duplicate records
SELECT u.*
FROM users u
WHERE u.email IN (
    SELECT email
    FROM users
    GROUP BY email
    HAVING COUNT(*) > 1
);
```

#### Removing Duplicates
```sql
-- Using DISTINCT
SELECT DISTINCT email, name FROM users;

-- Using GROUP BY
SELECT email, name
FROM users
GROUP BY email, name;

-- Using window function to keep one
SELECT email, name
FROM (
    SELECT 
        email,
        name,
        ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
    FROM users
) t
WHERE rn = 1;
```

#### Handling Duplicates in Rankings
```sql
-- If multiple employees have same salary
-- ROW_NUMBER: Arbitrary order (1, 2, 3, 4)
SELECT 
    name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn
FROM employees;

-- RANK: Leaves gaps (1, 1, 3, 4)
SELECT 
    name,
    salary,
    RANK() OVER (ORDER BY salary DESC) AS rank
FROM employees;

-- DENSE_RANK: No gaps (1, 1, 2, 3)
SELECT 
    name,
    salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank
FROM employees;
```

#### Duplicates in JOINs
```sql
-- If join creates duplicates, use DISTINCT
SELECT DISTINCT e.name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.id;

-- Or aggregate
SELECT d.department_name, COUNT(DISTINCT e.id) AS employee_count
FROM employees e
JOIN departments d ON e.department_id = d.id
GROUP BY d.department_name;
```

### Common NULL & Duplicate Edge Cases

```sql
-- Case 1: 2nd highest when all salaries are same
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
-- Returns empty (correct - no 2nd highest exists)

-- Case 2: 2nd highest when there are NULLs
SELECT DISTINCT salary
FROM employees
WHERE salary IS NOT NULL  -- Filter NULLs first!
ORDER BY salary DESC
LIMIT 1 OFFSET 1;

-- Case 3: Top N per group with duplicates
-- If you want exactly N rows: Use ROW_NUMBER
-- If you want all in top N brackets: Use DENSE_RANK

-- Case 4: COUNT with LEFT JOIN
SELECT 
    d.department_name,
    COUNT(e.id) AS employee_count  -- Use COUNT(column), not COUNT(*)
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.department_name;

-- Case 5: AVG with NULLs
SELECT 
    department,
    AVG(COALESCE(salary, 0)) AS avg_salary_including_null  -- Treats NULL as 0
FROM employees
GROUP BY department;

SELECT 
    department,
    AVG(salary) AS avg_salary_excluding_null  -- Excludes NULL (default)
FROM employees
GROUP BY department;
```

---

## 📝 PRACTICE PROBLEMS WITH SOLUTIONS

### Problem 1: Second Highest Salary (with edge cases)

**Question:** Find the second highest salary. If there's no second highest, return NULL.

**Solution:**
```sql
SELECT 
    COALESCE(
        (SELECT DISTINCT salary
         FROM employees
         WHERE salary IS NOT NULL
         ORDER BY salary DESC
         LIMIT 1 OFFSET 1),
        NULL
    ) AS second_highest_salary;
```

### Problem 2: Top 3 Employees per Department

**Question:** For each department, find the top 3 employees by salary. Include employee name, salary, and rank.

**Solution:**
```sql
SELECT 
    department,
    name,
    salary,
    rn AS rank
FROM (
    SELECT 
        department,
        name,
        salary,
        ROW_NUMBER() OVER (
            PARTITION BY department 
            ORDER BY salary DESC, name ASC
        ) AS rn
    FROM employees
    WHERE salary IS NOT NULL
) t
WHERE rn <= 3
ORDER BY department, rn;
```

### Problem 3: Departments with Average Salary > Company Average

**Question:** Find departments where the average salary is greater than the overall company average salary.

**Solution:**
```sql
SELECT 
    d.department_name,
    AVG(e.salary) AS dept_avg_salary,
    (SELECT AVG(salary) FROM employees) AS company_avg_salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
WHERE e.salary IS NOT NULL
GROUP BY d.department_name
HAVING AVG(e.salary) > (SELECT AVG(salary) FROM employees)
ORDER BY dept_avg_salary DESC;
```

### Problem 4: Running Total of Sales

**Question:** Calculate the running total of sales ordered by date.

**Solution:**
```sql
SELECT 
    date,
    sales,
    SUM(sales) OVER (ORDER BY date) AS running_total
FROM daily_sales
ORDER BY date;
```

### Problem 5: Employees Earning More Than Their Department Average

**Question:** Find all employees who earn more than the average salary in their department.

**Solution:**
```sql
-- Method 1: Using window function
SELECT 
    department,
    name,
    salary,
    AVG(salary) OVER (PARTITION BY department) AS dept_avg
FROM employees
WHERE salary > AVG(salary) OVER (PARTITION BY department)
ORDER BY department, salary DESC;

-- Method 2: Using correlated subquery
SELECT e1.*
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e1.department_id
)
ORDER BY e1.department_id, e1.salary DESC;
```

### Problem 6: Nth Highest Salary per Department

**Question:** Find the 2nd highest salary in each department.

**Solution:**
```sql
SELECT 
    department,
    salary AS second_highest_salary
FROM (
    SELECT 
        department,
        salary,
        DENSE_RANK() OVER (
            PARTITION BY department 
            ORDER BY salary DESC
        ) AS rnk
    FROM employees
    WHERE salary IS NOT NULL
) t
WHERE rnk = 2;
```

### Problem 7: Departments with More Than 5 Employees and High Average Salary

**Question:** Find departments that have more than 5 employees and an average salary greater than 60000.

**Solution:**
```sql
SELECT 
    d.department_name,
    COUNT(e.id) AS employee_count,
    AVG(e.salary) AS avg_salary
FROM departments d
INNER JOIN employees e ON d.id = e.department_id
WHERE e.salary IS NOT NULL
GROUP BY d.department_name
HAVING COUNT(e.id) > 5 
    AND AVG(e.salary) > 60000
ORDER BY avg_salary DESC;
```

### Problem 8: Day-over-Day Sales Change

**Question:** Calculate the day-over-day percentage change in sales.

**Solution:**
```sql
SELECT 
    date,
    sales,
    LAG(sales, 1) OVER (ORDER BY date) AS prev_sales,
    sales - LAG(sales, 1) OVER (ORDER BY date) AS absolute_change,
    CASE 
        WHEN LAG(sales, 1) OVER (ORDER BY date) > 0 
        THEN (sales - LAG(sales, 1) OVER (ORDER BY date)) * 100.0 / 
             LAG(sales, 1) OVER (ORDER BY date)
        ELSE NULL
    END AS percent_change
FROM daily_sales
ORDER BY date;
```

### Problem 9: Find Duplicate Emails

**Question:** Find all users with duplicate email addresses.

**Solution:**
```sql
-- All duplicate records
SELECT u.*
FROM users u
WHERE u.email IN (
    SELECT email
    FROM users
    GROUP BY email
    HAVING COUNT(*) > 1
)
ORDER BY email, id;

-- Using window function
SELECT email, name, id
FROM (
    SELECT 
        email,
        name,
        id,
        COUNT(*) OVER (PARTITION BY email) AS email_count
    FROM users
) t
WHERE email_count > 1
ORDER BY email, id;
```

### Problem 10: Top 1 Employee per Department (Handle Ties)

**Question:** Find the highest paid employee in each department. If there are ties, return all.

**Solution:**
```sql
-- Method 1: Using window function
SELECT 
    department,
    name,
    salary
FROM (
    SELECT 
        department,
        name,
        salary,
        RANK() OVER (
            PARTITION BY department 
            ORDER BY salary DESC
        ) AS rnk
    FROM employees
    WHERE salary IS NOT NULL
) t
WHERE rnk = 1;

-- Method 2: Using JOIN
SELECT e.department, e.name, e.salary
FROM employees e
INNER JOIN (
    SELECT department, MAX(salary) AS max_salary
    FROM employees
    WHERE salary IS NOT NULL
    GROUP BY department
) dept_max ON e.department = dept_max.department 
    AND e.salary = dept_max.max_salary
ORDER BY e.department, e.name;
```

---

## 🎯 QUICK REFERENCE CHECKLIST

### Before Writing Query, Ask:
- [ ] Are there NULLs? How should they be handled?
- [ ] Are there duplicates? Should they be included or removed?
- [ ] What if there are ties? Use ROW_NUMBER, RANK, or DENSE_RANK?
- [ ] What if the result is empty? Is that acceptable?
- [ ] Should I use DISTINCT?
- [ ] Am I using WHERE vs HAVING correctly?
- [ ] Are all non-aggregated columns in GROUP BY?

### Common Patterns Quick Reference:

```sql
-- 2nd Highest
SELECT DISTINCT salary FROM employees 
ORDER BY salary DESC LIMIT 1 OFFSET 1;

-- Top N per Group
SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY group ORDER BY value DESC) AS rn
    FROM table
) t WHERE rn <= N;

-- Running Total
SELECT *, SUM(value) OVER (ORDER BY date) AS running_total FROM table;

-- Compare with Average
SELECT * FROM table 
WHERE value > (SELECT AVG(value) FROM table);

-- Join + Aggregate
SELECT d.name, AVG(e.salary) 
FROM employees e 
JOIN departments d ON e.dept_id = d.id 
GROUP BY d.name 
HAVING AVG(e.salary) > 50000;
```

---

**You're now fully prepared! Good luck! 🚀**

