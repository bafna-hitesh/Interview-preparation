# SQL 10-Minute Quick Revision
## Interview Prep - Key Concepts & Patterns

---

## 🎯 WHAT YOU NEED TO KNOW

### 1. SECOND HIGHEST / NTH HIGHEST

**Concept:** Find the 2nd, 3rd, or Nth highest value in a column.

**Method 1: LIMIT + OFFSET (Easiest)**
```sql
-- 2nd highest salary
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;

-- Nth highest: LIMIT 1 OFFSET (N-1)
-- For 3rd highest: LIMIT 1 OFFSET 2
```

**Method 2: Window Function (Best for duplicates)**
```sql
-- 2nd highest (handles duplicates properly)
SELECT DISTINCT salary
FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) t
WHERE rnk = 2;
```

**Key Points:**
- Use `DISTINCT` to handle duplicate salaries
- Filter `NULL` values first: `WHERE salary IS NOT NULL`
- If no 2nd highest exists, returns empty (correct behavior)

---

### 2. TOP N PER GROUP

**Concept:** Get top 3 employees in EACH department (not overall top 3).

**Solution: Window Function with PARTITION BY**
```sql
-- Top 3 salaries per department
SELECT department, name, salary
FROM (
    SELECT 
        department,
        name,
        salary,
        ROW_NUMBER() OVER (
            PARTITION BY department    -- Group by department
            ORDER BY salary DESC       -- Sort within each group
        ) AS rn
    FROM employees
) t
WHERE rn <= 3;  -- Top 3 in each department
```

**What is PARTITION BY?**
- Think of it as "GROUP BY for window functions"
- Creates separate groups, then ranks within each group
- `PARTITION BY department` = "for each department separately"

**ROW_NUMBER vs DENSE_RANK:**
- `ROW_NUMBER()`: Always gives 1, 2, 3... (even if tied)
- `DENSE_RANK()`: If 2 people tie for 1st, both get rank 1, next gets rank 2
- Use `ROW_NUMBER()` when you want exactly N rows per group

---

### 3. JOINS + AGGREGATION (GROUP BY + HAVING)

**Concept:** Combine data from multiple tables, then group and filter.

**Pattern:**
```sql
SELECT 
    d.department_name,
    COUNT(e.id) AS employee_count,
    AVG(e.salary) AS avg_salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
GROUP BY d.department_name
HAVING COUNT(e.id) > 10 AND AVG(e.salary) > 50000;
```

**Key Differences:**
- **WHERE**: Filters rows BEFORE grouping
- **HAVING**: Filters groups AFTER grouping
- **GROUP BY**: Must include all non-aggregated columns

**Common Mistake:**
```sql
-- ❌ WRONG: Can't use aggregate in WHERE
WHERE AVG(salary) > 50000

-- ✅ CORRECT: Use HAVING
HAVING AVG(salary) > 50000
```

**Execution Order (Remember This!):**
1. FROM (get tables)
2. WHERE (filter rows)
3. GROUP BY (group rows)
4. HAVING (filter groups)
5. SELECT (choose columns)
6. ORDER BY (sort)

---

### 4. WINDOW FUNCTIONS

**Concept:** Perform calculations across a set of rows without grouping them.

**Key Window Functions:**

#### ROW_NUMBER() - Sequential numbering
```sql
SELECT 
    name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank
FROM employees;
-- Output: 1, 2, 3, 4... (always sequential)
```

#### RANK() vs DENSE_RANK()
```sql
-- If salaries are: 100, 100, 90, 80
SELECT 
    salary,
    RANK() OVER (ORDER BY salary DESC) AS rank,        -- 1, 1, 3, 4 (gaps)
    DENSE_RANK() OVER (ORDER BY salary DESC) AS dense  -- 1, 1, 2, 3 (no gaps)
FROM employees;
```

#### SUM() OVER - Running Totals
```sql
-- Cumulative sum (running total)
SELECT 
    date,
    sales,
    SUM(sales) OVER (ORDER BY date) AS running_total
FROM daily_sales;

-- Output:
-- date    sales  running_total
-- 2024-01-01  100   100
-- 2024-01-02  150   250
-- 2024-01-03  200   450
```

**What is OVER()?**
- `OVER()` defines the "window" of rows to calculate over
- `ORDER BY` inside OVER = "calculate in this order"
- `PARTITION BY` = "calculate separately for each group"

**Example:**
```sql
-- Running total per department
SELECT 
    department,
    date,
    sales,
    SUM(sales) OVER (
        PARTITION BY department  -- Separate calculation per dept
        ORDER BY date            -- In date order
    ) AS dept_running_total
FROM sales;
```

---

### 5. EDGE CASES: NULLs & DUPLICATES

#### NULL Handling

**Rule: NULL is not equal to anything, not even NULL!**

```sql
-- ❌ WRONG: This returns NOTHING
WHERE salary = NULL

-- ✅ CORRECT: Use IS NULL
WHERE salary IS NULL
WHERE salary IS NOT NULL
```

