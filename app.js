const express = require("express");
const pool = require("./db");

const app = express();

app.use(express.json());


// 1. CREATE ASSIGNMENT
app.post("/assignments", async (req, res) => {
  const { title, deadline } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO assignments (title, deadline)
       VALUES ($1, $2)
       RETURNING *`,
      [title, deadline]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// 2. GET ALL ASSIGNMENTS / FILTER SUBMITTED
app.get("/assignments", async (req, res) => {
  const { submitted } = req.query;

  try {
    let result;

    if (submitted === "true") {
      result = await pool.query(
        `SELECT * FROM assignments
         WHERE submitted = $1
         ORDER BY id DESC`,
        [true]
      );
    } else {
      result = await pool.query(
        `SELECT * FROM assignments
         ORDER BY id DESC`
      );
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 3. MARK ASSIGNMENT AS SUBMITTED
app.patch("/assignments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE assignments
       SET submitted = true
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});