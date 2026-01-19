# SQL Interview Cheatsheet
## Complete Reference Guide for SQL Query Questions

---

## 📋 TABLE OF CONTENTS
1. [Basic SQL Syntax](#basic-sql-syntax)
2. [SELECT Queries](#select-queries)
3. [JOINs](#joins)
4. [Aggregations & GROUP BY](#aggregations--group-by)
5. [Subqueries](#subqueries)
6. [Window Functions](#window-functions)
7. [Common Patterns](#common-patterns)
8. [Data Types & Constraints](#data-types--constraints)
9. [Performance Tips](#performance-tips)
10. [Interview Question Patterns](#interview-question-patterns)

---

## 🔵 BASIC SQL SYNTAX

### SELECT Statement Structure
```sql
SELECT [DISTINCT] column1, column2, ...
FROM table_name
WHERE condition
GROUP BY column1, column2, ...
HAVING condition
ORDER BY column1 [ASC|DESC], column2 [ASC|DESC]
LIMIT n [OFFSET m];
```

### Execution Order (Important!)
1. **FROM** - Select tables
2. **WHERE** - Filter rows
3. **GROUP BY** - Group rows
4. **HAVING** - Filter groups
5. **SELECT** - Select columns
6. **ORDER BY** - Sort results
7. **LIMIT** - Limit results

---

## 📊 SELECT QUERIES

### Basic SELECT
```sql
-- Select all columns
SELECT * FROM employees;

-- Select specific columns
SELECT id, name, salary FROM employees;

-- Select with aliases
SELECT 
    id AS employee_id,
    name AS employee_name,
    salary * 12 AS annual_salary
FROM employees;
```

### DISTINCT
```sql
-- Remove duplicates
SELECT DISTINCT department FROM employees;

-- Multiple columns
SELECT DISTINCT department, role FROM employees;
```

### WHERE Clause
```sql
-- Comparison operators
SELECT * FROM employees WHERE salary > 50000;
SELECT * FROM employees WHERE age >= 25;
SELECT * FROM employees WHERE name = 'John';

-- Logical operators
SELECT * FROM employees 
WHERE salary > 50000 AND department = 'IT';

SELECT * FROM employees 
WHERE department = 'IT' OR department = 'HR';

SELECT * FROM employees 
WHERE NOT department = 'Sales';

-- IN operator
SELECT * FROM employees 
WHERE department IN ('IT', 'HR', 'Finance');

-- NOT IN
SELECT * FROM employees 
WHERE department NOT IN ('Sales', 'Marketing');

-- BETWEEN
SELECT * FROM employees 
WHERE salary BETWEEN 40000 AND 80000;

-- LIKE (pattern matching)
SELECT * FROM employees 
WHERE name LIKE 'J%';  -- Starts with J

SELECT * FROM employees 
WHERE email LIKE '%@gmail.com';  -- Ends with @gmail.com

SELECT * FROM employees 
WHERE name LIKE '_ohn';  -- Single character wildcard

-- IS NULL / IS NOT NULL
SELECT * FROM employees 
WHERE manager_id IS NULL;

SELECT * FROM employees 
WHERE manager_id IS NOT NULL;
```

### ORDER BY
```sql
-- Ascending (default)
SELECT * FROM employees ORDER BY salary;

-- Descending
SELECT * FROM employees ORDER BY salary DESC;

-- Multiple columns
SELECT * FROM employees 
ORDER BY department ASC, salary DESC;

-- Using column position
SELECT name, salary FROM employees 
ORDER BY 2 DESC;  -- Sort by 2nd column (salary)
```

### LIMIT & OFFSET
```sql
-- Top N records
SELECT * FROM employees ORDER BY salary DESC LIMIT 10;

-- Pagination
SELECT * FROM employees 
ORDER BY id 
LIMIT 10 OFFSET 20;  -- Skip 20, take 10

-- Alternative syntax (MySQL)
SELECT * FROM employees 
ORDER BY id 
LIMIT 20, 10;  -- OFFSET 20, LIMIT 10
```

### CASE Statement
```sql
SELECT 
    name,
    salary,
    CASE 
        WHEN salary > 80000 THEN 'High'
        WHEN salary > 50000 THEN 'Medium'
        ELSE 'Low'
    END AS salary_category
FROM employees;

-- In WHERE clause
SELECT * FROM employees
WHERE 
    CASE 
        WHEN department = 'IT' THEN salary > 70000
        ELSE salary > 50000
    END;
```

---

## 🔗 JOINS

### INNER JOIN
```sql
-- Returns only matching records
SELECT e.name, d.department_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;

-- Alternative syntax (old style)
SELECT e.name, d.department_name
FROM employees e, departments d
WHERE e.department_id = d.id;
```

### LEFT JOIN (LEFT OUTER JOIN)
```sql
-- Returns all from left table + matching from right
SELECT e.name, d.department_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;
-- NULL for employees without department
```

### RIGHT JOIN (RIGHT OUTER JOIN)
```sql
-- Returns all from right table + matching from left
SELECT e.name, d.department_name
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.id;
-- NULL for departments without employees
```

### FULL OUTER JOIN
```sql
-- Returns all records from both tables
SELECT e.name, d.department_name
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.id;
-- Note: MySQL doesn't support FULL OUTER JOIN
```

### CROSS JOIN (Cartesian Product)
```sql
-- All combinations
SELECT e.name, d.department_name
FROM employees e
CROSS JOIN departments d;
```

### Self JOIN
```sql
-- Join table with itself
SELECT 
    e1.name AS employee,
    e2.name AS manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;
```

### Multiple JOINs
```sql
SELECT 
    e.name,
    d.department_name,
    l.location_name
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
INNER JOIN locations l ON d.location_id = l.id;
```

### JOIN Conditions
```sql
-- Multiple conditions
SELECT e.name, p.project_name
FROM employees e
INNER JOIN projects p 
    ON e.id = p.employee_id 
    AND p.status = 'Active';

-- Using WHERE for additional filtering
SELECT e.name, p.project_name
FROM employees e
INNER JOIN projects p ON e.id = p.employee_id
WHERE p.status = 'Active';
```

---

## 📈 AGGREGATIONS & GROUP BY

### Aggregate Functions
```sql
-- COUNT
SELECT COUNT(*) FROM employees;
SELECT COUNT(DISTINCT department) FROM employees;
SELECT COUNT(manager_id) FROM employees;  -- Excludes NULL

-- SUM
SELECT SUM(salary) AS total_salary FROM employees;
SELECT SUM(salary) FROM employees WHERE department = 'IT';

-- AVG
SELECT AVG(salary) AS avg_salary FROM employees;
SELECT AVG(salary) FROM employees WHERE department = 'IT';

-- MIN / MAX
SELECT MIN(salary) AS min_salary FROM employees;
SELECT MAX(salary) AS max_salary FROM employees;
SELECT MIN(hire_date) AS first_hire FROM employees;

-- STRING_AGG / GROUP_CONCAT (varies by DB)
SELECT 
    department,
    STRING_AGG(name, ', ') AS employees  -- PostgreSQL
FROM employees
GROUP BY department;

SELECT 
    department,
    GROUP_CONCAT(name SEPARATOR ', ') AS employees  -- MySQL
FROM employees
GROUP BY department;
```

### GROUP BY
```sql
-- Basic grouping
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department;

-- Multiple columns
SELECT 
    department,
    role,
    COUNT(*) AS count,
    AVG(salary) AS avg_salary
FROM employees
GROUP BY department, role;

-- With WHERE (filters before grouping)
SELECT 
    department,
    COUNT(*) AS count
FROM employees
WHERE salary > 50000
GROUP BY department;
```

### HAVING Clause
```sql
-- Filter groups (after GROUP BY)
SELECT 
    department,
    COUNT(*) AS employee_count,
    AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 10;

-- HAVING vs WHERE
SELECT 
    department,
    AVG(salary) AS avg_salary
FROM employees
WHERE salary > 30000  -- Filter rows before grouping
GROUP BY department
HAVING AVG(salary) > 60000;  -- Filter groups after grouping
```

### Common Aggregation Patterns
```sql
-- Percentage calculation
SELECT 
    department,
    COUNT(*) AS count,
    COUNT(*) * 100.0 / (SELECT COUNT(*) FROM employees) AS percentage
FROM employees
GROUP BY department;

-- Top N per group (using window functions - see below)
-- Or using subquery
SELECT e1.department, e1.name, e1.salary
FROM employees e1
WHERE (
    SELECT COUNT(*)
    FROM employees e2
    WHERE e2.department = e1.department 
    AND e2.salary > e1.salary
) < 3  -- Top 3
ORDER BY department, salary DESC;
```

---

## 🔄 SUBQUERIES

### Scalar Subquery (Returns single value)
```sql
-- In SELECT
SELECT 
    name,
    salary,
    (SELECT AVG(salary) FROM employees) AS avg_salary
FROM employees;

-- In WHERE
SELECT * FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- In HAVING
SELECT department, AVG(salary)
FROM employees
GROUP BY department
HAVING AVG(salary) > (SELECT AVG(salary) FROM employees);
```

### Row Subquery (Returns single row)
```sql
SELECT * FROM employees
WHERE (department, salary) = (
    SELECT department, MAX(salary)
    FROM employees
    GROUP BY department
    LIMIT 1
);
```

### Column Subquery (Returns single column)
```sql
-- IN operator
SELECT * FROM employees
WHERE department_id IN (
    SELECT id FROM departments WHERE location = 'NYC'
);

-- NOT IN (watch out for NULLs!)
SELECT * FROM employees
WHERE department_id NOT IN (
    SELECT id FROM departments WHERE location = 'NYC'
);

-- EXISTS (more efficient than IN for large datasets)
SELECT * FROM employees e
WHERE EXISTS (
    SELECT 1 FROM departments d
    WHERE d.id = e.department_id 
    AND d.location = 'NYC'
);

-- NOT EXISTS
SELECT * FROM employees e
WHERE NOT EXISTS (
    SELECT 1 FROM departments d
    WHERE d.id = e.department_id 
    AND d.location = 'NYC'
);
```

### Correlated Subquery
```sql
-- Subquery references outer query
SELECT 
    e1.name,
    e1.salary,
    (SELECT COUNT(*) 
     FROM employees e2 
     WHERE e2.salary > e1.salary) AS higher_salary_count
FROM employees e1;

-- Find employees earning more than department average
SELECT e1.*
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e1.department_id
);
```

### Derived Tables (Subquery in FROM)
```sql
SELECT 
    dept_stats.department,
    dept_stats.avg_salary,
    e.name
FROM (
    SELECT 
        department_id,
        AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department_id
) AS dept_stats
INNER JOIN employees e 
    ON e.department_id = dept_stats.department_id
WHERE e.salary > dept_stats.avg_salary;
```

### Common Table Expression (CTE)
```sql
-- WITH clause (more readable than derived tables)
WITH dept_stats AS (
    SELECT 
        department_id,
        AVG(salary) AS avg_salary
    FROM employees
    GROUP BY department_id
)
SELECT 
    d.department_name,
    ds.avg_salary,
    e.name,
    e.salary
FROM dept_stats ds
INNER JOIN departments d ON ds.department_id = d.id
INNER JOIN employees e ON e.department_id = ds.department_id
WHERE e.salary > ds.avg_salary;

-- Multiple CTEs
WITH 
    high_earners AS (
        SELECT * FROM employees WHERE salary > 80000
    ),
    dept_counts AS (
        SELECT department_id, COUNT(*) AS count
        FROM high_earners
        GROUP BY department_id
    )
SELECT 
    d.department_name,
    dc.count
FROM dept_counts dc
INNER JOIN departments d ON dc.department_id = d.id;
```

### Recursive CTE
```sql
-- Hierarchical data (e.g., manager-employee relationships)
WITH RECURSIVE org_chart AS (
    -- Base case: top-level managers
    SELECT id, name, manager_id, 1 AS level
    FROM employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive case
    SELECT e.id, e.name, e.manager_id, oc.level + 1
    FROM employees e
    INNER JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT * FROM org_chart ORDER BY level, name;
```

---

## 🪟 WINDOW FUNCTIONS

### ROW_NUMBER()
```sql
-- Assign sequential numbers
SELECT 
    name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank
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
```

### RANK() & DENSE_RANK()
```sql
-- RANK: Gaps in ranking for ties
SELECT 
    name,
    salary,
    RANK() OVER (ORDER BY salary DESC) AS rank
FROM employees;
-- If two people have same salary, both get rank 1, next gets rank 3

-- DENSE_RANK: No gaps
SELECT 
    name,
    salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) AS rank
FROM employees;
-- If two people have same salary, both get rank 1, next gets rank 2
```

### NTILE()
```sql
-- Divide into buckets
SELECT 
    name,
    salary,
    NTILE(4) OVER (ORDER BY salary DESC) AS quartile
FROM employees;
-- Divides into 4 equal groups
```

### LAG() & LEAD()
```sql
-- Previous/Next value
SELECT 
    date,
    sales,
    LAG(sales, 1) OVER (ORDER BY date) AS prev_sales,
    LEAD(sales, 1) OVER (ORDER BY date) AS next_sales,
    sales - LAG(sales, 1) OVER (ORDER BY date) AS change
FROM daily_sales;

-- With partition
SELECT 
    department,
    date,
    sales,
    LAG(sales, 1) OVER (
        PARTITION BY department 
        ORDER BY date
    ) AS prev_dept_sales
FROM sales;
```

### FIRST_VALUE() & LAST_VALUE()
```sql
-- First/Last value in window
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

### Aggregate Window Functions
```sql
-- Running totals
SELECT 
    date,
    sales,
    SUM(sales) OVER (ORDER BY date) AS running_total
FROM daily_sales;

-- Moving average
SELECT 
    date,
    sales,
    AVG(sales) OVER (
        ORDER BY date 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_avg_3days
FROM daily_sales;

-- Partitioned aggregates
SELECT 
    department,
    name,
    salary,
    AVG(salary) OVER (PARTITION BY department) AS dept_avg,
    MAX(salary) OVER (PARTITION BY department) AS dept_max
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
    -- RANGE: Logical range
    SUM(sales) OVER (
        ORDER BY date 
        RANGE BETWEEN INTERVAL '2' DAY PRECEDING AND CURRENT ROW
    ) AS sum_range
FROM daily_sales;

-- Common frames
-- Unbounded preceding to current row
SUM(sales) OVER (ORDER BY date ROWS UNBOUNDED PRECEDING)

-- Current row to unbounded following
SUM(sales) OVER (ORDER BY date ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING)

-- N preceding to M following
SUM(sales) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING)
```

---

## 🎯 COMMON PATTERNS

### Find Duplicates
```sql
-- Using GROUP BY
SELECT email, COUNT(*) AS count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Using window function
SELECT email, name
FROM (
    SELECT 
        email,
        name,
        ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
    FROM users
) t
WHERE rn > 1;
```

### Find Nth Highest/Lowest
```sql
-- Nth highest salary
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET (n - 1);

-- Using window function
SELECT salary
FROM (
    SELECT 
        salary,
        DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) t
WHERE rnk = n;
```

### Top N per Group
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
WHERE rn <= 3;
```

### Compare with Previous/Next
```sql
-- Employees with salary increase
SELECT 
    e1.name,
    e1.salary AS current_salary,
    e2.salary AS previous_salary,
    e1.salary - e2.salary AS increase
FROM employees e1
LEFT JOIN employees e2 
    ON e1.id = e2.id + 1  -- Assuming sequential IDs
WHERE e1.salary > e2.salary;

-- Using LAG
SELECT 
    name,
    salary,
    LAG(salary) OVER (ORDER BY id) AS prev_salary,
    salary - LAG(salary) OVER (ORDER BY id) AS increase
FROM employees;
```

### Find Missing Values
```sql
-- Missing IDs in sequence
WITH RECURSIVE numbers AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < (SELECT MAX(id) FROM employees)
)
SELECT n AS missing_id
FROM numbers
WHERE n NOT IN (SELECT id FROM employees);

-- Or using generate_series (PostgreSQL)
SELECT generate_series(1, (SELECT MAX(id) FROM employees)) AS missing_id
EXCEPT
SELECT id FROM employees;
```

### Pivot Data
```sql
-- Using CASE (standard SQL)
SELECT 
    department,
    SUM(CASE WHEN role = 'Manager' THEN 1 ELSE 0 END) AS managers,
    SUM(CASE WHEN role = 'Developer' THEN 1 ELSE 0 END) AS developers,
    SUM(CASE WHEN role = 'Analyst' THEN 1 ELSE 0 END) AS analysts
FROM employees
GROUP BY department;

-- Using PIVOT (SQL Server, Oracle)
SELECT * FROM (
    SELECT department, role, id
    FROM employees
) AS source
PIVOT (
    COUNT(id)
    FOR role IN ([Manager], [Developer], [Analyst])
) AS pivot_table;
```

### Date Operations
```sql
-- Date difference
SELECT 
    name,
    hire_date,
    DATEDIFF(CURDATE(), hire_date) AS days_employed  -- MySQL
FROM employees;

SELECT 
    name,
    hire_date,
    CURRENT_DATE - hire_date AS days_employed  -- PostgreSQL
FROM employees;

-- Extract date parts
SELECT 
    name,
    EXTRACT(YEAR FROM hire_date) AS hire_year,
    EXTRACT(MONTH FROM hire_date) AS hire_month
FROM employees;

-- Date formatting
SELECT 
    name,
    DATE_FORMAT(hire_date, '%Y-%m-%d') AS formatted_date  -- MySQL
FROM employees;

SELECT 
    name,
    TO_CHAR(hire_date, 'YYYY-MM-DD') AS formatted_date  -- PostgreSQL
FROM employees;
```

---

## 🗄️ DATA TYPES & CONSTRAINTS

### Common Data Types
```sql
-- Numeric
INT, BIGINT, SMALLINT, TINYINT
DECIMAL(10, 2), NUMERIC(10, 2)
FLOAT, DOUBLE, REAL

-- String
VARCHAR(n), CHAR(n)
TEXT, LONGTEXT

-- Date/Time
DATE, TIME, DATETIME, TIMESTAMP
YEAR

-- Boolean
BOOLEAN, BOOL, TINYINT(1)

-- Binary
BLOB, LONGBLOB
```

### Constraints
```sql
-- Primary Key
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Foreign Key
CREATE TABLE employees (
    id INT PRIMARY KEY,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Unique
CREATE TABLE users (
    id INT PRIMARY KEY,
    email VARCHAR(100) UNIQUE
);

-- Not Null
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Check
CREATE TABLE employees (
    id INT PRIMARY KEY,
    salary DECIMAL(10, 2) CHECK (salary > 0)
);

-- Default
CREATE TABLE employees (
    id INT PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'Active'
);
```

---

## ⚡ PERFORMANCE TIPS

### Indexing
```sql
-- Create index
CREATE INDEX idx_department ON employees(department_id);
CREATE INDEX idx_name ON employees(name);

-- Composite index
CREATE INDEX idx_dept_salary ON employees(department_id, salary);

-- Unique index
CREATE UNIQUE INDEX idx_email ON users(email);
```

### Query Optimization
```sql
-- 1. Use WHERE before JOIN
-- Bad
SELECT * FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE e.salary > 50000;

-- Better (filter early)
SELECT * FROM employees e
WHERE e.salary > 50000
JOIN departments d ON e.department_id = d.id;

-- 2. Use EXISTS instead of IN for large subqueries
-- Bad
SELECT * FROM employees
WHERE department_id IN (SELECT id FROM departments WHERE ...);

-- Better
SELECT * FROM employees e
WHERE EXISTS (
    SELECT 1 FROM departments d 
    WHERE d.id = e.department_id AND ...
);

-- 3. Avoid SELECT *
SELECT id, name, salary FROM employees;  -- Instead of SELECT *

-- 4. Use LIMIT for testing
SELECT * FROM employees LIMIT 100;

-- 5. Use appropriate JOIN types
-- Use INNER JOIN when you only need matches
-- Use LEFT JOIN when you need all from left table
```

### Common Pitfalls
```sql
-- NULL handling
-- Bad: NULL comparisons
SELECT * FROM employees WHERE manager_id = NULL;  -- Wrong!

-- Good: Use IS NULL
SELECT * FROM employees WHERE manager_id IS NULL;

-- NULL in aggregations
SELECT AVG(salary) FROM employees;  -- Excludes NULL automatically
SELECT COUNT(*) FROM employees;  -- Counts all rows
SELECT COUNT(manager_id) FROM employees;  -- Excludes NULL

-- String comparison
-- Case-sensitive (depends on collation)
SELECT * FROM employees WHERE name = 'john';  -- May not match 'John'

-- Use LOWER() or UPPER() for case-insensitive
SELECT * FROM employees WHERE LOWER(name) = 'john';
```

---

## 🎓 INTERVIEW QUESTION PATTERNS

### Pattern 1: Find Maximum/Minimum
```sql
-- Employee with highest salary
SELECT * FROM employees
WHERE salary = (SELECT MAX(salary) FROM employees);

-- Or using window function
SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn
    FROM employees
) t WHERE rn = 1;
```

### Pattern 2: Compare with Average
```sql
-- Employees earning more than average
SELECT * FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- More than department average
SELECT e1.*
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e1.department_id
);
```

### Pattern 3: Find Records Not in Another Table
```sql
-- Employees without projects
SELECT * FROM employees e
WHERE NOT EXISTS (
    SELECT 1 FROM projects p 
    WHERE p.employee_id = e.id
);

-- Or using LEFT JOIN
SELECT e.*
FROM employees e
LEFT JOIN projects p ON e.id = p.employee_id
WHERE p.id IS NULL;
```

### Pattern 4: Count with Conditions
```sql
-- Count employees by salary range
SELECT 
    CASE 
        WHEN salary < 50000 THEN 'Low'
        WHEN salary < 80000 THEN 'Medium'
        ELSE 'High'
    END AS salary_range,
    COUNT(*) AS count
FROM employees
GROUP BY 
    CASE 
        WHEN salary < 50000 THEN 'Low'
        WHEN salary < 80000 THEN 'Medium'
        ELSE 'High'
    END;
```

### Pattern 5: Self-Join for Hierarchies
```sql
-- Employee and their manager
SELECT 
    e.name AS employee,
    m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

-- All employees under a manager
WITH RECURSIVE subordinates AS (
    SELECT id, name, manager_id, 0 AS level
    FROM employees
    WHERE manager_id = 1  -- Manager ID
    
    UNION ALL
    
    SELECT e.id, e.name, e.manager_id, s.level + 1
    FROM employees e
    INNER JOIN subordinates s ON e.manager_id = s.id
)
SELECT * FROM subordinates;
```

### Pattern 6: Running Totals
```sql
-- Cumulative sales
SELECT 
    date,
    sales,
    SUM(sales) OVER (ORDER BY date) AS running_total
FROM daily_sales;
```

### Pattern 7: Find Consecutive Records
```sql
-- Employees with consecutive login days
SELECT 
    user_id,
    login_date,
    LAG(login_date) OVER (PARTITION BY user_id ORDER BY login_date) AS prev_date
FROM logins
WHERE login_date - LAG(login_date) OVER (
    PARTITION BY user_id 
    ORDER BY login_date
) = 1;
```

### Pattern 8: Rank Within Groups
```sql
-- Rank employees within departments
SELECT 
    department,
    name,
    salary,
    RANK() OVER (
        PARTITION BY department 
        ORDER BY salary DESC
    ) AS dept_rank
FROM employees;
```

---

## 📝 QUICK REFERENCE

### Operator Precedence
1. Parentheses `()`
2. Arithmetic: `*`, `/`, `%`, `+`, `-`
3. Comparison: `=`, `!=`, `<`, `>`, `<=`, `>=`, `LIKE`, `IN`, `BETWEEN`
4. Logical: `NOT`, `AND`, `OR`

### NULL Behavior
- `NULL = NULL` → `NULL` (not TRUE!)
- `NULL != NULL` → `NULL`
- Use `IS NULL` / `IS NOT NULL`
- Aggregations ignore NULL (except COUNT(*))

### String Functions
```sql
CONCAT(str1, str2, ...)  -- Concatenate
SUBSTRING(str, start, length)  -- Extract substring
LENGTH(str)  -- String length
UPPER(str), LOWER(str)  -- Case conversion
TRIM(str)  -- Remove whitespace
REPLACE(str, old, new)  -- Replace substring
```

### Date Functions
```sql
CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP
DATE_ADD(date, INTERVAL n DAY)
DATE_SUB(date, INTERVAL n DAY)
EXTRACT(YEAR FROM date)
DATEDIFF(date1, date2)
```

### Set Operations
```sql
-- UNION (removes duplicates)
SELECT * FROM table1
UNION
SELECT * FROM table2;

-- UNION ALL (keeps duplicates)
SELECT * FROM table1
UNION ALL
SELECT * FROM table2;

-- INTERSECT (common records)
SELECT * FROM table1
INTERSECT
SELECT * FROM table2;

-- EXCEPT / MINUS (records in first but not second)
SELECT * FROM table1
EXCEPT
SELECT * FROM table2;
```

---

## 💡 INTERVIEW TIPS

1. **Clarify Requirements**
   - Ask about edge cases (NULLs, duplicates, empty results)
   - Clarify if you need all records or just one
   - Understand the data model

2. **Think Step by Step**
   - Break down complex queries
   - Start with simple SELECT, then add complexity
   - Use CTEs for readability

3. **Consider Performance**
   - Mention indexing strategies
   - Discuss query optimization
   - Consider NULL handling

4. **Test Your Query**
   - Think about edge cases
   - What if table is empty?
   - What if there are NULLs?
   - What if there are duplicates?

5. **Common Mistakes to Avoid**
   - Using `=` with NULL (use `IS NULL`)
   - Forgetting GROUP BY with aggregates
   - Confusing WHERE and HAVING
   - Not handling duplicates when needed
   - Using SELECT * in production

6. **Know Your Database**
   - MySQL vs PostgreSQL vs SQL Server syntax differences
   - Window function support
   - Date function differences

---

**Good luck with your SQL interview! 🚀**