**NULL in Aggregations:**
- `COUNT(*)` - counts all rows (including NULL)
- `COUNT(column)` - excludes NULL values
- `AVG()`, `SUM()`, `MAX()`, `MIN()` - automatically exclude NULL

```sql
-- Count employees (including those with NULL salary)
SELECT COUNT(*) FROM employees;

-- Count employees with salary (excludes NULL)
SELECT COUNT(salary) FROM employees;
```

**Filter NULLs First:**
```sql
-- Always filter NULLs before calculations
SELECT AVG(salary) 
FROM employees 
WHERE salary IS NOT NULL;
```

#### Duplicates

**Finding Duplicates:**
```sql
-- Find duplicate emails
SELECT email, COUNT(*) AS count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

**Removing Duplicates:**
```sql
-- Use DISTINCT
SELECT DISTINCT email FROM users;

-- Or use window function to keep one
SELECT email, name
FROM (
    SELECT 
        email, name,
        ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
    FROM users
) t
WHERE rn = 1;
```

---

## 📝 QUICK PATTERN REFERENCE

### Pattern 1: Second Highest
```sql
SELECT DISTINCT salary
FROM employees
WHERE salary IS NOT NULL
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
```

### Pattern 2: Top N per Group
```sql
SELECT * FROM (
    SELECT 
        *,
        ROW_NUMBER() OVER (PARTITION BY group_col ORDER BY value_col DESC) AS rn
    FROM table
) t
WHERE rn <= N;
```

### Pattern 3: Join + Aggregate + Filter
```sql
SELECT 
    d.name,
    COUNT(e.id) AS count,
    AVG(e.salary) AS avg_sal
FROM employees e
JOIN departments d ON e.dept_id = d.id
GROUP BY d.name
HAVING COUNT(e.id) > 10;
```

### Pattern 4: Running Total
```sql
SELECT 
    *,
    SUM(value) OVER (ORDER BY date) AS running_total
FROM table;
```

### Pattern 5: Compare with Average
```sql
-- Employees above department average
SELECT * FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department = e1.department
);
```

---

## 🎯 COMMON INTERVIEW QUESTIONS

### Q1: Second Highest Salary
```sql
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
```

### Q2: Top 3 Salaries per Department
```sql
SELECT department, name, salary
FROM (
    SELECT 
        department, name, salary,
        ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
    FROM employees
) t
WHERE rn <= 3;
```

### Q3: Departments with Avg Salary > Company Avg
```sql
SELECT 
    d.department_name,
    AVG(e.salary) AS dept_avg
FROM employees e
JOIN departments d ON e.department_id = d.id
GROUP BY d.department_name
HAVING AVG(e.salary) > (SELECT AVG(salary) FROM employees);
```

### Q4: Running Total of Sales
```sql
SELECT 
    date,
    sales,
    SUM(sales) OVER (ORDER BY date) AS running_total
FROM daily_sales;
```

### Q5: Employees Earning More Than Dept Average
```sql
SELECT e1.*
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e1.department_id
);
```

---

## ⚠️ COMMON MISTAKES TO AVOID

1. **Using aggregate in WHERE**
   ```sql
   -- ❌ WHERE AVG(salary) > 50000
   -- ✅ HAVING AVG(salary) > 50000
   ```

2. **Comparing with NULL**
   ```sql
   -- ❌ WHERE salary = NULL
   -- ✅ WHERE salary IS NULL
   ```

3. **Missing columns in GROUP BY**
   ```sql
   -- ❌ SELECT dept, role, AVG(salary) GROUP BY dept
   -- ✅ SELECT dept, role, AVG(salary) GROUP BY dept, role
   ```

4. **Not using DISTINCT for duplicates**
   ```sql
   -- If multiple people have 2nd highest salary
   -- Use DISTINCT or handle with window functions
   ```

5. **COUNT(*) vs COUNT(column)**
   ```sql
   -- COUNT(*) counts all rows
   -- COUNT(column) excludes NULL
   ```

---

## 💡 KEY CONCEPTS EXPLAINED

### What is a Window Function?
- Regular aggregate (SUM, AVG) collapses rows into one result
- Window function keeps all rows but adds calculated column
- Example: Instead of "total sales", you get "running total" for each row

### What is PARTITION BY?
- Like GROUP BY but for window functions
- Creates separate groups, then calculates within each
- `PARTITION BY department` = "do this separately for each department"

### What is HAVING?
- WHERE filters rows before grouping
- HAVING filters groups after grouping
- Use HAVING when filtering on aggregates (COUNT, AVG, etc.)

### What is a Correlated Subquery?
- Subquery that references outer query
- Runs once per row in outer query
- Example: "For each employee, find average salary in their department"

---

## 🚀 LAST MINUTE TIPS

1. **Always think about NULLs** - Filter them first
2. **Remember execution order** - FROM → WHERE → GROUP BY → HAVING → SELECT
3. **Use DISTINCT** when dealing with duplicates
4. **Window functions keep all rows** - Aggregates collapse rows
5. **PARTITION BY = GROUP BY for windows**
6. **HAVING for aggregate filters, WHERE for row filters**

---

**You've got this! 🎯**

